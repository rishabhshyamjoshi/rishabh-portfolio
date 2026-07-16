"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Text } from "@react-three/drei";
import * as THREE from "three";

export default function LogoRing() {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Gentle floating
    ringRef.current.position.y = Math.sin(t * 1) * 0.1;
    
    // Always face camera but slight mouse follow rotation
    const mouseX = (state.pointer.x * Math.PI) / 10;
    const mouseY = (state.pointer.y * Math.PI) / 10;
    
    ringRef.current.rotation.x = THREE.MathUtils.lerp(ringRef.current.rotation.x, -mouseY, 0.1);
    ringRef.current.rotation.y = THREE.MathUtils.lerp(ringRef.current.rotation.y, mouseX, 0.1);
  });

  return (
    <group ref={ringRef} position={[0, 0, 0]}>
      {/* The main ring */}
      <mesh>
        <torusGeometry args={[1.5, 0.1, 16, 100]} />
        <MeshDistortMaterial
          color="#8b5cf6" // Violet tint from the screenshot
          distort={0.1}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Inner 'a' logo approximation using Text */}
      <Text
        
        fontSize={1.2}
        position={[0, -0.1, 0]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        a
        <meshStandardMaterial metalness={0.5} roughness={0.2} color="#cccccc" />
      </Text>
      
      {/* Connecting "legs" of the logo shown in screenshot 1 */}
      <mesh position={[-0.5, -2, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.5, -2, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
