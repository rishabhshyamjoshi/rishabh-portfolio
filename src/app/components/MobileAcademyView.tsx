"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AudioController } from "../utils/AudioController";

export default function MobileAcademyView() {
  const [audioMuted, setAudioMuted] = useState(true);

  useEffect(() => {
    document.body.style.overflowY = "auto";
    return () => {
      document.body.style.overflowY = "hidden";
    };
  }, []);

  const toggleAudio = async () => {
    try {
      const muted = await AudioController.getInstance().toggleMute();
      setAudioMuted(muted);
    } catch (e) {}
  };

  return (
    <div className="bg-[#030303] text-white min-h-screen w-full font-sans overflow-x-hidden relative flex flex-col items-center justify-center p-6 text-center">
      {/* Noise Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      
      {/* Subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] opacity-100 pointer-events-none" />

      {/* FLOATING TOP NAV */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl w-[90%] max-w-[320px]">
        <Link
          href="/"
          className="text-[9px] tracking-[0.2em] font-medium text-white/70 hover:text-white transition-all"
        >
          &larr; CORE
        </Link>
        <button
          onClick={toggleAudio}
          className="text-[9px] tracking-[0.2em] font-medium text-white/70 hover:text-white transition-all flex items-center gap-2"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${audioMuted ? "bg-white/20" : "bg-white animate-pulse"}`} />
          {audioMuted ? "SOUND OFF" : "SOUND ON"}
        </button>
      </header>

      {/* CONTENT */}
      <div className="z-10 flex flex-col items-center max-w-sm mt-12">
        <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(255,255,255,0.02)] relative">
          <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_6s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-white/5 animate-[spin_4s_linear_infinite_reverse]" />
          <div className="w-16 h-16 bg-black rounded-full shadow-[0_0_20px_#000_inset]" />
        </div>

        <h1 className="text-xl tracking-[0.4em] mb-4 text-white/90 font-light uppercase">
          The Academy
        </h1>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent mb-6" />
        <p className="text-xs text-white/40 tracking-widest leading-relaxed mb-12 font-light px-4">
          Uplink established. You have reached the singularity of knowledge. The immersive 3D academy experience requires a higher computational mass. Access via desktop to explore the event horizon.
        </p>

        <a 
          href="https://www.youtube.com/@RishabhJoshi/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-[0.65rem] tracking-[0.3em] rounded-full backdrop-blur-md"
        >
          ACCESS DATA LOGS
        </a>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-8 text-[0.45rem] tracking-[0.4em] text-white/20 font-medium">
        MASS: 4.1M M☉ | DILATION: ACTIVE
      </div>
    </div>
  );
}
