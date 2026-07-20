"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { AudioController } from "../utils/AudioController";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const { progress: realProgress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    if (realProgress > displayProgress) {
      setDisplayProgress(Math.floor(realProgress));
    }
    
    if (realProgress >= 100 && phase === "loading") {
      setDisplayProgress(100);
      
      // Short delay at 100% before revealing for satisfying UX
      setTimeout(() => {
        try {
          const audio = AudioController.getInstance();
          audio.init();
        } catch(e) {}
        
        setPhase("reveal");
        setTimeout(() => {
          setPhase("done");
          window.dispatchEvent(new CustomEvent("preloaderComplete"));
          setTimeout(onComplete, 500);
        }, 600);
      }, 600);
    }
  }, [realProgress, displayProgress, phase, onComplete]);

  // UX Fallback: Force complete after 15 seconds just in case network hangs
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (phase === "loading") {
        setDisplayProgress(100);
        setPhase("reveal");
        setTimeout(() => {
          setPhase("done");
          window.dispatchEvent(new CustomEvent("preloaderComplete"));
          setTimeout(onComplete, 500);
        }, 600);
      }
    }, 15000);
    return () => clearTimeout(fallback);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3rem",
        opacity: phase === "reveal" ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "clamp(0.6rem, 1.2vw, 0.85rem)",
          fontWeight: 400,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "#fff",
          opacity: displayProgress > 10 ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        RJ INDUSTRIES
      </div>

      {phase === "loading" && (
        <>
          <div
            style={{
              width: "clamp(120px, 20vw, 200px)",
              height: "1px",
              background: "rgba(255,255,255,0.1)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${displayProgress}%`,
                background: "#fff",
                transition: "width 0.2s ease-out",
              }}
            />
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)" }}>
            {displayProgress}%
          </div>
        </>
      )}
    </div>
  );
}
