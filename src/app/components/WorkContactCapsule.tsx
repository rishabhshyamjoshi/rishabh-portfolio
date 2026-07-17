"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WorkContactCapsule() {
  return (
    <div className="flex items-center justify-between px-6 py-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-[0.65rem] tracking-widest font-[var(--font-mono)] text-white/70 shadow-[0_0_20px_rgba(255,255,255,0.05)] w-[300px] max-w-full interactive hover:border-white/40 transition-colors duration-500">
      
      {/* WORK Link */}
      <Link href="/" className="hover:text-white transition-colors uppercase tracking-[0.2em] relative group py-2">
        <span className="relative z-10">WORK</span>
        <div className="absolute -inset-2 bg-white/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Animated Wave Separator */}
      <div className="flex-1 flex justify-center items-center pointer-events-none px-4">
        <svg
          width="48"
          height="12"
          viewBox="0 0 48 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-70"
        >
          <motion.path
            d="M0 6 C 12 6, 12 0, 24 6 C 36 12, 36 6, 48 6"
            stroke="url(#wave-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ strokeDasharray: "100 100", strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear",
            }}
          />
          <motion.path
            d="M0 6 C 12 12, 12 6, 24 6 C 36 0, 36 6, 48 6"
            stroke="url(#wave-grad-2)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ strokeDasharray: "100 100", strokeDashoffset: -100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear",
            }}
          />
          <defs>
            <linearGradient id="wave-grad" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(255,255,255,0)" />
              <stop offset="0.5" stopColor="rgba(255,255,255,1)" />
              <stop offset="1" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(0,240,255,0)" />
              <stop offset="0.5" stopColor="rgba(0,240,255,0.6)" />
              <stop offset="1" stopColor="rgba(0,240,255,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* CONTACT Link */}
      <a href="mailto:hello@rj.industries" className="hover:text-white transition-colors uppercase tracking-[0.2em] relative group py-2">
        <span className="relative z-10">CONTACT</span>
        <div className="absolute -inset-2 bg-white/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
      
    </div>
  );
}
