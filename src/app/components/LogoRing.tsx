"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Text } from "@react-three/drei";
import * as THREE from "three";

export default function LogoRing() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || !ringRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Gentle floating
    groupRef.current.position.y = Math.sin(t * 1) * 0.1;
    
    // Always face camera but slight mouse follow rotation
    const mouseX = (state.pointer.x * Math.PI) / 8;
    const mouseY = (state.pointer.y * Math.PI) / 8;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.05);

    // Slowly spin the ring
    ringRef.current.rotation.z = t * 0.2;
    ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Intense Center Light for the metallic reflection */}
      <pointLight position={[0, 0, 2]} intensity={5} color="#00f0ff" distance={10} />
      <pointLight position={[-2, 2, 2]} intensity={3} color="#ffffff" distance={10} />

      {/* The main ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.08, 32, 100]} />
        <meshPhysicalMaterial
          color="#aaccff"
          roughness={0.1}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Inner 'RJ' logo using Text */}
      <group ref={textRef}>
        <Text
          fontSize={1.2}
          position={[0, 0, 0]}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/spacemono/v12/rxjJnnNdKsVNzIZeMwPnjaT_c-M.woff"
          letterSpacing={-0.05}
        >
          RJ
          <meshPhysicalMaterial 
            metalness={1} 
            roughness={0.1} 
            color="#ffffff"
            clearcoat={1}
            envMapIntensity={2}
          />
        </Text>
      </group>
      
      {/* Connecting "legs" / mechanical details */}
      <mesh position={[-1.2, -1.2, 0]} rotation={[0, 0, 0.8]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshPhysicalMaterial color="#00f0ff" metalness={1} roughness={0.2} emissive="#00f0ff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[1.2, 1.2, 0]} rotation={[0, 0, 0.8]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshPhysicalMaterial color="#00f0ff" metalness={1} roughness={0.2} emissive="#00f0ff" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}
