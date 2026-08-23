"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AudioController } from "../utils/AudioController";
import { useThemeColors } from "../hooks/useThemeColors";

export default function AudioReactiveStars({ count = 2000 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const theme = useThemeColors();

  const targetColor = useMemo(() => new THREE.Color(), []);
  
  // Generate star positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Random spherical distribution, pushing them out away from the planets
      const r = 50 + Math.random() * 150; 
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
      s[i] = 1.0 + Math.random() * 3.0; // Base size
    }
    return s;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudioData: { value: 0 },
      uColor: { value: new THREE.Color("#00f0ff") },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!materialRef.current || !pointsRef.current) return;
    
    // Slow rotation of the entire starfield
    pointsRef.current.rotation.y += delta * 0.01;
    pointsRef.current.rotation.x += delta * 0.005;

    // Time for twinkling
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth color interpolation to current theme
    targetColor.set(theme.primary || "#ffffff");
    materialRef.current.uniforms.uColor.value.lerp(targetColor, delta * 3);

    // Audio Reactivity
    const audio = AudioController.getInstance();
    const data = audio.getFrequencyData();
    let audioValue = 0;
    
    if (data && data.length > 0 && !audio.isMuted) {
      // Calculate average of lower frequencies (bass/kick)
      let sum = 0;
      const sampleSize = 8;
      for(let i=0; i<sampleSize; i++) {
        sum += data[i];
      }
      audioValue = (sum / sampleSize) / 255.0; // Normalized 0 to 1
    }
    
    // Smooth the audio value heavily to avoid jittering
    materialRef.current.uniforms.uAudioData.value += (audioValue - materialRef.current.uniforms.uAudioData.value) * 0.15;
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
            
            // Audio expands the star size significantly (up to 5x) 
            // Twinkle using sine
            float twinkle = sin(uTime * 3.0 + position.x * 0.1) * 0.5 + 0.5;
            float audioBoost = 1.0 + (uAudioData * 6.0);
            
            // Perspective size calculation
            gl_PointSize = size * (150.0 / -mvPosition.z) * audioBoost * (0.3 + twinkle * 0.7);
            gl_Position = projectionMatrix * mvPosition;
            
            // Fade opacity based on twinkle and audio
            vAlpha = (twinkle * 0.5 + 0.5) * (1.0 + uAudioData);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;
          
          void main() {
            // Circular particle
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            // Soft edge glow
            float glow = 1.0 - (dist * 2.0);
            
            // Inner core is white, outer glow is uColor
            // When audio is high, the white core gets larger
            vec3 finalColor = mix(uColor, vec3(1.0), pow(glow, 2.5));
            
            gl_FragColor = vec4(finalColor, vAlpha * glow * 1.5);
          }
        `}
      />
    </points>
  );
}
