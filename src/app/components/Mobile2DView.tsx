"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, ProjectData } from "../data/projects";
import { AudioController } from "../utils/AudioController";

export default function Mobile2DView() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [audioMuted, setAudioMuted] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [expandedSpecId, setExpandedSpecId] = useState<number | null>(null);

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
    } catch (e) {}
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@rjindustries.dev");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const categories = ["ALL", "HARDWARE", "SOFTWARE", "DEFENSE & 3D"];

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "HARDWARE") return p.id === 1;
    if (activeCategory === "SOFTWARE") return p.id === 2 || p.id === 4 || p.id === 7;
    if (activeCategory === "DEFENSE & 3D") return p.id === 3 || p.id === 5 || p.id === 6;
    return true;
  });

  return (
    <div className="bg-[#08080a] text-white min-h-screen w-full font-sans antialiased overflow-x-hidden selection:bg-cyan-500/30 pb-36 pt-4">
      
      {/* ═══════════════════════════════════════════════════
          1. FLOATING TOP HEADER BAR (Armor V32 Style)
         ═══════════════════════════════════════════════════ */}
      <div className="sticky top-3 z-50 w-[92%] max-w-[440px] mx-auto">
        <header className="w-full bg-[#111218]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          
          {/* Logo & Brand Tag */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-6 h-6">
              <Image src="/logo.png" alt="RJ Industries" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-[0.18em] uppercase font-[var(--font-orbitron)] text-white">
                RJ INDUSTRIES
              </span>
              <span className="text-[7.5px] font-mono tracking-widest text-emerald-400 font-bold -mt-0.5">
                ● VERIFIED ENTITY
              </span>
            </div>
          </Link>

          {/* Quick Pill & Burger Menu */}
          <div className="flex items-center gap-2">
            <a
              href="#arsenal"
              className="px-2.5 py-1 text-[9px] font-mono font-medium tracking-wider text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-full"
            >
              [ arsenal ]
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-1 bg-white/5 border border-white/10 rounded-xl active:bg-white/15 transition-colors"
              aria-label="Toggle Menu"
            >
              <span className={`w-3.5 h-[1.5px] bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-[2.5px]' : ''}`} />
              <span className={`w-3.5 h-[1.5px] bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-[2.5px]' : ''}`} />
            </button>
          </div>
        </header>

        {/* Slide-out Menu Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="mt-2 w-full bg-[#111218] border border-white/15 rounded-2xl p-5 shadow-2xl flex flex-col gap-3"
            >
              <div className="flex flex-col gap-2 font-[var(--font-orbitron)] text-xs tracking-wider">
                <a href="#hero" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-1">
                  [ 01 · OVERVIEW ]
                </a>
                <a href="#flagship" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-1">
                  [ 02 · FLAGSHIP HARDWARE ]
                </a>
                <a href="#divisions" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-1">
                  [ 03 · STRATEGIC DIVISIONS ]
                </a>
                <a href="#arsenal" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-1">
                  [ 04 · ACTIVE ARSENAL ({PROJECTS.length}) ]
                </a>
                <a href="#manifesto" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-1">
                  [ 05 · MANIFESTO ]
                </a>
                <a href="#founder" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-1">
                  [ 06 · FOUNDER DOSSIER ]
                </a>
                <Link href="/academy" className="text-cyan-400 py-1 font-bold">
                  [ 07 · 360° ACADEMY &rarr; ]
                </Link>
              </div>

              <div className="h-[1px] bg-white/10 my-1" />

              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-white/60">
                <a href="https://www.crunchbase.com/organization/rj-industries-dev" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg border border-white/10 text-center hover:text-white">
                  CRUNCHBASE ↗
                </a>
                <a href="https://www.linkedin.com/company/rj-industries01/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-lg border border-white/10 text-center hover:text-white">
                  LINKEDIN ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════
          2. HERO SECTION (Armor "refuse the default" Style)
         ═══════════════════════════════════════════════════ */}
      <section id="hero" className="w-[92%] max-w-[440px] mx-auto pt-8 pb-6">
        
        {/* Subtitle / Tagline (Armor Style) */}
        <p className="text-[11px] font-mono tracking-wider text-white/50 uppercase mb-1">
          A new-age deep-tech engineering conglomerate
        </p>
        <p className="text-xs text-white/90 font-medium mb-6">
          built for builders, engineers, and the curious.
        </p>

        {/* Big Bold Lowercase Punchy Headline */}
        <h1 className="text-[42px] leading-[1.05] font-black tracking-tight uppercase font-[var(--font-orbitron)] text-white mb-6">
          refuse<br />
          the<br />
          <span className="line-through decoration-cyan-400 decoration-[4px] text-white/35">default</span>
        </h1>

        {/* Credentials Ticker Bar */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-[#111218] border border-white/10 rounded-2xl text-center">
          <div>
            <div className="text-[8px] font-mono text-white/40 uppercase">ROUND</div>
            <div className="text-[10px] font-mono font-bold text-cyan-300">$100K PRE-SEED</div>
          </div>
          <div className="border-x border-white/10 px-1">
            <div className="text-[8px] font-mono text-white/40 uppercase">DEPLOYMENTS</div>
            <div className="text-[10px] font-mono font-bold text-white">07 ARSENAL</div>
          </div>
          <div>
            <div className="text-[8px] font-mono text-white/40 uppercase">ENGINEERING</div>
            <div className="text-[10px] font-mono font-bold text-emerald-400">MECH LEAD</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. BILLBOARD FLAGSHIP CARD (Armor Billboard Style)
         ═══════════════════════════════════════════════════ */}
      <section id="flagship" className="w-[92%] max-w-[440px] mx-auto mb-8">
        <div className="w-full bg-[#0d0e14] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          
          {/* Card Label */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-cyan-300">
              [ current arsenal ]
            </span>
            <span className="text-[9px] font-mono text-white/40 uppercase">
              VERSION H1 · 2026
            </span>
          </div>

          {/* Title with Underlined Highlight */}
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2 leading-snug font-[var(--font-orbitron)]">
            we <span className="underline decoration-cyan-400 decoration-2 underline-offset-4">broke the boundary</span>
          </h2>

          <p className="text-xs text-white/70 leading-relaxed mb-6 font-light">
            spatial computing neural hardware we obsessed over more than we should have. private, 100% air-gapped, sovereign. now deployed.
          </p>

          {/* Hardware Render */}
          <div className="relative w-full aspect-[16/10] mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.12)_0%,transparent_70%)]" />
            <Image
              src="/rj-glasses.png"
              alt="K.I.N.E.T.I.C Glasses"
              fill
              className="object-contain filter drop-shadow-[0_15px_30px_rgba(0,240,255,0.25)]"
              priority
            />
          </div>

          {/* 4-Spec Chips */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
              <span className="block text-[7.5px] font-mono text-white/40 uppercase">SILICON</span>
              <span className="text-[10px] font-mono font-bold text-cyan-300">RJ-A1 NEURAL CORE</span>
            </div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
              <span className="block text-[7.5px] font-mono text-white/40 uppercase">SECURITY</span>
              <span className="text-[10px] font-mono font-bold text-white">100% AIR-GAPPED</span>
            </div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
              <span className="block text-[7.5px] font-mono text-white/40 uppercase">OPTICS</span>
              <span className="text-[10px] font-mono font-bold text-white">DUAL MICRO-OLED</span>
            </div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
              <span className="block text-[7.5px] font-mono text-white/40 uppercase">CHASSIS</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400">GRADE 5 TITANIUM</span>
            </div>
          </div>

          {/* Armor CTA Button */}
          <Link
            href="/project/1"
            className="w-full block py-3.5 px-4 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider rounded-xl text-center active:scale-[0.98] transition-transform"
          >
            Check out K.I.N.E.T.I.C™ Vision &rarr;
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. STRATEGIC DIVISIONS (Armor Tech Bento)
         ═══════════════════════════════════════════════════ */}
      <section id="divisions" className="w-[92%] max-w-[440px] mx-auto mb-8">
        
        {/* Section Header */}
        <div className="mb-4">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-white/50 block mb-1">
            [ strategic divisions ]
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white font-[var(--font-orbitron)]">
            deep engineering <span className="underline decoration-cyan-400 decoration-2 underline-offset-4">across four frontiers</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-4 bg-[#0d0e14] border border-white/10 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-base mb-1 block">🚀</span>
              <h3 className="text-xs font-bold font-[var(--font-orbitron)] text-white mb-1 uppercase">AEROSPACE</h3>
              <p className="text-[10px] text-white/60 leading-relaxed">Orbital mechanics, spacecraft launch architecture &amp; atmospheric telemetry.</p>
            </div>
            <span className="text-[8px] font-mono text-cyan-300 mt-3 block">[ ACTIVE ]</span>
          </div>

          <div className="p-4 bg-[#0d0e14] border border-white/10 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-base mb-1 block">🛡️</span>
              <h3 className="text-xs font-bold font-[var(--font-orbitron)] text-white mb-1 uppercase">DEFENSE</h3>
              <p className="text-[10px] text-white/60 leading-relaxed">Sovereign defense hardware, quantum cryptography &amp; secure data arrays.</p>
            </div>
            <span className="text-[8px] font-mono text-cyan-300 mt-3 block">[ PROTOCOL ]</span>
          </div>

          <div className="p-4 bg-[#0d0e14] border border-white/10 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-base mb-1 block">⚙️</span>
              <h3 className="text-xs font-bold font-[var(--font-orbitron)] text-white mb-1 uppercase">MECHANICAL</h3>
              <p className="text-[10px] text-white/60 leading-relaxed">Structural finite element analysis, precision manufacturing &amp; robotics.</p>
            </div>
            <span className="text-[8px] font-mono text-emerald-400 mt-3 block">[ CORE DISCIPLINE ]</span>
          </div>

          <div className="p-4 bg-[#0d0e14] border border-white/10 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-base mb-1 block">💻</span>
              <h3 className="text-xs font-bold font-[var(--font-orbitron)] text-white mb-1 uppercase">SOFTWARE</h3>
              <p className="text-[10px] text-white/60 leading-relaxed">Large-scale enterprise platforms, 3D WebGL graphics &amp; real-time web.</p>
            </div>
            <span className="text-[8px] font-mono text-cyan-300 mt-3 block">[ PRODUCTION ]</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. THE ACTIVE ARSENAL (Armor Product Cards)
         ═══════════════════════════════════════════════════ */}
      <section id="arsenal" className="w-[92%] max-w-[440px] mx-auto mb-8">
        
        {/* Section Header */}
        <div className="mb-4">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-cyan-300 block mb-1">
            [ the arsenal ]
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white font-[var(--font-orbitron)]">
            active <span className="underline decoration-cyan-400 decoration-2 underline-offset-4">deployments</span>
          </h2>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[9px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-white text-black font-bold shadow-md"
                  : "bg-white/5 text-white/60 border border-white/10 hover:border-white/20"
              }`}
            >
              [ {cat.toLowerCase()} ]
            </button>
          ))}
        </div>

        {/* Product Cards List */}
        <div className="flex flex-col gap-5">
          {filteredProjects.map((project) => {
            const isExpanded = expandedSpecId === project.id;
            const targetLink = project.externalLink || project.link;
            const isExternal = !!project.externalLink;

            return (
              <div
                key={project.id}
                className="w-full bg-[#0d0e14] border border-white/10 rounded-3xl overflow-hidden shadow-lg flex flex-col"
              >
                {/* Product Image Frame */}
                <div className="relative w-full aspect-[16/10] bg-black/60 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e14] via-transparent to-transparent opacity-80" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[8.5px] font-mono text-cyan-300">
                    [ 0{project.id} · ARSENAL ]
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[8px] font-mono text-emerald-400 font-bold">
                    ● ACTIVE
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold font-[var(--font-orbitron)] text-white tracking-wide uppercase mb-1">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-cyan-300/80 font-mono mb-2">
                      {project.shortDesc}
                    </p>
                    <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
                      {project.longDesc}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8.5px] font-mono text-white/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Spec Sheet Accordion */}
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => setExpandedSpecId(isExpanded ? null : project.id)}
                      className="w-full flex items-center justify-between text-[9px] font-mono text-white/50 hover:text-white py-1.5"
                    >
                      <span>{isExpanded ? "[-] HIDE SPEC SHEET" : "[+] VIEW SPEC SHEET"}</span>
                      <span className="text-xs">{isExpanded ? "▲" : "▼"}</span>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-black/40 border border-white/10 rounded-xl p-3 my-2 text-[9px] font-mono space-y-1.5"
                        >
                          <div className="flex justify-between">
                            <span className="text-white/40">SYSTEM ID:</span>
                            <span className="text-cyan-300">RJ-SYS-00{project.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">ARCHITECTURE:</span>
                            <span className="text-white">{project.techStack.slice(0, 2).join(" + ")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">TIER:</span>
                            <span className="text-emerald-400">PRODUCTION DEPLOYED</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Button */}
                    <a
                      href={targetLink}
                      target={isExternal ? "_blank" : "_self"}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="mt-3 w-full block py-2.5 px-4 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-[10.5px] font-bold uppercase tracking-wider rounded-xl text-center border border-white/15 transition-all"
                    >
                      {isExternal ? "Launch Deployment ↗" : "Explore System &rarr;"}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. MANIFESTO (Armor "armor is where..." Style)
         ═══════════════════════════════════════════════════ */}
      <section id="manifesto" className="w-[92%] max-w-[440px] mx-auto mb-8">
        <div className="w-full bg-[#0d0e14] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
          
          <span className="text-[10px] font-mono font-semibold tracking-wider text-white/50 block mb-2">
            [ the manifesto ]
          </span>

          <h2 className="text-xl font-bold tracking-tight text-white mb-4 leading-snug font-[var(--font-orbitron)]">
            rj industries is where <span className="underline decoration-cyan-400 decoration-2 underline-offset-4">engineering obsession meets sovereign tech.</span>
          </h2>

          <p className="text-xs text-white/70 leading-relaxed font-light mb-3">
            We build expressive, sovereign technologies that make everyday hardware, aerospace structures, and large-scale software systems feel unified, fast, and unapologetic.
          </p>

          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            We are not trying to build generic clones. We are here to engineer what was considered impossible.
          </p>

          <a
            href="https://rjindustries.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-2.5 px-5 bg-white text-black font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl active:scale-[0.98] transition-transform"
          >
            Know more &rarr;
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. FOUNDER DOSSIER (Armor "want to know more?" Style)
         ═══════════════════════════════════════════════════ */}
      <section id="founder" className="w-[92%] max-w-[440px] mx-auto mb-8">
        <div className="w-full bg-[#0d0e14] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          
          {/* Label */}
          <span className="text-[10px] font-mono font-semibold tracking-wider text-cyan-300 block mb-2">
            [ want to know more? ]
          </span>

          <h2 className="text-xl font-bold tracking-tight text-white mb-2 leading-snug font-[var(--font-orbitron)]">
            meet the <span className="underline decoration-cyan-400 decoration-2 underline-offset-4">founder</span>
          </h2>

          <div className="mb-4">
            <h3 className="text-base font-black uppercase text-white font-[var(--font-orbitron)]">
              RISHABH SHYAM JOSHI
            </h3>
            <p className="text-[10.5px] font-mono text-cyan-300">
              Mechanical Engineer · Founder &amp; CEO
            </p>
          </div>

          <p className="text-xs text-white/70 font-light leading-relaxed mb-6">
            Pioneering multi-disciplinary engineering systems spanning physical mechanics, tactical defense technology, and large-scale autonomous software platforms. Headquartered in Maharashtra, India.
          </p>

          {/* Social / Dossier Links Grid (Armor Pill Style) */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <a
              href="https://www.crunchbase.com/organization/rj-industries-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-[9px] font-mono text-white/80 hover:text-white hover:border-cyan-400 transition-colors"
            >
              <span>CRUNCHBASE</span>
              <span className="text-cyan-300">↗</span>
            </a>

            <a
              href="https://www.linkedin.com/in/rishabhshyamjoshi/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-[9px] font-mono text-white/80 hover:text-white hover:border-cyan-400 transition-colors"
            >
              <span>LINKEDIN</span>
              <span className="text-cyan-300">↗</span>
            </a>

            <a
              href="https://x.com/rishabhshyamjoshi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-[9px] font-mono text-white/80 hover:text-white hover:border-cyan-400 transition-colors"
            >
              <span>TWITTER / X</span>
              <span className="text-cyan-300">↗</span>
            </a>

            <a
              href="https://github.com/rishabhshyamjoshi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-[9px] font-mono text-white/80 hover:text-white hover:border-cyan-400 transition-colors"
            >
              <span>GITHUB</span>
              <span className="text-cyan-300">↗</span>
            </a>
          </div>

          {/* Contact Direct Action */}
          <button
            onClick={handleCopyEmail}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl font-mono text-[10px] text-white/90 flex items-center justify-center gap-2 transition-colors"
          >
            <span>✉ contact@rjindustries.dev</span>
            <span className="text-cyan-300 font-bold">{copiedEmail ? "✓ COPIED" : "[ COPY ]"}</span>
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. ARMOR MINIMAL FOOTER
         ═══════════════════════════════════════════════════ */}
      <footer className="w-[92%] max-w-[440px] mx-auto pt-6 pb-12 border-t border-white/10 text-center flex flex-col items-center gap-4">
        
        <div className="flex items-center gap-2">
          <div className="relative w-5 h-5">
            <Image src="/logo.png" alt="RJ Industries" fill className="object-contain" />
          </div>
          <span className="text-xs font-black tracking-widest uppercase font-[var(--font-orbitron)] text-white">
            RJ INDUSTRIES DEV
          </span>
        </div>

        <p className="text-[10px] text-white/40 font-mono max-w-xs leading-relaxed">
          Aerospace engineering, sovereign defense systems, and cognitive neural hardware conglomerate.
        </p>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[9px] font-mono text-white/60">
          <a href="#hero" className="hover:text-white">[ OVERVIEW ]</a>
          <a href="#flagship" className="hover:text-white">[ HARDWARE ]</a>
          <a href="#divisions" className="hover:text-white">[ DIVISIONS ]</a>
          <a href="#arsenal" className="hover:text-white">[ ARSENAL ]</a>
          <a href="#founder" className="hover:text-white">[ FOUNDER ]</a>
          <Link href="/academy" className="text-cyan-400 hover:underline">[ 360° TOUR ]</Link>
        </div>

        <div className="text-[8px] font-mono text-white/30 tracking-widest mt-2">
          © 2026 RJ INDUSTRIES DEV · ALL RIGHTS RESERVED
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════
          9. STICKY FLOATING QUICK DOCK (Bottom Bar)
         ═══════════════════════════════════════════════════ */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[400px]">
        <div className="bg-[#111218]/95 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
          
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider text-white hover:text-cyan-300"
          >
            <span>✉</span>
            <span>{copiedEmail ? "COPIED" : "CONTACT"}</span>
          </button>

          <div className="h-4 w-[1px] bg-white/15" />

          <Link
            href="/academy"
            className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider text-cyan-300 hover:text-white"
          >
            <span>◎</span>
            <span>360° TOUR</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/15" />

          <button
            onClick={handleAudioToggle}
            className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider text-white/80 hover:text-white"
          >
            <span>{audioMuted ? "🔇" : "🔊"}</span>
            <span>{audioMuted ? "SOUND OFF" : "SOUND ON"}</span>
          </button>

        </div>
      </div>

    </div>
  );
}
