"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, Variants, useMotionValueEvent } from "framer-motion";
import SequencePlayer from "./SequencePlayer";
import { PROJECTS } from "../data/projects";
import { TEAM } from "../data/team";
import { AudioController } from "../utils/AudioController";

export default function Mobile2DView() {
  const [audioMuted, setAudioMuted] = useState(true);
  const [scrollVal, setScrollVal] = useState(0);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const teamScrollRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Hero Parallax
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollVal(latest);
  });

  useEffect(() => {
    document.body.style.overflowY = "auto";
    document.body.style.cursor = "auto";
    return () => {
      document.body.style.overflowY = "hidden";
      document.body.style.cursor = "none";
    };
  }, []);

  // Handle Team Scroll Snapping active state
  useEffect(() => {
    const scrollContainer = teamScrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const cardWidth = 260 + 16; // w-[260px] + gap-4 (16px)
      const centerIndex = Math.round(scrollLeft / cardWidth);
      setActiveTeamIndex(centerIndex);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAudioToggle = async () => {
    try {
      const isMuted = await AudioController.getInstance().toggleMute();
      setAudioMuted(isMuted);
    } catch(err) {}
  };

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } }
  };

  return (
    <div ref={containerRef} className="bg-[#030303] text-white min-h-screen w-full font-sans overflow-x-hidden selection:bg-white/20 pb-32">
      
      {/* Noise Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Global Scroll-triggered Sequence Frames */}
      <div className="fixed inset-0 w-full h-full opacity-40 mix-blend-screen pointer-events-none z-0">
        <SequencePlayer externalProgress={scrollVal} />
      </div>

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] w-full flex flex-col items-center justify-center p-6 overflow-hidden z-10">
        
        {/* Logo in Background (Large & Faded) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <div className="relative w-[90%] aspect-video max-w-sm">
             <Image src="/logo.png" alt="RJ Industries" fill className="object-contain filter blur-[1px]" />
          </div>
        </div>
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 flex flex-col items-center w-full mt-10"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[0.55rem] tracking-[0.5em] text-white/50 mb-8 font-medium uppercase text-center"
          >
            Advanced Engineering
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-center text-4xl sm:text-5xl font-light tracking-tight text-white/95 leading-[1.1] max-w-[320px]"
          >
            Innovation<br/>
            <span className="text-white/60 text-3xl">beyond the</span><br/>
            <span className="font-semibold text-white italic">limits of<br/>humanity.</span>
          </motion.p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-4 z-10"
        >
          <div className="w-[1px] h-[60px] bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* PROJECTS SECTION (Minimal Interactive Bars) */}
      <section className="w-full px-6 py-24 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="mb-12 flex items-center gap-4"
        >
          <div className="h-[1px] bg-white/10 flex-grow" />
          <h2 className="text-[9px] tracking-[0.4em] text-white/50 font-medium uppercase">Featured Work</h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {PROJECTS.map((project, idx) => (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              key={project.id} 
              className="w-full"
            >
              <Link 
                href={`/project/${project.id}`}
                className="group w-full flex items-center justify-between p-5 bg-[#080808]/80 border border-white/5 rounded-2xl backdrop-blur-md transition-all active:scale-[0.98] active:bg-white/5 shadow-2xl"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] text-white/40 tracking-[0.3em] uppercase font-bold">
                    {project.shortDesc}
                  </span>
                  <span className="text-sm font-medium tracking-wide text-white/90">
                    {project.title}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02]">
                  <span className="text-[10px] text-white/50">&rarr;</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION (Horizontal Scroll with Snap & Colorize) */}
      <section className="w-full py-24 relative overflow-hidden z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="px-6 mb-12 flex items-center gap-4"
        >
          <h2 className="text-[9px] tracking-[0.4em] text-white/50 font-medium uppercase">Operatives</h2>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </motion.div>

        <div 
          ref={teamScrollRef}
          className="flex overflow-x-auto gap-4 px-6 pb-8 snap-x snap-mandatory hide-scrollbar relative" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TEAM.map((member, idx) => {
            const isActive = idx === activeTeamIndex;
            return (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUpVariant}
                key={member.id} 
                className={`flex-shrink-0 w-[260px] snap-center flex flex-col gap-5 p-6 rounded-3xl border backdrop-blur-xl transition-all duration-500
                  ${isActive ? 'bg-white/[0.05] border-white/10' : 'bg-black/40 border-white/5'}
                `}
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden relative border border-white/5 bg-[#050505]">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className={`object-cover transition-all duration-1000 ${isActive ? 'grayscale-0 scale-105' : 'grayscale opacity-60 scale-100'}`} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="flex flex-col">
                  <h4 className={`text-lg tracking-tight mb-1 transition-colors ${isActive ? 'font-semibold text-white' : 'font-medium text-white/70'}`}>
                    {member.name}
                  </h4>
                  <div className="text-[9px] uppercase tracking-[0.3em] font-medium mb-3 text-[#00f0ff]">
                    {member.role}
                  </div>
                  <p className={`text-[0.65rem] leading-relaxed font-light line-clamp-3 transition-colors ${isActive ? 'text-white/70' : 'text-white/40'}`}>
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {/* Scroll hint indicator */}
        <div className="flex justify-center gap-1 mt-2">
          {TEAM.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-[2px] rounded-full transition-all duration-300 ${idx === activeTeamIndex ? 'w-4 bg-white/60' : 'w-1 bg-white/10'}`} 
            />
          ))}
        </div>
      </section>

      {/* FLOATING BOTTOM NAV */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl w-[90%] max-w-[320px]">
        <a href="mailto:contact@rjindustries.dev" className="flex-1 py-3 text-center rounded-full text-[9px] tracking-[0.2em] font-medium text-white/60 hover:text-white transition-all active:bg-white/10">
          CONTACT
        </a>
        <div className="w-[1px] h-4 bg-white/10" />
        <a href="https://www.linkedin.com/company/rj-industries01/" target="_blank" className="flex-1 py-3 text-center rounded-full text-[9px] tracking-[0.2em] font-medium text-white/60 hover:text-white transition-all active:bg-white/10">
          LINKEDIN
        </a>
        <div className="w-[1px] h-4 bg-white/10" />
        <button 
          onClick={handleAudioToggle}
          className="flex-1 py-3 text-center rounded-full text-[9px] tracking-[0.2em] font-bold text-[#00f0ff] hover:text-white bg-[#00f0ff]/10 transition-all active:bg-white/10"
        >
          {audioMuted ? "SOUND OFF" : "SOUND ON"}
        </button>
      </div>

    </div>
  );
}
