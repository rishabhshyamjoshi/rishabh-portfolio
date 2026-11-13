"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "../data/projects";
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
    <div className="bg-[#f5f5f7] text-[#111111] min-h-screen w-full font-[var(--font-manrope)] antialiased overflow-x-hidden selection:bg-[#FC832C]/20 selection:text-black pb-36 pt-4">
      
      {/* ═══════════════════════════════════════════════════
          1. FLOATING TOP HEADER BAR (Armor V32 Style)
         ═══════════════════════════════════════════════════ */}
      <div className="sticky top-3 z-50 w-[92%] max-w-[440px] mx-auto">
        <header className="w-full bg-white/90 backdrop-blur-xl border border-[#e5e5e7] rounded-2xl px-4 py-3 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          
          {/* Logo & Brand Tag */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-6 h-6">
              <Image src="/logo.png" alt="RJ Industries" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-[0.16em] uppercase font-[var(--font-poppins)] text-black">
                RJ INDUSTRIES
              </span>
              <span className="text-[7.5px] font-mono tracking-widest text-[#FC832C] font-bold -mt-0.5">
                ● VERIFIED ENTITY
              </span>
            </div>
          </Link>

          {/* Quick Pill & Burger Menu */}
          <div className="flex items-center gap-2">
            <a
              href="#arsenal"
              className="px-2.5 py-1 text-[9px] font-mono font-medium tracking-wider text-black/70 hover:text-black bg-[#f0f0f2] border border-[#e0e0e3] rounded-full"
            >
              [ arsenal ]
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-1 bg-[#f0f0f2] border border-[#e0e0e3] rounded-xl active:bg-[#e4e4e7] transition-colors"
              aria-label="Toggle Menu"
            >
              <span className={`w-3.5 h-[1.5px] bg-black transition-transform ${menuOpen ? 'rotate-45 translate-y-[2.5px]' : ''}`} />
              <span className={`w-3.5 h-[1.5px] bg-black transition-transform ${menuOpen ? '-rotate-45 -translate-y-[2.5px]' : ''}`} />
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
              className="mt-2 w-full bg-white border border-[#e5e5e7] rounded-2xl p-5 shadow-2xl flex flex-col gap-3 text-black"
            >
              <div className="flex flex-col gap-2 font-[var(--font-poppins)] text-xs tracking-wider">
                <a href="#hero" onClick={() => setMenuOpen(false)} className="text-black/80 hover:text-[#FC832C] py-1">
                  [ 01 · OVERVIEW ]
                </a>
                <a href="#flagship" onClick={() => setMenuOpen(false)} className="text-black/80 hover:text-[#FC832C] py-1">
                  [ 02 · FLAGSHIP HARDWARE ]
                </a>
                <a href="#divisions" onClick={() => setMenuOpen(false)} className="text-black/80 hover:text-[#FC832C] py-1">
                  [ 03 · STRATEGIC DIVISIONS ]
                </a>
                <a href="#arsenal" onClick={() => setMenuOpen(false)} className="text-black/80 hover:text-[#FC832C] py-1">
                  [ 04 · ACTIVE ARSENAL ({PROJECTS.length}) ]
                </a>
                <a href="#manifesto" onClick={() => setMenuOpen(false)} className="text-black/80 hover:text-[#FC832C] py-1">
                  [ 05 · MANIFESTO ]
                </a>
                <a href="#founder" onClick={() => setMenuOpen(false)} className="text-black/80 hover:text-[#FC832C] py-1">
                  [ 06 · FOUNDER DOSSIER ]
                </a>
                <Link href="/academy" className="text-[#FC832C] py-1 font-bold">
                  [ 07 · 360° ACADEMY &rarr; ]
                </Link>
              </div>

              <div className="h-[1px] bg-[#e5e5e7] my-1" />

              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-black/70">
                <a href="https://www.crunchbase.com/organization/rj-industries-dev" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#f8f8fa] rounded-lg border border-[#e0e0e3] text-center hover:text-black">
                  CRUNCHBASE ↗
                </a>
                <a href="https://www.linkedin.com/company/rj-industries01/" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#f8f8fa] rounded-lg border border-[#e0e0e3] text-center hover:text-black">
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
        
        {/* Subtitle / Tagline with Armor Orange Tape */}
        <p className="text-[11px] font-mono tracking-wider text-black/60 uppercase mb-1">
          A new-age deep-tech engineering conglomerate
        </p>
        <p className="text-xs text-black font-medium mb-6">
          <span className="bg-[#FC832C] text-white px-2 py-0.5 rounded-sm font-medium">
            built for builders, engineers, and the curious.
          </span>
        </p>

        {/* Big Bold Headline in Pure Armor Style */}
        <h1 className="text-[52px] leading-[0.96] font-extrabold tracking-[-0.04em] lowercase font-[var(--font-poppins)] text-black mb-6">
          refuse<br />
          the<br />
          <span className="line-through decoration-[#FC832C] decoration-[5px] text-black/30">default</span>
        </h1>

        {/* Credentials Ticker Bar */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-white border border-[#e5e5e7] rounded-2xl text-center shadow-sm">
          <div>
            <div className="text-[8px] font-mono text-black/40 uppercase">ROUND</div>
            <div className="text-[10px] font-mono font-bold text-[#FC832C]">$100K PRE-SEED</div>
          </div>
          <div className="border-x border-[#e5e5e7] px-1">
            <div className="text-[8px] font-mono text-black/40 uppercase">DEPLOYMENTS</div>
            <div className="text-[10px] font-mono font-bold text-black">07 ARSENAL</div>
          </div>
          <div>
            <div className="text-[8px] font-mono text-black/40 uppercase">ENGINEERING</div>
            <div className="text-[10px] font-mono font-bold text-[#108474]">MECH LEAD</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. BILLBOARD FLAGSHIP CARD (Armor Billboard Style)
         ═══════════════════════════════════════════════════ */}
      <section id="flagship" className="w-[92%] max-w-[440px] mx-auto mb-8">
        <div className="w-full bg-white border border-[#e5e5e7] rounded-3xl p-6 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          
          {/* Card Label */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-semibold tracking-wider text-[#FC832C]">
              [ current arsenal ]
            </span>
            <span className="text-[9px] font-mono text-black/40 uppercase">
              VERSION H1 · 2026
            </span>
          </div>

          {/* Title with Underlined Highlight */}
          <h2 className="text-2xl font-bold tracking-tight text-black mb-2 leading-snug font-[var(--font-poppins)]">
            we <span className="underline decoration-[#FC832C] decoration-3 underline-offset-4">broke the boundary</span>
          </h2>

          <p className="text-xs text-[#555555] leading-relaxed mb-6 font-normal">
            spatial computing neural hardware we obsessed over more than we should have. private, 100% air-gapped, sovereign. now deployed.
          </p>

          {/* Hardware Render Container */}
          <div className="relative w-full aspect-[16/10] mb-6 bg-[#f7f7f9] border border-[#eaeaed] rounded-2xl flex items-center justify-center p-3">
            <Image
              src="/rj-glasses.png"
              alt="K.I.N.E.T.I.C Glasses"
              fill
              className="object-contain p-2 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)]"
              priority
            />
          </div>

          {/* 4-Spec Chips */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="p-3 bg-[#f8f8fa] border border-[#e5e5e7] rounded-xl">
              <span className="block text-[7.5px] font-mono text-black/40 uppercase">SILICON</span>
              <span className="text-[10px] font-mono font-bold text-[#FC832C]">RJ-A1 NEURAL CORE</span>
            </div>
            <div className="p-3 bg-[#f8f8fa] border border-[#e5e5e7] rounded-xl">
              <span className="block text-[7.5px] font-mono text-black/40 uppercase">SECURITY</span>
              <span className="text-[10px] font-mono font-bold text-black">100% AIR-GAPPED</span>
            </div>
            <div className="p-3 bg-[#f8f8fa] border border-[#e5e5e7] rounded-xl">
              <span className="block text-[7.5px] font-mono text-black/40 uppercase">OPTICS</span>
              <span className="text-[10px] font-mono font-bold text-black">DUAL MICRO-OLED</span>
            </div>
            <div className="p-3 bg-[#f8f8fa] border border-[#e5e5e7] rounded-xl">
              <span className="block text-[7.5px] font-mono text-black/40 uppercase">CHASSIS</span>
              <span className="text-[10px] font-mono font-bold text-black">GRADE 5 TITANIUM</span>
            </div>
          </div>

          {/* Armor Stark Black CTA Button */}
          <Link
            href="/project/1"
            className="w-full block py-3.5 px-4 bg-black hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl text-center active:scale-[0.98] transition-transform shadow-md"
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
          <span className="text-[10px] font-mono font-semibold tracking-wider text-black/50 block mb-1">
            [ strategic divisions ]
          </span>
          <h2 className="text-xl font-bold tracking-tight text-black font-[var(--font-poppins)]">
            deep engineering <span className="underline decoration-[#FC832C] decoration-3 underline-offset-4">across four frontiers</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-4 bg-white border border-[#e5e5e7] rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-base mb-1 block">🚀</span>
              <h3 className="text-xs font-bold font-[var(--font-poppins)] text-black mb-1 uppercase">AEROSPACE</h3>
              <p className="text-[10px] text-[#666666] leading-relaxed">Orbital mechanics, spacecraft launch architecture &amp; telemetry.</p>
            </div>
            <span className="text-[8px] font-mono text-[#FC832C] font-bold mt-3 block">[ ACTIVE ]</span>
          </div>

          <div className="p-4 bg-white border border-[#e5e5e7] rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-base mb-1 block">🛡️</span>
              <h3 className="text-xs font-bold font-[var(--font-poppins)] text-black mb-1 uppercase">DEFENSE</h3>
              <p className="text-[10px] text-[#666666] leading-relaxed">Sovereign defense hardware, quantum cryptography &amp; data arrays.</p>
            </div>
            <span className="text-[8px] font-mono text-black/60 font-bold mt-3 block">[ PROTOCOL ]</span>
          </div>

          <div className="p-4 bg-white border border-[#e5e5e7] rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-base mb-1 block">⚙️</span>
              <h3 className="text-xs font-bold font-[var(--font-poppins)] text-black mb-1 uppercase">MECHANICAL</h3>
              <p className="text-[10px] text-[#666666] leading-relaxed">Structural FEA analysis, precision manufacturing &amp; robotics.</p>
            </div>
            <span className="text-[8px] font-mono text-[#FC832C] font-bold mt-3 block">[ CORE DISCIPLINE ]</span>
          </div>

          <div className="p-4 bg-white border border-[#e5e5e7] rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-base mb-1 block">💻</span>
              <h3 className="text-xs font-bold font-[var(--font-poppins)] text-black mb-1 uppercase">SOFTWARE</h3>
              <p className="text-[10px] text-[#666666] leading-relaxed">Large-scale enterprise platforms, 3D WebGL graphics &amp; real-time web.</p>
            </div>
            <span className="text-[8px] font-mono text-black/60 font-bold mt-3 block">[ PRODUCTION ]</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. THE ACTIVE ARSENAL (Armor Product Cards)
         ═══════════════════════════════════════════════════ */}
      <section id="arsenal" className="w-[92%] max-w-[440px] mx-auto mb-8">
        
        {/* Section Header */}
        <div className="mb-4">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#FC832C] block mb-1">
            [ the arsenal ]
          </span>
          <h2 className="text-xl font-bold tracking-tight text-black font-[var(--font-poppins)]">
            active <span className="underline decoration-[#FC832C] decoration-3 underline-offset-4">deployments</span>
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
                  ? "bg-black text-white font-bold shadow-md"
                  : "bg-white text-black/70 border border-[#e0e0e3] hover:border-black"
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
                className="w-full bg-white border border-[#e5e5e7] rounded-3xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.06)] flex flex-col"
              >
                {/* Product Image Frame */}
                <div className="relative w-full aspect-[16/10] bg-[#f0f0f3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-[#e0e0e3] text-[8.5px] font-mono font-bold text-[#FC832C]">
                    [ 0{project.id} · ARSENAL ]
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-[#e0e0e3] text-[8px] font-mono text-black font-bold">
                    ● ACTIVE
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold font-[var(--font-poppins)] text-black tracking-wide uppercase mb-1">
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-[#FC832C] font-mono font-medium mb-2">
                      {project.shortDesc}
                    </p>
                    <p className="text-xs text-[#555555] font-normal leading-relaxed mb-4">
                      {project.longDesc}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#f4f4f6] border border-[#e5e5e7] text-[8.5px] font-mono text-black/80 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Spec Sheet Accordion */}
                  <div className="pt-2 border-t border-[#e5e5e7]">
                    <button
                      onClick={() => setExpandedSpecId(isExpanded ? null : project.id)}
                      className="w-full flex items-center justify-between text-[9px] font-mono text-black/60 hover:text-black py-1.5"
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
                          className="bg-[#f8f8fa] border border-[#e5e5e7] rounded-xl p-3 my-2 text-[9px] font-mono space-y-1.5"
                        >
                          <div className="flex justify-between">
                            <span className="text-black/50">SYSTEM ID:</span>
                            <span className="text-[#FC832C] font-bold">RJ-SYS-00{project.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-black/50">ARCHITECTURE:</span>
                            <span className="text-black font-medium">{project.techStack.slice(0, 2).join(" + ")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-black/50">STATUS:</span>
                            <span className="text-[#108474] font-bold">PRODUCTION DEPLOYED</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Button */}
                    <a
                      href={targetLink}
                      target={isExternal ? "_blank" : "_self"}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="mt-3 w-full block py-2.5 px-4 bg-black hover:bg-neutral-800 text-white font-mono text-[10.5px] font-bold uppercase tracking-wider rounded-xl text-center transition-all shadow-sm"
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
        <div className="w-full bg-white border border-[#e5e5e7] rounded-3xl p-6 relative overflow-hidden shadow-sm">
          
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#FC832C] block mb-2">
            [ the manifesto ]
          </span>

          <h2 className="text-xl font-bold tracking-tight text-black mb-4 leading-snug font-[var(--font-poppins)]">
            rj industries is where <span className="underline decoration-[#FC832C] decoration-3 underline-offset-4">engineering obsession meets sovereign tech.</span>
          </h2>

          <p className="text-xs text-[#555555] leading-relaxed font-normal mb-3">
            We build expressive, sovereign technologies that make everyday hardware, aerospace structures, and large-scale software systems feel unified, fast, and unapologetic.
          </p>

          <p className="text-xs text-[#555555] leading-relaxed font-normal mb-6">
            We are not trying to build generic clones. We are here to engineer what was considered impossible.
          </p>

          <a
            href="https://rjindustries.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-2.5 px-5 bg-black hover:bg-neutral-800 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl active:scale-[0.98] transition-transform shadow-md"
          >
            Know more &rarr;
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. FOUNDER DOSSIER (Armor "want to know more?" Style)
         ═══════════════════════════════════════════════════ */}
      <section id="founder" className="w-[92%] max-w-[440px] mx-auto mb-8">
        <div className="w-full bg-white border border-[#e5e5e7] rounded-3xl p-6 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          
          {/* Label */}
          <span className="text-[10px] font-mono font-semibold tracking-wider text-[#FC832C] block mb-2">
            [ want to know more? ]
          </span>

          <h2 className="text-xl font-bold tracking-tight text-black mb-2 leading-snug font-[var(--font-poppins)]">
            meet the <span className="underline decoration-[#FC832C] decoration-3 underline-offset-4">founder</span>
          </h2>

          <div className="mb-4">
            <h3 className="text-base font-black uppercase text-black font-[var(--font-poppins)]">
              RISHABH SHYAM JOSHI
            </h3>
            <p className="text-[10.5px] font-mono text-[#FC832C] font-semibold">
              Mechanical Engineer · Founder &amp; CEO
            </p>
          </div>

          <p className="text-xs text-[#555555] font-normal leading-relaxed mb-6">
            Pioneering multi-disciplinary engineering systems spanning physical mechanics, tactical defense technology, and large-scale autonomous software platforms. Headquartered in Maharashtra, India.
          </p>

          {/* Social / Dossier Links Grid (Armor Pill Style) */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <a
              href="https://www.crunchbase.com/organization/rj-industries-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#f8f8fa] border border-[#e5e5e7] rounded-xl flex items-center justify-between text-[9px] font-mono text-black/80 hover:text-black hover:border-[#FC832C] transition-colors"
            >
              <span>CRUNCHBASE</span>
              <span className="text-[#FC832C] font-bold">↗</span>
            </a>

            <a
              href="https://www.linkedin.com/in/rishabhshyamjoshi/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#f8f8fa] border border-[#e5e5e7] rounded-xl flex items-center justify-between text-[9px] font-mono text-black/80 hover:text-black hover:border-[#FC832C] transition-colors"
            >
              <span>LINKEDIN</span>
              <span className="text-[#FC832C] font-bold">↗</span>
            </a>

            <a
              href="https://x.com/rishabhshyamjoshi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#f8f8fa] border border-[#e5e5e7] rounded-xl flex items-center justify-between text-[9px] font-mono text-black/80 hover:text-black hover:border-[#FC832C] transition-colors"
            >
              <span>TWITTER / X</span>
              <span className="text-[#FC832C] font-bold">↗</span>
            </a>

            <a
              href="https://github.com/rishabhshyamjoshi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#f8f8fa] border border-[#e5e5e7] rounded-xl flex items-center justify-between text-[9px] font-mono text-black/80 hover:text-black hover:border-[#FC832C] transition-colors"
            >
              <span>GITHUB</span>
              <span className="text-[#FC832C] font-bold">↗</span>
            </a>
          </div>

          {/* Contact Direct Action */}
          <button
            onClick={handleCopyEmail}
            className="w-full py-3 px-4 bg-black hover:bg-neutral-800 text-white rounded-xl font-mono text-[10px] font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <span>✉ contact@rjindustries.dev</span>
            <span className="text-[#FC832C] font-bold">{copiedEmail ? "✓ COPIED" : "[ COPY ]"}</span>
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. ARMOR MINIMAL FOOTER
         ═══════════════════════════════════════════════════ */}
      <footer className="w-[92%] max-w-[440px] mx-auto pt-6 pb-12 border-t border-[#e5e5e7] text-center flex flex-col items-center gap-4">
        
        <div className="flex items-center gap-2">
          <div className="relative w-5 h-5">
            <Image src="/logo.png" alt="RJ Industries" fill className="object-contain" />
          </div>
          <span className="text-xs font-black tracking-widest uppercase font-[var(--font-poppins)] text-black">
            RJ INDUSTRIES DEV
          </span>
        </div>

        <p className="text-[10px] text-black/50 font-mono max-w-xs leading-relaxed">
          Aerospace engineering, sovereign defense systems, and cognitive neural hardware conglomerate.
        </p>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[9px] font-mono text-black/70">
          <a href="#hero" className="hover:text-[#FC832C]">[ OVERVIEW ]</a>
          <a href="#flagship" className="hover:text-[#FC832C]">[ HARDWARE ]</a>
          <a href="#divisions" className="hover:text-[#FC832C]">[ DIVISIONS ]</a>
          <a href="#arsenal" className="hover:text-[#FC832C]">[ ARSENAL ]</a>
          <a href="#founder" className="hover:text-[#FC832C]">[ FOUNDER ]</a>
          <Link href="/academy" className="text-[#FC832C] hover:underline">[ 360° TOUR ]</Link>
        </div>

        <div className="text-[8px] font-mono text-black/35 tracking-widest mt-2">
          © 2026 RJ INDUSTRIES DEV · ALL RIGHTS RESERVED
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════
          9. STICKY FLOATING QUICK DOCK (Bottom Bar)
         ═══════════════════════════════════════════════════ */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[400px]">
        <div className="bg-white/95 backdrop-blur-xl border border-[#e0e0e3] rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-[0_15px_35px_rgba(0,0,0,0.12)]">
          
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider text-black hover:text-[#FC832C]"
          >
            <span>✉</span>
            <span>{copiedEmail ? "COPIED" : "CONTACT"}</span>
          </button>

          <div className="h-4 w-[1px] bg-[#e5e5e7]" />

          <Link
            href="/academy"
            className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider text-[#FC832C] hover:text-black"
          >
            <span>◎</span>
            <span>360° TOUR</span>
          </Link>

          <div className="h-4 w-[1px] bg-[#e5e5e7]" />

          <button
            onClick={handleAudioToggle}
            className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider text-black/70 hover:text-black"
          >
            <span>{audioMuted ? "🔇" : "🔊"}</span>
            <span>{audioMuted ? "SOUND OFF" : "SOUND ON"}</span>
          </button>

        </div>
      </div>

    </div>
  );
}
