"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Link from "next/link";
import BlackHoleExperience from "../components/BlackHoleExperience";
import CustomCursor from "../components/CustomCursor";
import WorkContactCapsule from "../components/WorkContactCapsule";

export default function AcademyPage() {
  const [mounted, setMounted] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);

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
          camera={{ position: [0, 0, 14], fov: 55 }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          dpr={[1, 1]}
        >
          <color attach="background" args={["#020408"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={2} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={1} color="#ff0077" />

          <Stars radius={120} depth={60} count={800} factor={4} saturation={0} fade speed={0.8} />

          <Suspense fallback={null}>
            <BlackHoleExperience scrollProgress={3.0} position={[0, 0, 0]} />
          </Suspense>

          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={0.6} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* ═══ TOP HUD HEADER ═══ */}
      <div className="fixed top-8 left-8 right-8 z-50 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="flex items-center gap-3 border border-[#00f0ff]/30 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full text-[0.65rem] tracking-[0.2em] text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] transition-all duration-300"
          >
            <span>&larr;</span> RETURN TO CORE
          </Link>
        </div>

        <div className="text-right pointer-events-none">
          <h1 className="text-sm md:text-base font-bold tracking-[0.3em] text-white">
            BLACK HOLE ACADEMY
          </h1>
          <p className="text-[0.6rem] tracking-[0.25em] text-[#00f0ff]/80 mt-1 uppercase">
            SINGULARITY RESEARCH & ASTROPHYSICS LAB
          </p>
        </div>

        <div className="pointer-events-auto">
          <WorkContactCapsule />
        </div>
      </div>

      {/* ═══ BOTTOM CORNER TELEMETRY & MODULE CARDS ═══ */}
      <div className="fixed bottom-8 left-8 z-40 max-w-sm pointer-events-auto space-y-4">
        <div className="border border-[#00f0ff]/20 bg-black/60 backdrop-blur-md p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <h2 className="text-[0.7rem] font-bold tracking-[0.2em] text-[#00f0ff]">
              RESEARCH MODULES
            </h2>
          </div>
          <p className="text-[0.65rem] leading-relaxed text-white/70">
            Interactive astrophysics simulation lab. Launch quantum probes or asteroids into the Schwarzschild radius to observe spaghettification and gravitational redshift.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: "horizon", label: "EVENT HORIZON DYNAMICS" },
              { id: "quantum", label: "QUANTUM GRAVITY" },
              { id: "singularity", label: "SINGULARITY ENERGY" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`text-[0.55rem] tracking-[0.15em] px-3 py-1.5 rounded-md border transition-all ${
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="border border-[#00f0ff]/40 bg-[#040914]/90 p-8 rounded-2xl max-w-lg w-full space-y-6 text-white shadow-[0_0_50px_rgba(0,240,255,0.2)]">
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
