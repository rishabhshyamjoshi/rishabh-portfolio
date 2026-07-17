"use client";

import { PROJECTS } from "@/app/data/projects";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import SequencePlayer from "@/app/components/SequencePlayer";
import WorkContactCapsule from "@/app/components/WorkContactCapsule";

export default function ProjectCaseStudy({ params }: { params: { id: string } }) {
  const router = useRouter();
  const project = PROJECTS.find((p) => p.id === parseInt(params.id));
  
  if (!project) {
    notFound();
  }

  const handleGlobalWheel = (e: React.WheelEvent) => {
    // Only apply global scroll-to-close for non-sequence projects, 
    // SequencePlayer handles its own scrolling logic to play the video first.
    if (project.id !== 1 && e.deltaY > 50) {
      router.push("/");
    }
  };

  return (
    <div 
      className="relative min-h-screen bg-[#06080a] text-white selection:bg-[#00f0ff] selection:text-black overflow-hidden font-[var(--font-mono)]"
      onWheel={handleGlobalWheel}
    >
      
      {/* Background Noise Texture */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.03)_0%,rgba(0,0,0,0.8)_100%)] z-0 pointer-events-none" />

      {/* Top Right UI Group */}
      <div className="fixed top-8 right-8 z-50 flex flex-col items-end gap-6">
        <WorkContactCapsule />
        <div className="border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-1 text-[0.55rem] tracking-widest text-white/50 rounded-sm">
          &lt;&lt; USK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5. NUEF &gt;&gt;
        </div>
      </div>

      {/* Top Center UI Group */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <p className="text-[0.6rem] tracking-[0.2em] text-white/40 uppercase">
          SCROLL TO CLOSE
        </p>
      </div>

      {/* Center Cinematic Viewport (Bezel) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative w-[65vw] h-[65vh] rounded-[2rem] overflow-hidden bg-black border-[4px] border-[#111] shadow-[0_0_80px_rgba(0,0,0,1),inset_0_0_40px_rgba(0,0,0,1)] pointer-events-auto">
          {/* Bezel inner metallic rim */}
          <div className="absolute inset-0 rounded-[1.8rem] border border-white/10 z-20 pointer-events-none" />
          
          {/* Viewport Content */}
          {project.id === 1 ? (
            <div className="w-full h-full relative z-10">
              <SequencePlayer />
            </div>
          ) : (
            <div className="relative w-full h-full group z-10">
              <div className="absolute inset-0 bg-black/40 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 border border-[#00f0ff]/10 z-20" />
            </div>
          )}
        </div>
      </div>

      {/* Left Sidebar Details */}
      <div className="fixed bottom-24 left-12 z-50 w-80 space-y-8">
        <div>
          <h1 className="text-xl tracking-widest font-bold mb-6">
            {project.title}
          </h1>
          <p className="text-xs text-white/50 uppercase tracking-[0.15em] mb-6">
            {project.shortDesc}
          </p>
          <p className="text-[0.7rem] leading-relaxed text-white/70 uppercase tracking-widest mb-8">
            {project.longDesc}
          </p>
          
          <div className="flex flex-col gap-4 text-xs tracking-[0.2em] uppercase">
            <Link href="/" className="text-white/60 hover:text-white transition-colors interactive w-fit border-b border-white/20 hover:border-white/60 pb-1">
              PROJECT LINK
            </Link>
            <Link href="/" className="text-white/60 hover:text-white transition-colors interactive w-fit flex items-center gap-2">
              <span>&lt;-</span> CLOSE
            </Link>
          </div>
        </div>

        <button className="border border-white/20 rounded-full px-6 py-3 text-[0.6rem] tracking-[0.2em] text-white/40 hover:bg-white/10 hover:text-white transition-all duration-300 interactive">
          ASK ME ANYTHING...
        </button>
      </div>

    </div>
  );
}
