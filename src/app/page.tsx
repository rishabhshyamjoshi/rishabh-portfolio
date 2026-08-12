"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
import OverlayUI from "./components/OverlayUI";
import Mobile2DView from "./components/Mobile2DView";
import { AudioController } from "./utils/AudioController";
import { useMediaQuery } from "./hooks/useMediaQuery";

// Load scene dynamically to avoid SSR issues with Three.js
const Scene = dynamic(() => import("./components/Scene"), {
  ssr: false,
});

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  // Pre-initialize audio engine on first user gesture so it's ready when they unmute
  React.useEffect(() => {
    const preInit = () => {
      AudioController.getInstance().init();
    };
    
    window.addEventListener("pointerdown", preInit, { once: true });
    window.addEventListener("wheel", preInit, { once: true });
    
    return () => {
      window.removeEventListener("pointerdown", preInit);
      window.removeEventListener("wheel", preInit);
    };
  }, []);

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <main style={{ position: "relative", width: "100vw", height: "100vh", overflow: isMobile ? "auto" : "hidden" }}>
      {!loaded && !isMobile && <Preloader onComplete={handlePreloaderComplete} />}

      {isMobile ? (
        <Mobile2DView />
      ) : (
        <>
          {/* R3F WebGL Scene */}
          <Scene />
          
          {/* HTML DOM Overlay */}
          {loaded && <OverlayUI />}
        </>
      )}
    </main>
  );
}
