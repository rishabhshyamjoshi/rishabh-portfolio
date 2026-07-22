"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Link from "next/link";
import BlackHoleExperience, { BlackHoleControls } from "../components/BlackHoleExperience";
import CustomCursor from "../components/CustomCursor";
import WorkContactCapsule from "../components/WorkContactCapsule";

export default function AcademyPage() {
  const [mounted, setMounted] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [swallowedCount, setSwallowedCount] = useState(0);

  const blackHoleRef = useRef<BlackHoleControls>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#020408] text-white selection:bg-[#00f0ff] selection:text-black overflow-hidden font-[var(--font-mono)]">
      <CustomCursor />

      {/* ═══ 3D CANVAS FULLSCREEN ═══ */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          dpr={[1, 1]}
        >
          <color attach="background" args={["#020408"]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={0.8} color="#ff0066" />

          <Stars radius={100} depth={50} count={600} factor={3} saturation={0} fade speed={0.5} />

          <Suspense fallback={null}>
            <BlackHoleExperience
              ref={blackHoleRef}
              position={[0, 0, 0]}
              onSwallowed={() => setSwallowedCount((prev) => prev + 1)}
            />
          </Suspense>

          {/* Low bloom intensity to eliminate whiteout glare */}
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.9} intensity={0.2} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* ═══ TOP BAR NAVIGATION ═══ */}
      <div className="fixed top-8 left-8 right-8 z-50 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="flex items-center gap-3 border border-[#00f0ff]/30 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full text-[0.65rem] tracking-[0.2em] text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          >
            <span>&larr;</span> RETURN TO CORE
          </Link>
        </div>

        <div className="pointer-events-auto">
          <WorkContactCapsule />
        </div>
      </div>

      {/* ═══ TOP RIGHT TELEMETRY HUD CARD (Clean 2D Overlay) ═══ */}
      <div className="fixed top-24 right-8 z-40 w-80 pointer-events-auto">
        <div className="border border-[#00f0ff]/30 bg-black/75 backdrop-blur-xl p-5 rounded-2xl space-y-4 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
          <div className="flex justify-between items-center border-b border-[#00f0ff]/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
              <h1 className="text-[0.7rem] font-bold tracking-[0.2em] text-[#00f0ff]">
                BLACK HOLE SINGULARITY
              </h1>
            </div>
            <span className="text-[0.55rem] text-white/40 tracking-widest">SG-001</span>
          </div>

          {/* Telemetry Data Grid */}
          <div className="grid grid-cols-2 gap-3 text-[0.6rem] text-white/80">
            <div>
              <span className="text-[0.5rem] text-white/40 block tracking-widest">MASS</span>
              <span className="font-bold text-white">4.1M M☉</span>
            </div>
            <div>
              <span className="text-[0.5rem] text-white/40 block tracking-widest">SCHWARZSCHILD</span>
              <span className="font-bold text-white">12.1 AU</span>
            </div>
            <div>
              <span className="text-[0.5rem] text-white/40 block tracking-widest">TIME DILATION</span>
              <span className="font-bold text-[#ff0066]">∞ (CRITICAL)</span>
            </div>
            <div>
              <span className="text-[0.5rem] text-white/40 block tracking-widest">CONSUMED</span>
              <span className="font-bold text-[#00f0ff]">{swallowedCount} OBJECTS</span>
            </div>
          </div>

          {/* Interactive Object Launcher Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => blackHoleRef.current?.spawnObject("probe")}
              className="flex-1 py-2 bg-[#00f0ff]/15 border border-[#00f0ff]/50 rounded-lg text-[#00f0ff] text-[0.55rem] tracking-wider hover:bg-[#00f0ff]/30 transition-all font-bold"
            >
              + PROBE
            </button>
            <button
              onClick={() => blackHoleRef.current?.spawnObject("asteroid")}
              className="flex-1 py-2 bg-[#ffaa44]/15 border border-[#ffaa44]/50 rounded-lg text-[#ffaa44] text-[0.55rem] tracking-wider hover:bg-[#ffaa44]/30 transition-all font-bold"
            >
              + ASTEROID
            </button>
            <button
              onClick={() => blackHoleRef.current?.triggerGravWave()}
              className="flex-1 py-2 bg-[#ff0066]/15 border border-[#ff0066]/50 rounded-lg text-[#ff0066] text-[0.55rem] tracking-wider hover:bg-[#ff0066]/30 transition-all font-bold"
            >
              ⚡ WAVE
            </button>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM LEFT RESEARCH MODULES CARD ═══ */}
      <div className="fixed bottom-8 left-8 z-40 max-w-sm pointer-events-auto space-y-4">
        <div className="border border-[#00f0ff]/20 bg-black/75 backdrop-blur-xl p-5 rounded-2xl space-y-3 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
            <h2 className="text-[0.7rem] font-bold tracking-[0.2em] text-[#00f0ff]">
              ASTROPHYSICS RESEARCH LAB
            </h2>
          </div>
          <p className="text-[0.65rem] leading-relaxed text-white/70">
            Interactive singularity lab. Throw objects or trigger gravitational waves to observe tidal forces and event horizon absorption.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: "horizon", label: "EVENT HORIZON" },
              { id: "quantum", label: "QUANTUM GRAVITY" },
              { id: "singularity", label: "SINGULARITY ENERGY" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`text-[0.55rem] tracking-[0.15em] px-3 py-1.5 rounded-lg border transition-all ${
                  activeModule === m.id
                    ? "bg-[#00f0ff]/20 border-[#00f0ff] text-white shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Module Modal Info */}
      {activeModule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="border border-[#00f0ff]/40 bg-[#040914]/95 p-8 rounded-2xl max-w-lg w-full space-y-6 text-white shadow-[0_0_50px_rgba(0,240,255,0.2)]">
            <div className="flex justify-between items-center border-b border-[#00f0ff]/20 pb-4">
              <h3 className="text-sm font-bold tracking-[0.25em] text-[#00f0ff]">
                {activeModule === "horizon"
                  ? "EVENT HORIZON DYNAMICS"
                  : activeModule === "quantum"
                  ? "QUANTUM GRAVITY SIMULATION"
                  : "SINGULARITY ENERGY HARVESTING"}
              </h3>
              <button
                onClick={() => setActiveModule(null)}
                className="text-xs text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs leading-relaxed text-white/80 tracking-wider">
              {activeModule === "horizon"
                ? "Study the boundary beyond which nothing, not even light, can escape. In this simulation, objects experience immense gravitational spaghettification and time dilation as they fall past the Schwarzschild radius."
                : activeModule === "quantum"
                ? "Simulate quantum field fluctuations near black hole horizons. High-energy Hawking radiation bursts occur when virtual particle-antiparticle pairs separate near the singularity."
                : "Explore theoretical Penrose process energy extraction models from spinning supermassive black holes (Kerr geometry), unlocking infinite clean energy."}
            </p>
            <button
              onClick={() => setActiveModule(null)}
              className="w-full py-3 bg-[#00f0ff]/15 border border-[#00f0ff] text-[#00f0ff] rounded-lg text-xs font-bold tracking-[0.2em] hover:bg-[#00f0ff]/30 transition-all"
            >
              RESUME SIMULATION
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
