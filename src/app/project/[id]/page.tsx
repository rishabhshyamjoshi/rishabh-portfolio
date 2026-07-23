"use client";

import { PROJECTS } from "@/app/data/projects";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import SequencePlayer from "@/app/components/SequencePlayer";
import WorkContactCapsule from "@/app/components/WorkContactCapsule";
import { useEffect, useState } from "react";

// Mock technical stats based on project ID for consistency
const getTechnicalStats = (id: number) => {
  const base = id * 10;
  return [
    { label: "NEURAL COMPUTE EFFICIENCY", value: 45 + (base % 50) },
    { label: "QUANTUM ENTANGLEMENT STABILITY", value: 70 + (base % 25) },
    { label: "POWER DRAW OPTIMIZATION", value: 60 + (base % 40) },
    { label: "LATENCY DELAY (MS)", value: Math.max(5, 20 - (base % 15)) }
  ];
};

export default function ProjectCaseStudy({ params }: { params: { id: string } }) {
  const router = useRouter();
  const project = PROJECTS.find((p) => p.id === parseInt(params.id));
  const [mounted, setMounted] = useState(false);
  const [glitch, setGlitch] = useState("");
  
  useEffect(() => {
    setMounted(true);
    
    // Random hex glitch generator for telemetry
    const glitchInterval = setInterval(() => {
      const hex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
      setGlitch(`0x${hex.padStart(6, '0')}`);
    }, 150);
    
    return () => clearInterval(glitchInterval);
  }, []);

  if (!project) {
    notFound();
  }

  const handleGlobalWheel = (e: React.WheelEvent) => {
    // Only apply global scroll-to-close for non-sequence projects
    if (project.id !== 1 && e.deltaY > 50) {
      router.push("/");
    }
  };

  const stats = getTechnicalStats(project.id);

  return (
    <div 
      className="relative min-h-screen bg-[#02050a] text-white selection:bg-[#00f0ff] selection:text-black overflow-hidden font-[var(--font-mono)]"
      onWheel={handleGlobalWheel}
    >
      {/* ═══ BACKGROUND EFFECTS ═══ */}
      {/* Blueprint Grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Sub-grid for extra detail */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
        }}
      />

      {/* Scanning Line */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="w-full h-1 bg-[#00f0ff] shadow-[0_0_20px_#00f0ff] opacity-40 animate-scanline absolute top-0" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.02)_0%,rgba(0,0,0,0.85)_100%)] z-0 pointer-events-none" />

      {/* ═══ TOP CORNER HUD ═══ */}
      <div className="fixed top-8 right-8 z-50 flex flex-col items-end gap-6 pointer-events-none">
        <div className="pointer-events-auto">
          <WorkContactCapsule />
        </div>
        <div className="flex gap-4 text-[0.55rem] tracking-[0.2em] text-[#00f0ff]/60">
          <div className="border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-3 py-1 rounded-sm">
            STATUS: SECURE
          </div>
          <div className="border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-3 py-1 rounded-sm flex gap-2">
            <span className="animate-pulse block w-2 h-2 bg-[#00f0ff] rounded-full self-center" />
            LIVE LINK {glitch}
          </div>
        </div>
      </div>

      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <p className="text-[0.6rem] tracking-[0.2em] text-white/40 uppercase bg-black/40 px-4 py-1 border border-white/10 rounded-full backdrop-blur-sm">
          {project.id === 1 ? "VIDEO SEQUENCE: ACTIVE" : "SCROLL TO CLOSE CONNECTION"}
        </p>
      </div>

      <div className="fixed bottom-8 right-8 z-50 pointer-events-none flex flex-col items-end text-right opacity-40 text-[0.45rem] tracking-[0.3em] leading-relaxed text-[#00f0ff]">
        <p>COORDS: 34.0522° N, 118.2437° W</p>
        <p>UPLINK: RJ-COMM-NET</p>
        <p>ENCRYPTION: QUANTUM-256</p>
      </div>

      {/* ═══ BACKGROUND MEDIA (Schematic Mode) ═══ */}
      <div className="absolute inset-0 z-0 pointer-events-auto mix-blend-screen opacity-60">
        {project.id === 1 ? (
          <SequencePlayer />
        ) : (
          <div className="relative w-full h-full group z-10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={project.image} 
              alt={project.title}
              className="w-3/4 max-w-5xl max-h-[70vh] object-contain transition-all duration-1000 ease-out filter contrast-125 sepia-[0.3] hue-rotate-[180deg]"
              style={{ filter: "drop-shadow(0 0 30px rgba(0, 240, 255, 0.2))" }}
            />
            {/* Crosshairs for schematic feel */}
            <div className="absolute w-[80%] max-w-6xl h-[1px] bg-[#00f0ff]/20" />
            <div className="absolute h-[80vh] w-[1px] bg-[#00f0ff]/20" />
            <div className="absolute w-[80%] max-w-6xl h-[80vh] border border-[#00f0ff]/10" />
          </div>
        )}
      </div>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#02050a]/90 via-[#02050a]/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#02050a]/90 via-[#02050a]/10 to-transparent z-10 pointer-events-none" />

      {/* ═══ LEFT SIDEBAR (Project Info) ═══ */}
      <div className="fixed top-1/2 -translate-y-1/2 left-12 z-50 w-80 space-y-8">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[#00f0ff] text-[0.6rem] tracking-[0.3em] font-bold">PROJECT.{project.id.toString().padStart(3, '0')}</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#00f0ff]/50 to-transparent" />
          </div>
          
          <h1 className="text-2xl tracking-[0.2em] font-bold mb-4 leading-tight text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            {project.title}
          </h1>
          <p className="text-[0.65rem] text-[#00f0ff] uppercase tracking-[0.2em] mb-8 font-bold border-l-2 border-[#00f0ff] pl-3">
            {project.shortDesc}
          </p>
          <p className="text-[0.75rem] leading-loose text-white/70 uppercase tracking-widest mb-8 text-justify">
            {project.longDesc}
          </p>
          
          <div className="flex flex-col gap-5 text-[0.65rem] tracking-[0.2em] uppercase font-bold">
            {project.externalLink ? (
              <a 
                href={project.externalLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#00f0ff] hover:text-white transition-all interactive w-fit border border-[#00f0ff]/40 hover:border-[#00f0ff] px-6 py-3 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 rounded-sm flex items-center gap-3 group shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full group-hover:scale-150 transition-transform" /> 
                VISIT MUMUKSHOGAME.COM ↗
              </a>
            ) : (
              <Link href="/" className="text-[#00f0ff]/70 hover:text-[#00f0ff] transition-all interactive w-fit border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 px-6 py-3 bg-[#00f0ff]/5 rounded-sm flex items-center gap-3 group">
                <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full group-hover:scale-150 transition-transform" /> 
                VIEW LIVE PROTOTYPE
              </Link>
            )}
            <Link href="/" className="text-white/40 hover:text-white transition-colors interactive w-fit flex items-center gap-2 pl-2">
              <span className="opacity-50">&lt;</span> TERMINATE CONNECTION
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT SIDEBAR (Technical Specs) ═══ */}
      <div className="fixed top-1/2 -translate-y-1/2 right-12 z-50 w-72 space-y-8 pointer-events-none">
        <div className="border border-[#00f0ff]/20 bg-black/40 backdrop-blur-md p-6 rounded-sm">
          <div className="flex items-center gap-3 mb-8">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="text-[0.6rem] tracking-[0.3em] text-[#00f0ff]">SYSTEM TELEMETRY</span>
          </div>

          <div className="space-y-6">
            {stats.map((stat, idx) => (
              <div key={stat.label} className="space-y-2">
                <div className="flex justify-between text-[0.55rem] tracking-[0.1em] text-white/60">
                  <span>{stat.label}</span>
                  <span className="text-[#00f0ff] font-bold">{mounted ? stat.value : 0}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00f0ff]/20 to-[#00f0ff] transition-all duration-1000 ease-out"
                    style={{ width: mounted ? `${stat.value}%` : "0%", transitionDelay: `${idx * 150}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#00f0ff]/10">
            <span className="text-[0.55rem] tracking-[0.2em] text-white/40 block mb-3">TECH STACK / INFRASTRUCTURE</span>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <span key={tech} className="text-[0.5rem] tracking-widest text-[#00f0ff]/80 bg-[#00f0ff]/10 border border-[#00f0ff]/20 px-2 py-1 rounded-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
