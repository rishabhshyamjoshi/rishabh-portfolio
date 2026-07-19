"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WorkContactCapsule() {
  return (
    <div className="relative flex items-center justify-between w-[340px] max-w-full font-[var(--font-mono)] text-[0.65rem] tracking-[0.3em] interactive group">
      
      {/* High-tech HUD Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30 group-hover:border-cyan-400/70 transition-colors duration-500" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30 group-hover:border-cyan-400/70 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30 group-hover:border-cyan-400/70 transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30 group-hover:border-cyan-400/70 transition-colors duration-500" />

      {/* Main Container */}
      <div className="w-full flex items-center justify-between px-6 py-2.5 bg-black/40 backdrop-blur-md border-y border-white/5 group-hover:bg-black/60 transition-all duration-500">
        
        {/* WORK Link */}
        <Link href="/" className="relative text-white/60 hover:text-white transition-colors duration-300 uppercase flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-cyan-500/70 shadow-[0_0_8px_rgba(0,240,255,0.6)] animate-pulse" />
          WORK
        </Link>

        {/* Dynamic Center Element (Laser Scanner) */}
        <div className="flex-1 flex justify-center items-center pointer-events-none px-4 relative overflow-hidden">
          <div className="w-full h-[1px] bg-white/10" />
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 left-0 w-16 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_rgba(0,240,255,1)]"
            animate={{ left: ["-20%", "120%"] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          />
        </div>

        {/* CONTACT Link */}
        <a href="mailto:hello@rj.industries" className="relative text-white/60 hover:text-white transition-colors duration-300 uppercase flex items-center gap-3">
          CONTACT
          <span className="w-1.5 h-1.5 bg-rose-500/70 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
        </a>
        
      </div>
    </div>
  );
}
