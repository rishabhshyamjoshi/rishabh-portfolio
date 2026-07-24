"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
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
    <group position={position} rotation={rotation}>
      {/* Glass Panel Background */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[hovered ? 5.5 : 5, 1.2]} />
        <meshBasicMaterial 
          color={hovered ? "#00f0ff" : "#111111"} 
          transparent 
          opacity={hovered ? 0.2 : 0.4} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Holographic Border */}
      <mesh position={[0, 0, -0.09]}>
        <planeGeometry args={[hovered ? 5.6 : 5.1, 1.3]} />
        <meshBasicMaterial 
          color={hovered ? "#00f0ff" : "#333333"} 
          wireframe
          transparent 
          opacity={0.5} 
        />
      </mesh>

      <Text
        ref={meshRef}
        position={[0, 0, 0]}
        fontSize={0.5}
        letterSpacing={0.3}
        color={hovered ? "#ffffff" : "#00f0ff"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Orbitron-Bold.ttf" // Make sure Orbitron is loaded or use default
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={() => {
          if (url.startsWith("http") || url.startsWith("mailto") || url.startsWith("tel")) {
            window.open(url, "_blank");
          }
        }}
      >
        <meshBasicMaterial transparent opacity={hovered ? 1 : 0.8} />
        {text}
      </Text>
    </group>
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
      {/* Central Holographic Core (Replaces plain text) */}
      <group position={[0, 1.5, 0]}>
        <mesh>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.15} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.5, 8, 8]} />
          <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.3} />
        </mesh>
        <Text
          position={[0, 0, 0]}
          fontSize={1.2}
          letterSpacing={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          <meshBasicMaterial transparent opacity={0.9} />
          COMMS HUB
        </Text>
      </group>

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
