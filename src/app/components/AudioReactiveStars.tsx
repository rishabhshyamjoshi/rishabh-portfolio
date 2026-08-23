"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AudioController } from "../utils/AudioController";
import { useThemeColors } from "../hooks/useThemeColors";

export default function AudioReactiveStars({ count = 1500 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const theme = useThemeColors();

  const targetColor = useMemo(() => new THREE.Color(), []);
  
  // Generate star positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 80 + Math.random() * 200; // Push further away
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = 0.2 + Math.random() * 0.8; // Tiny base size
    }
    return s;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudioData: { value: 0 },
      uColor: { value: new THREE.Color("#ffffff") }, // Start white
    }),
    []
  );

  useFrame((state, delta) => {
    if (!materialRef.current || !pointsRef.current) return;
    
    // Slow rotation
    pointsRef.current.rotation.y += delta * 0.005;
    pointsRef.current.rotation.x += delta * 0.002;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    targetColor.set(theme.primary || "#ffffff");
    // Fast color interpolation so it changes quickly with BGM
    materialRef.current.uniforms.uColor.value.lerp(targetColor, delta * 5);

    const audio = AudioController.getInstance();
    const data = audio.getFrequencyData();
    let audioValue = 0;
    
    if (data && data.length > 0 && !audio.isMuted) {
      let sum = 0;
      const sampleSize = 8;
      for(let i=0; i<sampleSize; i++) {
        sum += data[i];
      }
      audioValue = (sum / sampleSize) / 255.0; 
    }
    
    // Slower easing for more elegant pulsing
    materialRef.current.uniforms.uAudioData.value += (audioValue - materialRef.current.uniforms.uAudioData.value) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uAudioData;
          attribute float size;
          varying float vAlpha;
          
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Strong twinkle effect (0.1 to 1.0)
            float twinkle = sin(uTime * (2.0 + fract(position.x) * 3.0) + position.y) * 0.45 + 0.55;
            
            // Very low sound reactivity for size (max 1.2x)
            float audioBoost = 1.0 + (uAudioData * 0.2);
            
            gl_PointSize = size * (100.0 / -mvPosition.z) * audioBoost * twinkle;
            gl_Position = projectionMatrix * mvPosition;
            
            // Alpha pulses with twinkle and very slightly with audio
            vAlpha = twinkle * (1.0 + (uAudioData * 0.2));
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            // Sharp glow curve for bright, tiny stars
            float glow = 1.0 - (dist * 2.0);
            
            // Bright white core, subtle colored halo
            vec3 finalColor = mix(uColor, vec3(1.0), pow(glow, 2.0));
            
            // High brightness
            gl_FragColor = vec4(finalColor, vAlpha * pow(glow, 1.2));
          }
        `}
      />
    </points>
  );
}
