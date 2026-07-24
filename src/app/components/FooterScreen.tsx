"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function FooterScreen({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
  });

  // Base X for N=2 is 80 (since N*40, so 2*40 = 80)
  const baseX = 80;

  // Render only when close to N=2
  if (scrollProgress < 3.5) return null;

  return (
    <group position={[baseX, 0, -2]} ref={groupRef}>
      <Html transform center distanceFactor={12} position={[0, 0, 0]}>
        <div style={{
          background: "linear-gradient(135deg, rgba(15, 15, 20, 0.8), rgba(5, 5, 8, 0.9))",
          border: "1px solid rgba(0, 240, 255, 0.3)",
          boxShadow: "0 0 40px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.05)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          padding: "4rem 5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "600px",
          color: "white",
          fontFamily: "'Space Grotesk', sans-serif"
        }}>
          {/* Logo / Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem"
          }}>
            <div style={{
              width: "50px", height: "50px",
              borderRadius: "50%",
              background: "rgba(0, 240, 255, 0.1)",
              border: "1px solid rgba(0, 240, 255, 0.5)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: 0, letterSpacing: "0.2em", background: "linear-gradient(to right, #fff, #88ccff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              RJ INDUSTRIES
            </h1>
          </div>

          <p style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", fontSize: "1.1rem", marginBottom: "3rem", letterSpacing: "0.05em" }}>
            Pioneering the future of aerospace, defense, and advanced manufacturing. Let&apos;s build what&apos;s next.
          </p>

          {/* Links Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            width: "100%"
          }}>
            <a href="https://www.linkedin.com/company/rj-industries01/" target="_blank" rel="noreferrer" style={linkStyle}>
              LINKEDIN
            </a>
            <a href="https://www.instagram.com/rj_industries01/" target="_blank" rel="noreferrer" style={linkStyle}>
              INSTAGRAM
            </a>
            <a href="mailto:contact@rjindustries.dev" style={linkStyle}>
              EMAIL
            </a>
            <a href="tel:+918208812534" style={{...linkStyle, background: "rgba(0, 240, 255, 0.1)", borderColor: "rgba(0, 240, 255, 0.5)", color: "#00f0ff"}}>
              CALL SECURE LINE
            </a>
          </div>

          <div style={{ marginTop: "3rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em" }}>
            SYSTEM ONLINE // KINETIC CORE
          </div>
        </div>
      </Html>
    </group>
  );
}

const linkStyle: React.CSSProperties = {
  padding: "1.2rem",
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  color: "white",
  textDecoration: "none",
  textAlign: "center",
  letterSpacing: "0.15em",
  fontSize: "0.9rem",
  fontWeight: 500,
  transition: "all 0.3s ease",
  cursor: "pointer"
};
