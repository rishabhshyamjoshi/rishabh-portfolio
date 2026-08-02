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

function FooterLink({ text, url, position, rotation }: { text: string, url: string, position: [number, number, number], rotation: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle float animation
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.2;
      
      // Scale on hover
      const targetScale = hovered ? 1.1 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Html center distanceFactor={8} position={position} style={{ pointerEvents: 'none' }}>
      <div style={{
        color: hovered ? '#ffaa66' : '#888888',
        fontSize: '18px',
        fontWeight: 600,
        letterSpacing: '0.2em',
        fontFamily: "'Space Grotesk', sans-serif",
        textShadow: hovered ? '0 0 12px rgba(255,170,100,0.8)' : 'none',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
        onMouseEnter={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onMouseLeave={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        onClick={() => {
          if (url.startsWith('http') || url.startsWith('mailto')) {
            window.open(url, '_blank');
          }
        }}
      >
        {text}
      </div>
    </Html>
  );
}

export default function FooterScreen({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle rotation of the whole footer structure
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
  });

  // Base X for N=2 is 80 (since N*40, so 2*40 = 80)
  const baseX = 80;

  // Render only when close to N=2
  if (scrollProgress < 3.5) return null;

  return (
    <group position={[baseX, 0, -2]} ref={groupRef}>
      <Html center distanceFactor={8} position={[0, 1.5, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          color: '#ffffff',
          fontSize: '64px',
          fontWeight: 800,
          letterSpacing: '0.1em',
          fontFamily: "'Space Grotesk', sans-serif",
          textShadow: '0 0 30px rgba(255,255,255,0.3)',
          opacity: 0.9,
          whiteSpace: 'nowrap'
        }}>
          RJ INDUSTRIES
        </div>
      </Html>

      {/* Orbiting / Floating Links */}
      {FOOTER_LINKS.map((link, index) => {
        const angle = (index / FOOTER_LINKS.length) * Math.PI * 2;
        const radius = 6;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const y = -1.5 + Math.sin(angle * 3) * 1.5;
        
        // Orient towards center (slightly outward)
        const rotY = Math.atan2(x, z);

        return (
          <FooterLink
            key={link.text}
            text={link.text}
            url={link.url}
            position={[x, y, z]}
            rotation={[0, rotY, 0]}
          />
        );
      })}
    </group>
  );
}
