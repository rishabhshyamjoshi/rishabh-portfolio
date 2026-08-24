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
      // Random spherical distribution
      const r = 60 + Math.random() * 100; 
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      let x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Clamp 80% of the stars to the home screen section (X between -40 and 40)
      // so they don't clutter the project/team sections.
      if (i < count * 0.8) {
        x = (Math.random() - 0.5) * 80;
      }
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = 0.1 + Math.random() * 0.4; // Very small, minute shining stars
    }
    return s;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudioData: { value: new THREE.Vector3(0, 0, 0) }, // Low, Mid, High
      uAudioOverall: { value: 0 },
      uColor: { value: new THREE.Color("#00f0ff") },
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
    // Tone down the brightness of the theme color slightly
    materialRef.current.uniforms.uColor.value.lerp(targetColor, delta * 2);

    const audio = AudioController.getInstance();
    const data = audio.getFrequencyData();
    
    let low = 0, mid = 0, high = 0, overall = 0;
    
    if (data && data.length > 0 && !audio.isMuted) {
      // Calculate Low, Mid, and High frequency bands
      for(let i=0; i<8; i++) low += data[i];
      for(let i=8; i<24; i++) mid += data[i];
      for(let i=24; i<64; i++) high += data[i];
      
      low = (low / 8) / 255.0;
      mid = (mid / 16) / 255.0;
      high = (high / 40) / 255.0;
      overall = (low + mid + high) / 3.0;
    }
    
    // Smooth easing
    const currentAudio = materialRef.current.uniforms.uAudioData.value;
    currentAudio.lerp(new THREE.Vector3(low, mid, high), 0.2);
    
    materialRef.current.uniforms.uAudioOverall.value += (overall - materialRef.current.uniforms.uAudioOverall.value) * 0.1;
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
          uniform float uAudioOverall;
          attribute float size;
          varying float vAlpha;
          varying vec3 vPos;
          
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vPos = position;
            
            // Faster but subtler twinkle
            float twinkle = sin(uTime * 3.0 + position.x * 0.1) * 0.4 + 0.6;
            
            // Modest boost based on overall audio
            float audioBoost = 1.0 + (uAudioOverall * 1.5);
            
            // Prevent extreme size explosion when passing through stars by clamping the minimum distance
            float distance = max(-mvPosition.z, 25.0);
            
            // Scaled up by 200 for proper visibility since base sizes are much smaller
            gl_PointSize = size * (200.0 / distance) * audioBoost * twinkle;
            gl_Position = projectionMatrix * mvPosition;
            
            // Opacity increases slightly with audio
            vAlpha = twinkle * (0.6 + (uAudioOverall * 0.8));
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform vec3 uAudioData;
          varying float vAlpha;
          varying vec3 vPos;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float glow = 1.0 - (dist * 2.0);
            
            // Generate a dynamic reactive color using the frequency bands
            // uAudioData.x = Lows (Bass), y = Mids, z = Highs
            vec3 reactiveColor = uColor;
            
            // Spatial color variation based on position + audio
            float noiseX = sin(vPos.x * 0.05 + uAudioData.x * 2.0);
            float noiseY = cos(vPos.y * 0.05 + uAudioData.y * 2.0);
            float noiseZ = sin(vPos.z * 0.05 + uAudioData.z * 2.0);
            
            // Shift RGB channels independently to create vibrant color changes during music
            reactiveColor.r += noiseX * uAudioData.x;
            reactiveColor.g += noiseY * uAudioData.y;
            reactiveColor.b += noiseZ * uAudioData.z;
            
            // Ensure color doesn't blow out completely white
            reactiveColor = clamp(reactiveColor, 0.0, 1.0);
            
            // Mix with white core
            vec3 finalColor = mix(reactiveColor, vec3(1.0), pow(glow, 6.0));
            
            gl_FragColor = vec4(finalColor, vAlpha * pow(glow, 1.2));
          }
        `}
      />
    </points>
  );
}
