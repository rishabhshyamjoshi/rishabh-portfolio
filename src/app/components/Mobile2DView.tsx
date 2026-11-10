"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, Variants, useMotionValueEvent, AnimatePresence } from "framer-motion";
import SequencePlayer from "./SequencePlayer";
import { PROJECTS, ProjectData } from "../data/projects";
import { TEAM } from "../data/team";
import { AudioController } from "../utils/AudioController";

export default function Mobile2DView() {
  const [audioMuted, setAudioMuted] = useState(true);
  const [scrollVal, setScrollVal] = useState(0);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const teamScrollRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();

  // Hero Parallax
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.1]);

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
      const cardWidth = 270 + 16;
      const centerIndex = Math.round(scrollLeft / cardWidth);
      setActiveTeamIndex(Math.min(TEAM.length - 1, Math.max(0, centerIndex)));
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

  const toggleProjectSpecs = (id: number) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@rjindustries.dev");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div ref={containerRef} className="bg-[#030306] text-white min-h-screen w-full font-sans overflow-x-hidden selection:bg-cyan-500/30 pb-36">
      
      {/* ═══ NOISE & CYBER GRID OVERLAYS ═══ */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-[100]" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" 
      />

      {/* Background Frame Sequence Player */}
      <div className="fixed inset-0 w-full h-full opacity-25 mix-blend-screen pointer-events-none z-0">
        <SequencePlayer externalProgress={scrollVal} />
      </div>

      {/* ═══ 1. ARMOR-STYLE FLOATING HUD TOP BAR ═══ */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[420px]">
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          
          {/* Logo & Operational Status */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-5 h-5">
              <Image src="/logo.png" alt="RJ Industries" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black tracking-[0.18em] uppercase text-white font-[var(--font-orbitron)]">
                RJ INDUS<span className="text-cyan-400">.</span>
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                <span className="text-[7.5px] tracking-widest text-emerald-400/90 font-mono uppercase font-bold">ONLINE</span>
              </div>
            </div>
          </Link>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2">
            <Link 
              href="/academy" 
              className="px-2.5 py-1 text-[9px] font-mono tracking-wider font-semibold text-white/80 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 transition-all flex items-center gap-1"
            >
              <span className="text-cyan-400">◎</span> 360° TOUR
            </Link>
            
            <button
              onClick={handleAudioToggle}
              className={`px-2.5 py-1 text-[8.5px] font-mono tracking-wider font-bold rounded-full border transition-all flex items-center gap-1.5
                ${audioMuted 
                  ? 'bg-white/5 border-white/10 text-white/50' 
                  : 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'}
              `}
              aria-label="Toggle Audio"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${audioMuted ? 'bg-white/30' : 'bg-cyan-400 animate-ping'}`} />
              {audioMuted ? "MUTE" : "AUDIO ON"}
            </button>
          </div>

        </div>
      </header>

      {/* ═══ 2. HIGH-OCTANE HERO SECTION (Armor Style Hardware Showcase) ═══ */}
      <section className="relative min-h-[100dvh] pt-28 pb-16 px-6 flex flex-col justify-between overflow-hidden z-10">
        
        {/* Glow ambient background sphere */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="flex flex-col items-center text-center w-full relative z-10"
        >
          {/* Micro HUD Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/10 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[8.5px] tracking-[0.25em] font-mono text-cyan-300/90 uppercase font-semibold">
              PRE-SEED FUNDED // SOVEREIGN ARCHITECTURE
            </span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-[var(--font-orbitron)] leading-[1.05] mb-4">
            SOVEREIGN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-white/70">
              ENGINEERING.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-white/60 font-light tracking-wide max-w-[330px] leading-relaxed mb-8">
            Next-generation aerospace platforms, defense robotics, and large-scale software systems engineered by Mechanical Engineers.
          </p>

          {/* Armor-style Hardware Showcase Card: K.I.N.E.T.I.C Glasses */}
          <div className="w-full max-w-[360px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 p-5 relative overflow-hidden backdrop-blur-md rounded-2xl shadow-2xl">
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-[8.5px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
                FLAGSHIP HARDWARE // PROJ_01
              </span>
              <span className="px-2 py-0.5 text-[8px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold">
                ACTIVE
              </span>
            </div>

            <div className="relative w-full aspect-[16/9] mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-radial-gradient from-cyan-500/20 to-transparent blur-xl" />
              <Image 
                src="/rj-glasses.png" 
                alt="K.I.N.E.T.I.C Glasses" 
                fill 
                className="object-contain filter drop-shadow-[0_15px_25px_rgba(0,240,255,0.25)]" 
                priority 
              />
            </div>

            <h3 className="text-lg font-bold tracking-wider font-[var(--font-orbitron)] text-white mb-1 text-left">
              K.I.N.E.T.I.C™ GLASSES
            </h3>
            <p className="text-[10.5px] text-white/60 font-light text-left leading-relaxed mb-4">
              Wearable spatial AI powered by the proprietary RJ-A1 neural silicon. 100% offline, air-gapped field intelligence.
            </p>

            {/* Hardware Spec Chips */}
            <div className="grid grid-cols-2 gap-1.5 mb-5 text-left">
              <div className="px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg">
                <span className="block text-[7px] font-mono text-white/40 uppercase">CHIPSET</span>
                <span className="text-[9px] font-mono font-bold text-cyan-300">RJ-A1 NEURAL</span>
              </div>
              <div className="px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg">
                <span className="block text-[7px] font-mono text-white/40 uppercase">SECURITY</span>
                <span className="text-[9px] font-mono font-bold text-emerald-300">100% AIR-GAPPED</span>
              </div>
              <div className="px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg">
                <span className="block text-[7px] font-mono text-white/40 uppercase">OPTICS</span>
                <span className="text-[9px] font-mono font-bold text-white">DUAL MICRO-OLED</span>
              </div>
              <div className="px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg">
                <span className="block text-[7px] font-mono text-white/40 uppercase">CHASSIS</span>
                <span className="text-[9px] font-mono font-bold text-white">GRADE 5 TITANIUM</span>
              </div>
            </div>

            {/* Quick Action Button */}
            <Link 
              href="/project/1" 
              className="w-full py-2.5 bg-white text-black font-bold text-[10px] font-mono tracking-widest uppercase rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-300 transition-all active:scale-[0.98]"
            >
              <span>INSPECT CASE STUDY</span>
              <span>&rarr;</span>
            </Link>

          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="w-full flex flex-col items-center gap-2 mt-8 z-10">
          <span className="text-[8px] font-mono tracking-[0.3em] text-white/40 uppercase font-bold">
            SCROLL TO EXPLORE DEPLOYMENTS
          </span>
          <div className="w-4 h-7 border border-white/20 rounded-full flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_5px_#22d3ee]" 
            />
          </div>
        </div>

      </section>

      {/* ═══ 3. HIGH-TECH TELEMETRY TICKER ═══ */}
      <div className="w-full py-3 bg-black/90 border-y border-white/10 overflow-hidden relative z-10 backdrop-blur-md">
        <div className="flex whitespace-nowrap animate-[marquee_24s_linear_infinite] gap-8 text-[9px] font-mono tracking-[0.25em] text-white/70 uppercase">
          <span>// SOVEREIGN DEFENSE</span>
          <span className="text-cyan-400">●</span>
          <span>AEROSPACE PROPULSION</span>
          <span className="text-cyan-400">●</span>
          <span>MECHANICAL SYSTEMS & CAD</span>
          <span className="text-cyan-400">●</span>
          <span>RJ-A1 NEURAL SILICON</span>
          <span className="text-cyan-400">●</span>
          <span>LARGE-SCALE WEB SYSTEMS</span>
          <span className="text-cyan-400">●</span>
          <span>QUANTUM ENCRYPTION ARRAYS</span>
          <span className="text-cyan-400">●</span>
          <span>PRE-SEED $100K CAPITAL</span>
        </div>
      </div>

      {/* ═══ 4. CORE STRATEGIC DIVISIONS (Bento Grid) ═══ */}
      <section className="w-full px-5 py-16 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase font-bold">
              [CAPABILITY MATRIX]
            </span>
            <div className="h-[1px] bg-white/15 flex-grow" />
          </div>
          <h2 className="text-2xl font-black font-[var(--font-orbitron)] tracking-tight text-white uppercase">
            STRATEGIC DIVISIONS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: "01",
              title: "AEROSPACE & ORBITAL",
              desc: "Orbital launch trajectories, deep-space telemetry, and autonomous entry vehicles.",
              tag: "PROPULSION",
              accent: "text-cyan-400"
            },
            {
              id: "02",
              title: "SOVEREIGN DEFENSE",
              desc: "Tactical defense platforms, electronic warfare counter-systems, and quantum key distribution.",
              tag: "TACTICAL",
              accent: "text-amber-400"
            },
            {
              id: "03",
              title: "MECHANICAL & ROBOTICS",
              desc: "Electro-mechanical actuators, high-density PCB packaging, and precision CAD/FEA simulation.",
              tag: "KINEMATICS",
              accent: "text-emerald-400"
            },
            {
              id: "04",
              title: "ENTERPRISE SOFTWARE",
              desc: "High-concurrency web platforms, real-time 3D graphics computing, and scalable cloud architectures.",
              tag: "SYSTEMS",
              accent: "text-blue-400"
            }
          ].map((div) => (
            <motion.div
              key={div.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUpVariant}
              className="p-4 bg-white/[0.03] border border-white/10 rounded-xl relative overflow-hidden backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-white/30 font-bold">{div.id} //</span>
                <span className={`text-[8px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 bg-white/5 border border-white/10 rounded ${div.accent}`}>
                  {div.tag}
                </span>
              </div>
              <h3 className="text-sm font-bold font-[var(--font-orbitron)] tracking-wider text-white mb-1.5">
                {div.title}
              </h3>
              <p className="text-[10.5px] text-white/60 leading-relaxed font-light">
                {div.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ 5. HARDWARE & SYSTEMS DEPLOYMENTS (Armor-Style Product Cards) ═══ */}
      <section className="w-full px-5 py-12 relative z-10">
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUpVariant}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase font-bold">
                ACTIVE ROSTER // 07 SYSTEMS
              </span>
            </div>
            <h2 className="text-2xl font-black font-[var(--font-orbitron)] tracking-tight text-white uppercase">
              DEPLOYED WORK
            </h2>
          </div>
          <span className="text-[9px] font-mono text-white/40 tracking-wider">
            [TAP FOR SPECS]
          </span>
        </motion.div>

        {/* The 7 Projects in High-Octane Armor Cards */}
        <div className="flex flex-col gap-5">
          {PROJECTS.map((project: ProjectData, idx) => {
            const isExpanded = expandedProjectId === project.id;
            const targetUrl = project.externalLink || project.link;

            return (
              <motion.div
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUpVariant}
                className="w-full bg-[#07090e] border border-white/15 rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex flex-col"
              >
                
                {/* Top Card Meta Header */}
                <div className="px-4 py-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold text-white/40">
                      0{idx + 1}
                    </span>
                    <div className="w-[1px] h-3 bg-white/20" />
                    <span className="text-[9px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                      {project.shortDesc}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                    <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase">DEPLOYED</span>
                  </div>
                </div>

                {/* Hero Product Visual with Vignette */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/60">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className="object-cover transition-transform duration-700 hover:scale-105 filter contrast-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/30" />
                </div>

                {/* Content & Actions */}
                <div className="p-5 flex flex-col">
                  
                  <h3 className="text-xl font-bold font-[var(--font-orbitron)] tracking-wider text-white mb-2">
                    {project.title}
                  </h3>

                  <p className="text-[11px] text-white/65 font-light leading-relaxed mb-4">
                    {project.longDesc}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.techStack.map((tech) => (
                      <span 
                        key={tech} 
                        className="px-2 py-0.5 text-[8.5px] font-mono bg-white/[0.05] border border-white/10 text-white/80 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Technical Dossier (Armor PDP Spec Accordion) */}
                  <div className="w-full border-t border-white/10 pt-3 mb-4">
                    <button
                      onClick={() => toggleProjectSpecs(project.id)}
                      className="w-full flex items-center justify-between text-[9.5px] font-mono tracking-widest text-cyan-300 font-bold uppercase py-1"
                    >
                      <span>{isExpanded ? "[-] HIDE SPECIFICATIONS" : "[+] TECHNICAL DOSSIER"}</span>
                      <span className="text-white/40">{isExpanded ? "▲" : "▼"}</span>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pt-3 pb-1 overflow-hidden"
                        >
                          <div className="p-3 bg-black/70 border border-white/10 rounded-lg text-left grid grid-cols-2 gap-2 text-[9px] font-mono">
                            <div>
                              <span className="text-white/40 block">SYSTEM STATUS:</span>
                              <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">ARCHITECTURE:</span>
                              <span className="text-white font-bold">{project.techStack[0] || "PROPRIETARY"}</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">SECURITY CLEARANCE:</span>
                              <span className="text-cyan-300 font-bold">SOVEREIGN TIER</span>
                            </div>
                            <div>
                              <span className="text-white/40 block">TELEMETRY:</span>
                              <span className="text-white font-bold">LIVE TELEMETRY</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={targetUrl}
                      target={targetUrl.startsWith("http") ? "_blank" : "_self"}
                      rel={targetUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex-1 py-3 px-4 bg-cyan-400 text-black font-bold text-[10px] font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 hover:bg-cyan-300 transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                      <span>LAUNCH SYSTEM</span>
                      <span>↗</span>
                    </a>

                    <Link
                      href={`/project/${project.id}`}
                      className="py-3 px-4 bg-white/5 border border-white/15 text-white font-bold text-[10px] font-mono tracking-widest uppercase rounded-xl hover:bg-white/15 transition-all flex items-center justify-center"
                    >
                      CASE STUDY
                    </Link>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>

      </section>

      {/* ═══ 6. SQUADRON / AI OPERATIVES (Horizontal Snap Scroll) ═══ */}
      <section className="w-full py-14 relative overflow-hidden z-10">
        
        <div className="px-5 mb-6 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase font-bold block mb-1">
              [AUTONOMOUS DIRECTORY]
            </span>
            <h2 className="text-2xl font-black font-[var(--font-orbitron)] tracking-tight text-white uppercase">
              AI OPERATIVES
            </h2>
          </div>
          <span className="text-[9px] font-mono text-white/40 tracking-wider">
            SWIPE &rarr;
          </span>
        </div>

        <div 
          ref={teamScrollRef}
          className="flex overflow-x-auto gap-4 px-5 pb-6 snap-x snap-mandatory hide-scrollbar relative" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TEAM.map((member, idx) => {
            const isActive = idx === activeTeamIndex;
            return (
              <motion.div 
                key={member.id} 
                className={`flex-shrink-0 w-[270px] snap-center flex flex-col p-4 border rounded-2xl transition-all duration-500 backdrop-blur-md
                  ${isActive ? 'bg-[#090c14] border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-black/60 border-white/10'}
                `}
              >
                <div className="w-full aspect-[4/3] overflow-hidden relative rounded-xl border border-white/10 bg-[#050505] mb-3.5">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill 
                    className={`object-cover transition-all duration-700 ${isActive ? 'scale-105' : 'grayscale opacity-60 scale-100'}`} 
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 text-[7.5px] font-mono bg-black/80 border border-white/20 rounded font-bold uppercase text-white">
                    {member.id}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 text-[7.5px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded font-bold uppercase">
                    {member.clearance}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="text-[8.5px] uppercase tracking-widest font-mono font-bold text-cyan-400 mb-1">
                    {member.role}
                  </div>
                  <h4 className="text-base font-bold font-[var(--font-orbitron)] text-white mb-2">
                    {member.name}
                  </h4>
                  <p className="text-[10px] text-white/60 leading-relaxed font-light line-clamp-2 mb-3">
                    {member.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 text-[7.5px] font-mono bg-white/5 border border-white/10 text-white/60 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Scroll dots indicator */}
        <div className="flex justify-center gap-1.5 mt-1">
          {TEAM.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-[2.5px] rounded-full transition-all duration-300 ${idx === activeTeamIndex ? 'w-6 bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'w-1.5 bg-white/20'}`} 
            />
          ))}
        </div>

      </section>

      {/* ═══ 7. FOUNDER & EXECUTIVE DOSSIER ═══ */}
      <section className="w-full px-5 py-12 relative z-10">
        
        <div className="p-6 bg-gradient-to-b from-[#0a0f1a] to-black border border-white/20 rounded-2xl relative overflow-hidden shadow-2xl">
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-[8.5px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
              LEADERSHIP // CHIEF ARCHITECT
            </span>
            <span className="px-2 py-0.5 text-[8px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full font-bold">
              VERIFIED
            </span>
          </div>

          <h3 className="text-2xl font-black font-[var(--font-orbitron)] text-white tracking-wide mb-1">
            RISHABH SHYAM JOSHI
          </h3>
          <p className="text-[10px] font-mono text-cyan-300/90 font-bold tracking-wider uppercase mb-3">
            MECHANICAL ENGINEER · FOUNDER & CEO
          </p>

          <p className="text-[11px] text-white/70 leading-relaxed font-light mb-6">
            Leading the multi-disciplinary engineering of sovereign defense systems, orbital spacecraft telemetry, proprietary neural silicon (RJ-A1), and large-scale software platforms at RJ Industries.
          </p>

          {/* Institutional Stats */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="p-2.5 bg-black/60 border border-white/10 rounded-lg">
              <span className="block text-[7.5px] font-mono text-white/40 uppercase">HEADQUARTERS</span>
              <span className="text-[10px] font-mono font-bold text-white">AMRAVATI, MH, IN</span>
            </div>
            <div className="p-2.5 bg-black/60 border border-white/10 rounded-lg">
              <span className="block text-[7.5px] font-mono text-white/40 uppercase">DISCIPLINE</span>
              <span className="text-[10px] font-mono font-bold text-cyan-300">MECHANICAL ENG.</span>
            </div>
          </div>

          {/* Direct Verification Links */}
          <div className="grid grid-cols-2 gap-2 text-[9px] font-mono font-bold">
            <a 
              href="https://www.linkedin.com/in/rishabhshyamjoshi/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 border border-white/15 rounded-lg text-white hover:bg-white/15 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>LINKEDIN</span>
              <span>↗</span>
            </a>
            <a 
              href="https://www.crunchbase.com/organization/rj-industries-dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 border border-white/15 rounded-lg text-cyan-300 hover:bg-white/15 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>CRUNCHBASE</span>
              <span>↗</span>
            </a>
            <a 
              href="https://x.com/rishabhshyamjoshi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 border border-white/15 rounded-lg text-white hover:bg-white/15 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>X (TWITTER)</span>
              <span>↗</span>
            </a>
            <a 
              href="https://github.com/rishabhshyamjoshi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 border border-white/15 rounded-lg text-white hover:bg-white/15 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>GITHUB</span>
              <span>↗</span>
            </a>
          </div>

        </div>

      </section>

      {/* ═══ 8. TRANSMIT BRIEF / CONTACT SECTION ═══ */}
      <section className="w-full px-5 py-12 text-center relative z-10">
        
        <span className="text-[9px] font-mono text-cyan-400 tracking-[0.25em] uppercase font-bold block mb-2">
          // INITIATE TRANSMISSION
        </span>
        <h2 className="text-3xl font-black font-[var(--font-orbitron)] text-white tracking-tight uppercase mb-3">
          ESTABLISH UPLINK
        </h2>
        <p className="text-xs text-white/60 font-light max-w-xs mx-auto mb-6">
          Reach our engineering team for sovereign defense contracts, aerospace mechanical development, or large-scale web systems.
        </p>

        <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
          <a
            href="mailto:contact@rjindustries.dev"
            className="w-full py-3.5 bg-white text-black font-bold text-[10px] font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all hover:bg-cyan-300"
          >
            <span>TRANSMIT ENCRYPTED BRIEF</span>
            <span>&rarr;</span>
          </a>

          <button
            onClick={handleCopyEmail}
            className="w-full py-3 bg-white/5 border border-white/15 text-white/80 font-mono text-[9.5px] tracking-wider rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <span>{copiedEmail ? "✓ COPIED: contact@rjindustries.dev" : "COPY: contact@rjindustries.dev"}</span>
          </button>
        </div>

      </section>

      {/* ═══ 9. ARMOR-STYLE STICKY BOTTOM ACTION DOCK ═══ */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[420px]">
        <div className="flex items-center justify-between p-1.5 bg-black/85 backdrop-blur-2xl border border-white/20 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
          
          <a 
            href="mailto:contact@rjindustries.dev" 
            className="flex-1 py-2.5 px-3 text-center text-[9.5px] font-mono tracking-wider font-bold text-white/90 bg-white/5 rounded-full hover:bg-white/15 transition-all active:bg-white/20 flex items-center justify-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>CONTACT</span>
          </a>

          <div className="w-[1px] h-4 bg-white/15 mx-1" />

          <Link 
            href="/academy" 
            className="flex-1 py-2.5 px-3 text-center text-[9.5px] font-mono tracking-wider font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-full hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-1"
          >
            <span>◎ ACADEMY</span>
          </Link>

          <div className="w-[1px] h-4 bg-white/15 mx-1" />

          <button 
            onClick={handleAudioToggle}
            className="flex-1 py-2.5 px-3 text-center text-[9px] font-mono tracking-wider font-bold text-white/70 rounded-full hover:text-white transition-all flex items-center justify-center gap-1"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${audioMuted ? 'bg-white/20' : 'bg-emerald-400 animate-pulse'}`} />
            <span>{audioMuted ? "SOUND" : "MUTE"}</span>
          </button>

        </div>
      </div>

    </div>
  );
}
