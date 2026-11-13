"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS, ProjectData } from "../data/projects";
import { TEAM } from "../data/team";
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

  const categories = ["ALL", "HARDWARE", "SOFTWARE & WEB", "DEFENSE & 3D"];

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "HARDWARE") return p.id === 1;
    if (activeCategory === "SOFTWARE & WEB") return p.id === 2 || p.id === 4 || p.id === 7;
    if (activeCategory === "DEFENSE & 3D") return p.id === 3 || p.id === 5 || p.id === 6;
    return true;
  });

  return (
    <div className="bg-[#070709] text-white min-h-screen w-full font-sans antialiased overflow-x-hidden selection:bg-cyan-500/30 pb-36">
      
      {/* ═══ 1. PROPER STICKY TOP NAVBAR (Armor Style) ═══ */}
      <header className="sticky top-0 z-50 w-full bg-[#0a0a0d]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-7 h-7">
            <Image src="/logo.png" alt="RJ Industries" fill className="object-contain" priority />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-[0.2em] uppercase font-[var(--font-orbitron)] text-white">
              RJ INDUSTRIES
            </span>
            <span className="text-[7.5px] font-mono tracking-widest text-emerald-400 font-bold -mt-0.5">
              ● VERIFIED ENTITY
            </span>
          </div>
        </Link>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/academy"
            className="px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center gap-1"
          >
            <span>◎</span> 360° TOUR
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1 bg-white/5 border border-white/15 rounded-lg active:bg-white/15 transition-colors"
            aria-label="Toggle Menu"
          >
            <span className={`w-4 h-[1.5px] bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`w-4 h-[1.5px] bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-[2px]' : ''}`} />
          </button>
        </div>

      </header>

      {/* Slide-out Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sticky top-[53px] z-40 w-full bg-[#0d0d12] border-b border-white/15 px-5 py-6 flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex flex-col gap-3 font-[var(--font-orbitron)] text-sm tracking-wider">
              <a href="#flagship" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-1">
                {"//"} 01. FLAGSHIP HARDWARE
              </a>
              <a href="#divisions" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-1">
                {"//"} 02. STRATEGIC DIVISIONS
              </a>
              <a href="#deployments" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-1">
                {"//"} 03. ACTIVE SYSTEMS ({PROJECTS.length})
              </a>
              <a href="#founder" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white py-1">
                {"//"} 04. LEADERSHIP &amp; FOUNDER
              </a>
              <Link href="/academy" className="text-cyan-400 py-1">
                {"//"} 05. 360° SINGULARITY ACADEMY &rarr;
              </Link>
            </div>

            <div className="h-[1px] bg-white/10 my-1" />

            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-white/60">
              <a href="https://www.crunchbase.com/organization/rj-industries-dev" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded border border-white/10 text-center">
                CRUNCHBASE ↗
              </a>
              <a href="https://www.linkedin.com/company/rj-industries01/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded border border-white/10 text-center">
                LINKEDIN ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ 2. FLAGSHIP HERO PRODUCT DROP (Armor Banner Style) ═══ */}
      <section id="flagship" className="relative w-full pt-8 pb-10 px-4 flex flex-col items-center overflow-hidden">
        
        {/* Soft Radial Backlight */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-gradient-to-b from-[#11141c] to-[#0a0c12] border border-white/15 rounded-3xl p-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          
          {/* Top Product Tag */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-0.5 text-[8.5px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-400/10 border border-cyan-400/30 rounded-full uppercase">
              FLAGSHIP DROP · 2026
            </span>
            <span className="text-[9px] font-mono font-bold text-white/40">
              VERSION H1
            </span>
          </div>

          {/* Product Headline */}
          <h1 className="text-3xl font-black font-[var(--font-orbitron)] text-white tracking-wide uppercase leading-tight mb-2">
            K.I.N.E.T.I.C™ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-100">
              VISION ONE
            </span>
          </h1>

          <p className="text-xs text-white/70 leading-relaxed font-light mb-6">
            Private, sovereign spatial computing hardware equipped with the proprietary RJ-A1 neural silicon. 100% air-gapped, zero-cloud AI.
          </p>

          {/* Clean Hardware Visual */}
          <div className="relative w-full aspect-[16/10] mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-radial-gradient from-cyan-500/15 to-transparent blur-xl" />
            <Image
              src="/rj-glasses.png"
              alt="K.I.N.E.T.I.C Glasses"
              fill
              className="object-contain filter drop-shadow-[0_15px_30px_rgba(0,240,255,0.3)]"
              priority
            />
          </div>

          {/* Armor 4-Feature Spec Grid */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
              <span className="block text-[7.5px] font-mono text-white/40 uppercase">PROCESSOR</span>
              <span className="text-[10px] font-mono font-bold text-cyan-300">RJ-A1 NEURAL SILICON</span>
            </div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
              <span className="block text-[7.5px] font-mono text-white/40 uppercase">PRIVACY</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400">100% AIR-GAPPED</span>
            </div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
              <span className="block text-[7.5px] font-mono text-white/40 uppercase">OPTICS</span>
              <span className="text-[10px] font-mono font-bold text-white">DUAL MICRO-OLED</span>
            </div>
            <div className="p-3 bg-black/60 border border-white/10 rounded-xl">
              <span className="block text-[7.5px] font-mono text-white/40 uppercase">CHASSIS</span>
              <span className="text-[10px] font-mono font-bold text-white">GRADE 5 TITANIUM</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col gap-2">
            <Link
              href="/project/1"
              className="w-full py-3.5 bg-cyan-400 text-black font-black text-xs font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all"
            >
              <span>INSPECT CASE STUDY</span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="/academy"
              className="w-full py-3 bg-white/5 border border-white/15 text-white/90 font-bold text-[10px] font-mono tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
            >
              <span>◎ OPERATE 360° BLACK HOLE ORBIT</span>
            </Link>
          </div>

        </div>

      </section>

      {/* ═══ 3. VERIFIED CREDENTIALS & METRICS BAR ═══ */}
      <section className="w-full px-4 py-4">
        <div className="w-full max-w-md mx-auto grid grid-cols-3 gap-2 p-3 bg-white/[0.02] border border-white/10 rounded-2xl text-center">
          <div>
            <span className="block text-base font-black font-[var(--font-orbitron)] text-white">$100K</span>
            <span className="text-[8px] font-mono text-white/40 uppercase font-bold">PRE-SEED CAPITAL</span>
          </div>
          <div className="border-x border-white/10">
            <span className="block text-base font-black font-[var(--font-orbitron)] text-cyan-300">07</span>
            <span className="text-[8px] font-mono text-white/40 uppercase font-bold">ACTIVE SYSTEMS</span>
          </div>
          <div>
            <span className="block text-base font-black font-[var(--font-orbitron)] text-emerald-400">MECH ENG</span>
            <span className="text-[8px] font-mono text-white/40 uppercase font-bold">LEADERSHIP</span>
          </div>
        </div>
      </section>

      {/* ═══ 4. CORE STRATEGIC DIVISIONS ═══ */}
      <section id="divisions" className="w-full px-4 py-10 max-w-md mx-auto">
        
        <div className="mb-5 flex items-center justify-between">
          <div>
            <span className="text-[8.5px] font-mono text-cyan-400 tracking-widest uppercase font-bold block mb-0.5">
              [CAPABILITY MATRIX]
            </span>
            <h2 className="text-xl font-black font-[var(--font-orbitron)] text-white tracking-wide uppercase">
              CORE DIVISIONS
            </h2>
          </div>
          <span className="text-[8.5px] font-mono text-white/40 uppercase">04 PILLARS</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              id: "01",
              title: "AEROSPACE",
              sub: "Orbital propulsion & spacecraft telemetry",
              border: "border-cyan-500/30",
              tag: "PROPULSION"
            },
            {
              id: "02",
              title: "DEFENSE",
              sub: "Sovereign tactical hardware & QKD encryption",
              border: "border-amber-500/30",
              tag: "TACTICAL"
            },
            {
              id: "03",
              title: "MECHANICAL",
              sub: "Robotic actuators, CAD/CAM & FEA mechanics",
              border: "border-emerald-500/30",
              tag: "KINEMATICS"
            },
            {
              id: "04",
              title: "ENTERPRISE",
              sub: "Large-scale web platforms & 3D WebGL",
              border: "border-blue-500/30",
              tag: "SOFTWARE"
            }
          ].map((div) => (
            <div
              key={div.id}
              className={`p-3.5 bg-[#0d0f17] border ${div.border} rounded-2xl flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono text-white/40 font-bold">{div.id}</span>
                  <span className="text-[7.5px] font-mono font-bold text-white/80 bg-white/5 px-1.5 py-0.5 rounded">
                    {div.tag}
                  </span>
                </div>
                <h3 className="text-xs font-bold font-[var(--font-orbitron)] tracking-wider text-white mb-1">
                  {div.title}
                </h3>
                <p className="text-[9.5px] text-white/60 leading-relaxed font-light">
                  {div.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ═══ 5. DEPLOYED SYSTEMS ROSTER (Armor Category & Product Cards) ═══ */}
      <section id="deployments" className="w-full px-4 py-8 max-w-md mx-auto">
        
        <div className="mb-4">
          <span className="text-[8.5px] font-mono text-cyan-400 tracking-widest uppercase font-bold block mb-0.5">
            [PROVEN DEPLOYMENTS]
          </span>
          <h2 className="text-xl font-black font-[var(--font-orbitron)] text-white tracking-wide uppercase">
            ACTIVE SYSTEMS
          </h2>
        </div>

        {/* Category Filter Pills (Armor Style) */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-3 mb-4" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase whitespace-nowrap transition-all border
                ${activeCategory === cat 
                  ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:text-white'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="flex flex-col gap-4">
          {filteredProjects.map((project: ProjectData) => {
            const isExpanded = expandedSpecId === project.id;
            const targetUrl = project.externalLink || project.link;

            return (
              <div
                key={project.id}
                className="w-full bg-[#0c0e14] border border-white/15 rounded-2xl overflow-hidden shadow-lg flex flex-col"
              >
                
                {/* Card Header */}
                <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
                  <span className="text-[8.5px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {project.shortDesc}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase">LIVE</span>
                  </div>
                </div>

                {/* Card Visual */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-black/80">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-transparent" />
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col">
                  <h3 className="text-base font-bold font-[var(--font-orbitron)] text-white tracking-wide mb-1.5">
                    {project.title}
                  </h3>

                  <p className="text-[11px] text-white/65 leading-relaxed font-light mb-3">
                    {project.longDesc}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[8px] font-mono bg-white/5 border border-white/10 text-white/70 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Collapsible Tech Specs Accordion (Armor PDP Style) */}
                  <div className="w-full border-t border-white/10 pt-2.5 mb-3">
                    <button
                      onClick={() => setExpandedSpecId(isExpanded ? null : project.id)}
                      className="w-full flex items-center justify-between text-[9px] font-mono tracking-wider text-cyan-300 font-bold uppercase"
                    >
                      <span>{isExpanded ? "[-] HIDE TELEMETRY" : "[+] VIEW SPEC SHEET"}</span>
                      <span className="text-white/40">{isExpanded ? "▲" : "▼"}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 bg-black/60 border border-white/10 rounded-xl grid grid-cols-2 gap-2 text-[8.5px] font-mono text-left">
                        <div>
                          <span className="text-white/40 block">STATUS:</span>
                          <span className="text-emerald-400 font-bold">100% OPERATIONAL</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">PLATFORM:</span>
                          <span className="text-white font-bold">{project.techStack[0] || "PROPRIETARY"}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">SECURITY:</span>
                          <span className="text-cyan-300 font-bold">SOVEREIGN GRADE</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">UPTIME:</span>
                          <span className="text-white font-bold">99.98%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <a
                      href={targetUrl}
                      target={targetUrl.startsWith("http") ? "_blank" : "_self"}
                      rel={targetUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex-1 py-2.5 bg-white text-black font-bold text-[9.5px] font-mono tracking-wider uppercase rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
                    >
                      <span>VISIT SYSTEM</span>
                      <span>↗</span>
                    </a>

                    <Link
                      href={`/project/${project.id}`}
                      className="py-2.5 px-3.5 bg-white/5 border border-white/15 text-white/90 font-bold text-[9.5px] font-mono tracking-wider uppercase rounded-xl hover:bg-white/15 transition-all"
                    >
                      CASE STUDY
                    </Link>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* ═══ 6. FOUNDER & EXECUTIVE DOSSIER ═══ */}
      <section id="founder" className="w-full px-4 py-8 max-w-md mx-auto">
        <div className="p-5 bg-gradient-to-b from-[#10141f] to-[#090b10] border border-white/15 rounded-3xl relative overflow-hidden shadow-xl">
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-[8.5px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
              EXECUTIVE DOSSIER
            </span>
            <span className="px-2 py-0.5 text-[7.5px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-full font-bold">
              FOUNDER
            </span>
          </div>

          <h3 className="text-xl font-black font-[var(--font-orbitron)] text-white tracking-wide uppercase mb-1">
            RISHABH SHYAM JOSHI
          </h3>
          <p className="text-[9.5px] font-mono text-cyan-300 font-bold uppercase tracking-wider mb-3">
            MECHANICAL ENGINEER · FOUNDER & CEO
          </p>

          <p className="text-[11px] text-white/70 leading-relaxed font-light mb-5">
            Directing sovereign defense platforms, orbital spacecraft telemetry, electro-mechanical robotics, and large-scale software engineering at RJ Industries Dev.
          </p>

          {/* Social Profiles Grid */}
          <div className="grid grid-cols-2 gap-2 text-[9px] font-mono font-bold">
            <a
              href="https://www.linkedin.com/in/rishabhshyamjoshi/"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-center flex items-center justify-center gap-1 active:bg-white/15"
            >
              <span>LINKEDIN</span>
              <span>↗</span>
            </a>
            <a
              href="https://www.crunchbase.com/organization/rj-industries-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-cyan-300 text-center flex items-center justify-center gap-1 active:bg-white/15"
            >
              <span>CRUNCHBASE</span>
              <span>↗</span>
            </a>
            <a
              href="https://x.com/rishabhshyamjoshi"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-center flex items-center justify-center gap-1 active:bg-white/15"
            >
              <span>X (TWITTER)</span>
              <span>↗</span>
            </a>
            <a
              href="https://github.com/rishabhshyamjoshi"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-center flex items-center justify-center gap-1 active:bg-white/15"
            >
              <span>GITHUB</span>
              <span>↗</span>
            </a>
          </div>

        </div>
      </section>

      {/* ═══ 7. CONTACT & BRIEF INITIATION ═══ */}
      <section className="w-full px-4 py-8 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-black font-[var(--font-orbitron)] text-white uppercase tracking-tight mb-2">
          ESTABLISH UPLINK
        </h2>
        <p className="text-xs text-white/60 font-light mb-5">
          For sovereign defense contracts, aerospace mechanical development, or large-scale web systems:
        </p>

        <div className="flex flex-col gap-2">
          <a
            href="mailto:contact@rjindustries.dev"
            className="w-full py-3.5 bg-cyan-400 text-black font-black text-xs font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 transition-all"
          >
            <span>TRANSMIT BRIEF (EMAIL)</span>
            <span>&rarr;</span>
          </a>

          <button
            onClick={handleCopyEmail}
            className="w-full py-3 bg-white/5 border border-white/15 text-white/80 font-mono text-[9px] tracking-wider rounded-xl active:bg-white/15 transition-all"
          >
            {copiedEmail ? "✓ COPIED: contact@rjindustries.dev" : "COPY EMAIL: contact@rjindustries.dev"}
          </button>
        </div>
      </section>

      {/* ═══ 8. PROPER MOBILE FOOTER ═══ */}
      <footer className="w-full px-4 pt-6 pb-8 border-t border-white/10 max-w-md mx-auto text-center flex flex-col items-center gap-3 text-[9px] font-mono text-white/40">
        <div className="flex items-center gap-4 text-white/60">
          <Link href="/academy" className="hover:text-white">SINGULARITY ACADEMY</Link>
          <span>●</span>
          <a href="https://rjindustries.dev" className="hover:text-white">RJINDUSTRIES.DEV</a>
        </div>
        <p>© 2026 RJ Industries Dev. All Rights Reserved.</p>
        <p className="text-white/25">Amravati, Maharashtra, India · Sovereign Deep-Tech & Mechanical Systems</p>
      </footer>

      {/* ═══ 9. PROPER STICKY BOTTOM ACTION BAR (Armor Style) ═══ */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md">
        <div className="flex items-center justify-between p-1.5 bg-[#0a0c12]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
          
          <a
            href="mailto:contact@rjindustries.dev"
            className="flex-1 py-2.5 text-center text-[10px] font-mono font-bold tracking-wider text-black bg-cyan-400 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all"
          >
            <span>CONTACT</span>
            <span>&rarr;</span>
          </a>

          <div className="w-[1px] h-4 bg-white/15 mx-1.5" />

          <Link
            href="/academy"
            className="flex-1 py-2.5 text-center text-[9.5px] font-mono font-bold tracking-wider text-white bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-1 hover:bg-white/10 transition-all"
          >
            <span>◎ 360° TOUR</span>
          </Link>

          <div className="w-[1px] h-4 bg-white/15 mx-1.5" />

          <button
            onClick={handleAudioToggle}
            className="px-3 py-2.5 text-center text-[9px] font-mono font-bold text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-1"
            aria-label="Toggle Audio"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${audioMuted ? 'bg-white/30' : 'bg-emerald-400 animate-pulse'}`} />
            <span>{audioMuted ? "SOUND" : "MUTE"}</span>
          </button>

        </div>
      </div>

    </div>
  );
}
