"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const FOOTER_LINKS = [
  { text: "INSTAGRAM", url: "https://www.instagram.com/rj_industries01/", icon: "📸" },
  { text: "LINKEDIN", url: "https://www.linkedin.com/company/rj-industries01/", icon: "💼" },
  { text: "EMAIL", url: "mailto:contact@rjindustries.dev", icon: "✉️" },
  { text: "SECURE LINE", url: "tel:+918208812534", icon: "📞" },
];

function FloatingPlate({ text, url, icon, position, delay }: { text: string, url: string, icon: string, position: [number, number, number], delay: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5 + delay) * 0.4;
      meshRef.current.rotation.z = Math.sin(t * 0.8 + delay) * 0.05;
      meshRef.current.rotation.x = Math.sin(t * 1.2 + delay) * 0.05;
      
      const targetScale = hovered ? 1.15 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Html transform center distanceFactor={12}>
        <a 
          href={url}
          target={url.startsWith("http") ? "_blank" : "_self"}
          rel="noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: hovered 
              ? "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 100, 255, 0.3))"
              : "linear-gradient(135deg, rgba(15, 15, 20, 0.6), rgba(5, 5, 8, 0.8))",
            border: hovered 
              ? "1px solid rgba(0, 240, 255, 0.8)" 
              : "1px solid rgba(0, 240, 255, 0.2)",
            boxShadow: hovered 
              ? "0 0 30px rgba(0, 240, 255, 0.4), inset 0 0 20px rgba(0, 240, 255, 0.2)"
              : "0 10px 30px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "1.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "200px",
            color: hovered ? "#fff" : "rgba(255,255,255,0.8)",
            fontFamily: "'Space Grotesk', sans-serif",
            textDecoration: "none",
            transition: "all 0.3s ease",
            cursor: "pointer",
            transform: hovered ? "translateZ(20px)" : "translateZ(0)"
          }}
        >
          <div style={{ 
            fontSize: "2rem", 
            marginBottom: "0.8rem",
            filter: hovered ? "drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))" : "none",
            transition: "all 0.3s ease"
          }}>
            {icon}
          </div>
          <div style={{ 
            fontSize: "0.9rem", 
            letterSpacing: "0.15em", 
            fontWeight: hovered ? 700 : 500,
            textShadow: hovered ? "0 0 10px rgba(255,255,255,0.5)" : "none",
          }}>
            {text}
          </div>
        </a>
      </Html>
    </group>
  );
}

export default function FooterScreen({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.3) * 0.2;
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.05;
  });

  const baseX = 80;
  if (scrollProgress < 3.5) return null;

  return (
    <group position={[baseX, 0, -2]} ref={groupRef}>
      
      {/* Central Holographic Title */}
      <Html transform center distanceFactor={15} position={[0, 4, 0]}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "'Space Grotesk', sans-serif",
          pointerEvents: "none"
        }}>
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: 800, 
            margin: 0, 
            letterSpacing: "0.3em", 
            color: "white",
            textShadow: "0 0 20px rgba(0, 240, 255, 0.5)"
          }}>
            RJ INDUSTRIES
          </h1>
          <div style={{
            fontSize: "1rem",
            color: "#00f0ff",
            letterSpacing: "0.5em",
            marginTop: "1rem",
            animation: "pulse 2s infinite"
          }}>
            INITIATE CONTACT PROTOCOL
          </div>
        </div>
      </Html>

      {/* Floating Plates */}
      <FloatingPlate 
        text={FOOTER_LINKS[0].text} url={FOOTER_LINKS[0].url} icon={FOOTER_LINKS[0].icon}
        position={[-6, 0, 2]} delay={0} 
      />
      <FloatingPlate 
        text={FOOTER_LINKS[1].text} url={FOOTER_LINKS[1].url} icon={FOOTER_LINKS[1].icon}
        position={[-2, -1.5, 4]} delay={1.2} 
      />
      <FloatingPlate 
        text={FOOTER_LINKS[2].text} url={FOOTER_LINKS[2].url} icon={FOOTER_LINKS[2].icon}
        position={[2, 0.5, 3]} delay={2.4} 
      />
      <FloatingPlate 
        text={FOOTER_LINKS[3].text} url={FOOTER_LINKS[3].url} icon={FOOTER_LINKS[3].icon}
        position={[6, -1, 1]} delay={0.8} 
      />
      
    </group>
  );
}

