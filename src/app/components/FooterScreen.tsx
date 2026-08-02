"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const FOOTER_LINKS = [
  { text: "INSTAGRAM", url: "https://www.instagram.com/rj_industries01/" },
  { text: "MOBILE", url: "tel:+918208812534" },
  { text: "EMAIL", url: "mailto:contact@rjindustries.dev" },
  { text: "LINKEDIN", url: "https://www.linkedin.com/company/rj-industries01/" },
];

function FooterLink({ text, url, position }: { text: string, url: string, position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.2;
      const targetScale = hovered ? 1.15 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Html transform center distanceFactor={10}>
        <a
          href={url}
          target={url.startsWith("http") ? "_blank" : "_self"}
          rel="noreferrer"
          onMouseEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
          onMouseLeave={() => { setHovered(false); document.body.style.cursor = "auto"; }}
          style={{
            background: hovered
              ? "linear-gradient(135deg, rgba(0,240,255,0.2), rgba(0,100,255,0.3))"
              : "linear-gradient(135deg, rgba(15,15,20,0.6), rgba(5,5,8,0.8))",
            border: hovered ? "1px solid rgba(0,240,255,0.8)" : "1px solid rgba(0,240,255,0.2)",
            boxShadow: hovered
              ? "0 0 30px rgba(0,240,255,0.4), inset 0 0 20px rgba(0,240,255,0.2)"
              : "0 10px 30px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "1.2rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "180px",
            color: hovered ? "#fff" : "rgba(255,255,255,0.7)",
            fontFamily: "'Space Grotesk', sans-serif",
            textDecoration: "none",
            transition: "all 0.3s ease",
            cursor: "pointer",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            fontWeight: hovered ? 700 : 500,
          }}
        >
          {text}
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
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
  });

  const baseX = 80;
  if (scrollProgress < 3.5) return null;

  return (
    <group position={[baseX, 0, -2]} ref={groupRef}>
      {/* Central Title */}
      <Html transform center distanceFactor={15} position={[0, 2, 0]} style={{ pointerEvents: "none" }}>
        <h1 style={{
          fontSize: "3rem",
          fontWeight: 800,
          margin: 0,
          letterSpacing: "0.3em",
          color: "white",
          fontFamily: "'Space Grotesk', sans-serif",
          textShadow: "0 0 20px rgba(0,240,255,0.5)",
          whiteSpace: "nowrap",
        }}>
          RJ INDUSTRIES
        </h1>
      </Html>

      {/* Floating Link Plates */}
      {FOOTER_LINKS.map((link, index) => {
        const angle = (index / FOOTER_LINKS.length) * Math.PI * 2;
        const radius = 6;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const y = -1.5 + Math.sin(angle * 3) * 1.5;

        return (
          <FooterLink
            key={link.text}
            text={link.text}
            url={link.url}
            position={[x, y, z]}
          />
        );
      })}
    </group>
  );
}

