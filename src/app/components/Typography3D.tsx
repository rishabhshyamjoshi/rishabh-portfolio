"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Typography3D({ hide, scrollProgress = 0 }: { hide?: boolean, scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useTexture("/logo.png");

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth, subtle float slightly higher above the Earth
    groupRef.current.position.y = 2.5 + Math.sin(t * 0.5) * 0.1;

    // Smoothly scale down and hide when zooming into a project
    const targetScale = hide ? 0.001 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    
    // Fade out smoothly and extremely quickly as the user starts scrolling down
    if (materialRef.current) {
      const targetOpacity = hide ? 0 : Math.max(0, 1.0 - scrollProgress * 15.0);
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1);
      // Prevent any artifacts when opacity is zero
      materialRef.current.visible = materialRef.current.opacity > 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, 2.5, -5]}>
      {/* 
        Positioned behind the Earth (Z=-5) and higher up.
        Scale made massive (24 wide) while maintaining aspect ratio.
      */}
      <mesh>
        <planeGeometry args={[24.0, 24.0 / 4.048]} />
        <meshBasicMaterial 
          ref={materialRef}
          map={texture} 
          transparent={true} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
