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
    <div className="bg-black text-white min-h-screen w-full font-mono overflow-x-hidden relative flex flex-col items-center justify-center p-6 text-center">
      {/* Deep Space Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_60%)] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <Link
          href="/"
          className="flex items-center gap-2 border border-white/30 bg-white/5 px-3 py-1.5 rounded-full text-[0.6rem] tracking-[0.25em] text-white"
        >
          <span>&larr;</span> CORE
        </Link>
        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] border border-cyan-500/40 px-3 py-1.5 rounded-full text-cyan-400"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${audioMuted ? "bg-red-500" : "bg-cyan-400 animate-pulse"}`} />
          {audioMuted ? "MUTED" : "AUDIO ON"}
        </button>
      </header>

      {/* CONTENT */}
      <div className="z-10 flex flex-col items-center max-w-sm mt-16">
        <div className="w-32 h-32 rounded-full border border-cyan-500/30 flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(0,240,255,0.15)] relative">
          <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_4s_linear_infinite]" />
          <div className="w-16 h-16 bg-black rounded-full shadow-[0_0_20px_#000_inset]" />
        </div>

        <h1 className="text-xl tracking-[0.4em] mb-4 text-cyan-400 font-light">
          THE ACADEMY
        </h1>
        <p className="text-xs text-white/50 tracking-wider leading-relaxed mb-10">
          Uplink established. You have reached the singularity of knowledge. The immersive 3D academy experience requires a higher computational mass. Access via desktop to explore the event horizon.
        </p>

        <a 
          href="https://www.youtube.com/@RishabhJoshi/videos"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[0.65rem] tracking-[0.3em] rounded-md"
        >
          ACCESS DATA LOGS
        </a>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-6 text-[0.5rem] tracking-[0.3em] text-white/20">
        MASS: 4.1M M☉ | DILATION: ACTIVE
      </div>
    </div>
  );
}
