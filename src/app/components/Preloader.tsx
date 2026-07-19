"use client";

import { useState, useEffect } from "react";
import { AudioController } from "../utils/AudioController";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const duration = 2800; 

    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(elapsed / duration, 1);
      
      const eased = pct < 0.5 ? 4 * pct * pct * pct : 1 - Math.pow(-2 * pct + 2, 3) / 2;
      setProgress(Math.round(eased * 100));

      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Auto-enter
        try {
          const audio = AudioController.getInstance();
          audio.init();
        } catch(e) {}
        
        setPhase("reveal");
        setTimeout(() => {
          setPhase("done");
          setTimeout(onComplete, 500);
        }, 600);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

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
          opacity: progress > 10 ? 1 : 0,
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
                width: `${progress}%`,
                background: "#fff",
                transition: "width 0.05s linear",
              }}
            />
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)" }}>
            {progress}%
          </div>
        </>
      )}
    </div>
  );
}
