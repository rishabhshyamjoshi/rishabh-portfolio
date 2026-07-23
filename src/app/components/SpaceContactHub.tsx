"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface SpaceContactHubProps {
  scrollProgress: number;
}

export default function SpaceContactHub({ scrollProgress }: SpaceContactHubProps) {
  const groupRef = useRef<THREE.Group>(null);
  const logoTexture = useTexture("/logo.png");

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle floating spin/oscillation in 3D space
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.06;
  });

  const isVisible = scrollProgress > 2.2;

  if (!isVisible) return null;

  return (
    <group position={[80, 0, -2]} ref={groupRef}>
      {/* ═══ 3D SCI-FI LIGHTING RIG ═══ */}
      <pointLight position={[0, 4, 6]} intensity={6} color="#00f0ff" distance={25} />
      <pointLight position={[0, -4, -2]} intensity={4} color="#8800ff" distance={20} />
      <pointLight position={[6, 0, 2]} intensity={3} color="#ffaa00" distance={15} />

      {/* ═══ BACKGROUND HOLOGRAPHIC ORBIT RINGS ═══ */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[9, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.25} wireframe />
      </mesh>

      <mesh rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[11, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ff00ea" transparent opacity={0.15} wireframe />
      </mesh>

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
        {/* ═══ LARGE 3D FLOATING HOLOGRAPHIC RJ LOGO ═══ */}
        <mesh position={[0, 3.8, 0]}>
          <planeGeometry args={[11, 3.5]} />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent 
            opacity={0.95} 
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 3D Sub-header Text */}
        <Text
          position={[0, 1.6, 0]}
          fontSize={0.35}
          letterSpacing={0.25}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
        >
          DEEP SPACE TRANSMISSION HUB // ESTABLISH CONTACT
        </Text>

        <Text
          position={[0, 1.15, 0]}
          fontSize={0.2}
          letterSpacing={0.2}
          color="rgba(255,255,255,0.5)"
          anchorX="center"
          anchorY="middle"
        >
          INNOVATION BEYOND LIMITS • GLOBAL COMMUNICATIONS
        </Text>

        {/* ═══ 3D INTERACTIVE CONTACT CARDS & CAPSULES ═══ */}
        <Html
          position={[0, -1.4, 0]}
          center
          distanceFactor={12}
          style={{ pointerEvents: "auto" }}
        >
          <div className="flex flex-col items-center gap-5 select-none font-[var(--font-mono)] w-[680px]">
            
            {/* Primary Action Capsule: WORK WITH US */}
            <div className="w-full flex justify-center">
              <a
                href="mailto:contact@rj-industries.com?subject=Project%20Inquiry%20-%20RJ%20Industries"
                className="group relative flex items-center justify-center gap-4 px-10 py-4 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/50 hover:border-[#00f0ff] rounded-full text-white tracking-[0.3em] text-[0.85rem] font-bold transition-all duration-500 shadow-[0_0_30px_rgba(0,240,255,0.25)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] hover:scale-105"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
                <span>INITIATE COLLABORATION // WORK WITH US</span>
                <span className="text-[#00f0ff] group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Grid of Contact & Social Uplinks */}
            <div className="grid grid-cols-2 gap-4 w-full text-[0.7rem] tracking-[0.2em]">
              
              {/* EMAIL */}
              <a
                href="mailto:hello@rj.industries"
                className="flex items-center gap-3.5 p-4 bg-black/70 backdrop-blur-xl border border-white/15 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 rounded-xl transition-all duration-300 text-white/80 hover:text-white group shadow-lg"
              >
                <div className="w-9 h-9 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] border border-[#00f0ff]/30 group-hover:scale-110 transition-transform text-sm">
                  ✉
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.55rem] text-[#00f0ff] tracking-[0.2em] font-bold">PRIMARY EMAIL</span>
                  <span className="font-bold text-[0.75rem]">hello@rj.industries</span>
                </div>
              </a>

              {/* INSTAGRAM */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 bg-black/70 backdrop-blur-xl border border-white/15 hover:border-[#ff00ea] hover:bg-[#ff00ea]/10 rounded-xl transition-all duration-300 text-white/80 hover:text-white group shadow-lg"
              >
                <div className="w-9 h-9 rounded-lg bg-[#ff00ea]/10 flex items-center justify-center text-[#ff00ea] border border-[#ff00ea]/30 group-hover:scale-110 transition-transform text-sm">
                  📸
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.55rem] text-[#ff00ea] tracking-[0.2em] font-bold">INSTAGRAM</span>
                  <span className="font-bold text-[0.75rem]">@rj.industries</span>
                </div>
              </a>

              {/* LINKEDIN */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 bg-black/70 backdrop-blur-xl border border-white/15 hover:border-[#00a2ff] hover:bg-[#00a2ff]/10 rounded-xl transition-all duration-300 text-white/80 hover:text-white group shadow-lg"
              >
                <div className="w-9 h-9 rounded-lg bg-[#00a2ff]/10 flex items-center justify-center text-[#00a2ff] border border-[#00a2ff]/30 group-hover:scale-110 transition-transform text-sm">
                  💼
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.55rem] text-[#00a2ff] tracking-[0.2em] font-bold">LINKEDIN</span>
                  <span className="font-bold text-[0.75rem]">RJ Industries</span>
                </div>
              </a>

              {/* DIRECT UPLINK / PHONE */}
              <a
                href="tel:+1800752673"
                className="flex items-center gap-3.5 p-4 bg-black/70 backdrop-blur-xl border border-white/15 hover:border-[#ffaa00] hover:bg-[#ffaa00]/10 rounded-xl transition-all duration-300 text-white/80 hover:text-white group shadow-lg"
              >
                <div className="w-9 h-9 rounded-lg bg-[#ffaa00]/10 flex items-center justify-center text-[#ffaa00] border border-[#ffaa00]/30 group-hover:scale-110 transition-transform text-sm">
                  📞
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.55rem] text-[#ffaa00] tracking-[0.2em] font-bold">DIRECT UPLINK</span>
                  <span className="font-bold text-[0.75rem]">+1 (800) RJ-CORE</span>
                </div>
              </a>

            </div>

            {/* Footer Telemetry */}
            <div className="flex items-center justify-between w-full text-[0.55rem] tracking-[0.3em] text-white/40 border-t border-white/10 pt-3">
              <span>RJ INDUSTRIES © 2026</span>
              <span>ORBIT: DEEP SPACE 80.0</span>
              <span>TRANSMISSION: ACTIVE</span>
            </div>

          </div>
        </Html>
      </Float>
    </group>
  );
}
