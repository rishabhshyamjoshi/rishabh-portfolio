"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { PROJECTS } from "../data/projects";
import { TEAM } from "../data/team";
import { AudioController } from "../utils/AudioController";

export default function Mobile2DView() {
  const [audioMuted, setAudioMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hero Parallax
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useEffect(() => {
    document.body.style.overflowY = "auto";
    document.body.style.cursor = "auto";
    return () => {
      document.body.style.overflowY = "hidden";
      document.body.style.cursor = "none";
    };
  }, []);

  const handleAudioToggle = async () => {
    try {
      const isMuted = await AudioController.getInstance().toggleMute();
      setAudioMuted(isMuted);
    } catch(err) {}
  };

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } }
  };

  return (
    <div ref={containerRef} className="bg-[#030303] text-white min-h-screen w-full font-sans overflow-x-hidden selection:bg-white/20 pb-32">
      
      {/* Noise Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] w-full flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Subtle glowing orb in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 flex flex-col items-center w-full mt-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="w-[140px] relative h-[40px] mb-12"
          >
            <Image 
              src="/logo.png" 
              alt="RJ Industries Logo" 
              fill
              className="object-contain"
            />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[0.6rem] tracking-[0.5em] text-white/50 mb-6 font-medium uppercase text-center"
          >
            Advanced Engineering
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-center text-3xl sm:text-4xl font-light tracking-tight text-white/90 leading-[1.2] px-2 max-w-[320px]"
          >
            Innovation beyond the <br /> <span className="font-semibold text-white italic">limits of humanity.</span>
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

      {/* PROJECTS SECTION */}
      <section className="w-full px-6 pt-12 pb-24 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="mb-16 flex items-center gap-4"
        >
          <div className="h-[1px] bg-white/20 flex-grow" />
          <h2 className="text-[10px] tracking-[0.3em] text-white/60 font-medium uppercase">Featured Work</h2>
        </motion.div>

        <div className="flex flex-col gap-12">
          {PROJECTS.map((project, idx) => {
            // Alternate card styles for an asymmetric editorial look
            const isWide = idx % 3 === 0;
            const alignRight = idx % 2 !== 0 && !isWide;

            return (
              <motion.a 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariant}
                key={project.id} 
                href={project.externalLink || project.link}
                target={project.externalLink ? "_blank" : "_self"}
                className={`group block relative overflow-hidden bg-[#0A0A0A] border border-white/5 rounded-3xl shadow-2xl transition-all duration-500 hover:border-white/20
                  ${isWide ? 'w-full aspect-[4/3]' : 'w-[85%] aspect-[3/4]'} 
                  ${alignRight ? 'ml-auto' : ''}
                `}
              >
                {/* Image with subtle parallax scaling */}
                <div className="absolute inset-0 w-full h-full overflow-hidden rounded-3xl">
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    className="object-cover opacity-[0.85] grayscale-[20%] transition-all duration-[2s] ease-out group-hover:scale-110 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                </div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="self-start px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[8px] tracking-[0.2em] font-medium text-white/80 uppercase">
                    {project.shortDesc}
                  </div>
                  
                  <div className="flex flex-col justify-end">
                    <h4 className="text-2xl font-semibold tracking-tight mb-2 text-white/95 leading-tight group-hover:text-white transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs text-white/50 leading-relaxed font-light line-clamp-2 pr-4 transition-all duration-500 group-hover:text-white/70">
                      {project.longDesc}
                    </p>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </section>

      {/* TEAM SECTION (Horizontal Scroll) */}
      <section className="w-full pt-12 pb-24 relative overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="px-6 mb-12 flex items-center gap-4"
        >
          <h2 className="text-[10px] tracking-[0.3em] text-white/60 font-medium uppercase">Operatives</h2>
          <div className="h-[1px] bg-white/20 flex-grow" />
        </motion.div>

        <div className="flex overflow-x-auto gap-4 px-6 pb-8 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {TEAM.map((member) => (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              key={member.id} 
              className="flex-shrink-0 w-[260px] snap-center flex flex-col gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden relative border border-white/5">
                <Image src={member.image} alt={member.name} fill className="object-cover grayscale transition-all duration-700 hover:grayscale-0 hover:scale-105" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-lg font-medium tracking-tight mb-1">{member.name}</h4>
                <div className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-medium mb-3">
                  {member.role}
                </div>
                <p className="text-xs text-white/50 leading-relaxed font-light line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FLOATING BOTTOM NAV */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl w-[90%] max-w-[320px]">
        <a href="mailto:contact@rjindustries.dev" className="flex-1 py-3 text-center rounded-full text-[9px] tracking-[0.2em] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all">
          CONTACT
        </a>
        <div className="w-[1px] h-4 bg-white/20" />
        <a href="https://www.linkedin.com/company/rj-industries01/" target="_blank" className="flex-1 py-3 text-center rounded-full text-[9px] tracking-[0.2em] font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all">
          LINKEDIN
        </a>
        <div className="w-[1px] h-4 bg-white/20" />
        <button 
          onClick={handleAudioToggle}
          className="flex-1 py-3 text-center rounded-full text-[9px] tracking-[0.2em] font-medium text-white hover:text-white bg-white/10 hover:bg-white/20 transition-all"
        >
          {audioMuted ? "SOUND OFF" : "SOUND ON"}
        </button>
      </div>

    </div>
  );
}
