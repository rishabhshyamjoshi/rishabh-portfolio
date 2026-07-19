"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 400;

export default function Environment() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, sizes, alphas] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const size = new Float32Array(PARTICLE_COUNT);
    const alpha = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Spread wider to cover the travel between planets
      pos[i3] = (Math.random() - 0.5) * 100;
      pos[i3 + 1] = (Math.random() - 0.5) * 40;
      pos[i3 + 2] = (Math.random() - 0.5) * 80 - 10;

      size[i] = Math.random() * 1.2 + 0.2;
      alpha[i] = Math.random() * 0.3 + 0.05;
    }

    return [pos, size, alpha];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = t * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aAlpha"
          count={PARTICLE_COUNT}
          array={alphas}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
          attribute float aSize;
          attribute float aAlpha;
          varying float vAlpha;
          void main() {
            vAlpha = aAlpha;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (80.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
            // Subtle warm white dust
            gl_FragColor = vec4(0.95, 0.92, 0.88, alpha);
          }
        `}
      />
    </points>
  );
}
