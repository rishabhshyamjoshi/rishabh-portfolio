"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Text, useTexture, Sparkles, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface SpaceContactHubProps {
  scrollProgress: number;
}

export default function SpaceContactHub({ scrollProgress }: SpaceContactHubProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const logoTexture = useTexture("/logo.png");

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle floating spin/oscillation in 3D space
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
    
    // Rotate rings
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.1;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.15;
    if (ring3Ref.current) ring3Ref.current.rotation.y = t * 0.05;
  });

  const isVisible = scrollProgress > 2.2;

  if (!isVisible) return null;

  return (
    <group position={[80, 0, -2]} ref={groupRef}>
      {/* ═══ 3D SCI-FI LIGHTING RIG ═══ */}
      <pointLight position={[0, 4, 6]} intensity={8} color="#00f0ff" distance={30} />
      <pointLight position={[0, -4, -2]} intensity={6} color="#8800ff" distance={25} />
      <pointLight position={[6, 0, 2]} intensity={5} color="#ffaa00" distance={20} />
      <ambientLight intensity={0.5} />

      {/* ═══ SPACE PARTICLES / SPARKLES ═══ */}
      <Sparkles count={300} scale={25} size={3} speed={0.4} opacity={0.6} color="#00f0ff" />
      <Sparkles count={150} scale={20} size={5} speed={0.2} opacity={0.4} color="#ffaa00" />

      {/* ═══ HOLOGRAPHIC ENERGY RINGS ═══ */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[10, 0.03, 32, 100]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} transparent opacity={0.6} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[-Math.PI / 2.5, Math.PI / 8, 0]}>
        <torusGeometry args={[12, 0.015, 32, 100]} />
        <meshStandardMaterial color="#ff00ea" emissive="#ff00ea" emissiveIntensity={1.5} transparent opacity={0.4} />
      </mesh>

      <mesh ref={ring3Ref}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.02} wireframe />
      </mesh>

      <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5}>
        
        {/* ═══ GLASS BACKDROP PANEL ═══ */}
        <RoundedBox args={[12, 9, 0.1]} radius={0.5} position={[0, 0, -1]}>
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color="#0a0a0f"
            transmission={0.9}
            opacity={1}
            roughness={0.2}
          />
        </RoundedBox>

        {/* Outer glowing edge for the panel */}
        <RoundedBox args={[12.1, 9.1, 0.05]} radius={0.55} position={[0, 0, -1.05]}>
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.15} wireframe />
        </RoundedBox>

        {/* ═══ LARGE 3D FLOATING HOLOGRAPHIC RJ LOGO ═══ */}
        <mesh position={[0, 2.5, 0]}>
          <planeGeometry args={[9, 2.8]} />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent 
            opacity={0.95} 
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* 3D Sub-header Text */}
        <Text
          position={[0, 0.6, 0.2]}
          fontSize={0.28}
          letterSpacing={0.25}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
        >
          DEEP SPACE TRANSMISSION HUB // ESTABLISH CONTACT
        </Text>

        <Text
          position={[0, 0.15, 0.2]}
          fontSize={0.15}
          letterSpacing={0.2}
          color="rgba(255,255,255,0.6)"
          anchorX="center"
          anchorY="middle"
        >
          INNOVATION BEYOND LIMITS • GLOBAL COMMUNICATIONS
        </Text>

        {/* ═══ 3D INTERACTIVE CONTACT CARDS & CAPSULES ═══ */}
        <Html
          position={[0, -2.0, 0.3]}
          center
          distanceFactor={11}
          style={{ pointerEvents: "auto" }}
          transform
          sprite
        >
          <div className="flex flex-col items-center gap-5 select-none font-[var(--font-mono)] w-[680px]">
            
            {/* Primary Action Capsule: WORK WITH US */}
            <div className="w-full flex justify-center scale-95">
              <a
                href="mailto:contact@rj-industries.com?subject=Project%20Inquiry%20-%20RJ%20Industries"
                className="group relative flex items-center justify-center gap-4 px-10 py-4 bg-gradient-to-r from-[#00f0ff]/10 via-[#00f0ff]/5 to-[#00f0ff]/10 hover:from-[#00f0ff]/30 hover:via-[#00f0ff]/20 hover:to-[#00f0ff]/30 border border-[#00f0ff]/40 hover:border-[#00f0ff] rounded-full text-white tracking-[0.3em] text-[0.85rem] font-bold transition-all duration-500 shadow-[0_0_40px_rgba(0,240,255,0.15)] hover:shadow-[0_0_60px_rgba(0,240,255,0.4)]"
              >
                <span className="absolute inset-0 rounded-full border border-white/10 group-hover:scale-105 transition-transform duration-500"></span>
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_10px_#00f0ff]" />
                <span className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">INITIATE COLLABORATION // WORK WITH US</span>
                <span className="text-[#00f0ff] group-hover:translate-x-2 transition-transform duration-300">→</span>
              </a>
            </div>

            {/* Grid of Contact & Social Uplinks */}
            <div className="grid grid-cols-2 gap-4 w-full text-[0.7rem] tracking-[0.2em] px-4">
              
              {/* EMAIL */}
              <a
                href="mailto:hello@rj.industries"
                className="flex items-center gap-3.5 p-4 bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#00f0ff]/70 hover:bg-[#00f0ff]/10 rounded-xl transition-all duration-300 text-white/70 hover:text-white group shadow-lg"
              >
                <div className="w-9 h-9 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] border border-[#00f0ff]/30 group-hover:scale-110 group-hover:bg-[#00f0ff]/20 transition-all text-sm">
                  ✉
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.55rem] text-[#00f0ff] tracking-[0.2em] font-bold">PRIMARY EMAIL</span>
                  <span className="font-bold text-[0.75rem] tracking-[0.1em]">hello@rj.industries</span>
                </div>
              </a>

              {/* INSTAGRAM */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#ff00ea]/70 hover:bg-[#ff00ea]/10 rounded-xl transition-all duration-300 text-white/70 hover:text-white group shadow-lg"
              >
                <div className="w-9 h-9 rounded-lg bg-[#ff00ea]/10 flex items-center justify-center text-[#ff00ea] border border-[#ff00ea]/30 group-hover:scale-110 group-hover:bg-[#ff00ea]/20 transition-all text-sm">
                  📸
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.55rem] text-[#ff00ea] tracking-[0.2em] font-bold">INSTAGRAM</span>
                  <span className="font-bold text-[0.75rem] tracking-[0.1em]">@rj.industries</span>
                </div>
              </a>

              {/* LINKEDIN */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#00a2ff]/70 hover:bg-[#00a2ff]/10 rounded-xl transition-all duration-300 text-white/70 hover:text-white group shadow-lg"
              >
                <div className="w-9 h-9 rounded-lg bg-[#00a2ff]/10 flex items-center justify-center text-[#00a2ff] border border-[#00a2ff]/30 group-hover:scale-110 group-hover:bg-[#00a2ff]/20 transition-all text-sm">
                  💼
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.55rem] text-[#00a2ff] tracking-[0.2em] font-bold">LINKEDIN</span>
                  <span className="font-bold text-[0.75rem] tracking-[0.1em]">RJ Industries</span>
                </div>
              </a>

              {/* DIRECT UPLINK / PHONE */}
              <a
                href="tel:+1800752673"
                className="flex items-center gap-3.5 p-4 bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#ffaa00]/70 hover:bg-[#ffaa00]/10 rounded-xl transition-all duration-300 text-white/70 hover:text-white group shadow-lg"
              >
                <div className="w-9 h-9 rounded-lg bg-[#ffaa00]/10 flex items-center justify-center text-[#ffaa00] border border-[#ffaa00]/30 group-hover:scale-110 group-hover:bg-[#ffaa00]/20 transition-all text-sm">
                  📞
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.55rem] text-[#ffaa00] tracking-[0.2em] font-bold">DIRECT UPLINK</span>
                  <span className="font-bold text-[0.75rem] tracking-[0.1em]">+1 (800) RJ-CORE</span>
                </div>
              </a>

            </div>

            {/* Footer Telemetry */}
            <div className="flex items-center justify-between w-[95%] text-[0.55rem] tracking-[0.3em] text-white/30 border-t border-white/5 pt-4 mt-2">
              <span>RJ INDUSTRIES © 2026</span>
              <span className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span> REC: DEEP SPACE 80.0</span>
              <span className="text-[#00f0ff]/50">TRANSMISSION: SECURE</span>
            </div>

          </div>
        </Html>
      </Float>
    </group>
  );
}
