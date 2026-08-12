"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PROJECTS } from "../data/projects";
import { TEAM } from "../data/team";
import { AudioController } from "../utils/AudioController";

export default function Mobile2DView() {
  const [audioMuted, setAudioMuted] = useState(true);

  useEffect(() => {
    // Basic body styling for mobile view
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

  return (
    <div className="bg-black text-white min-h-screen w-full font-sans overflow-x-hidden">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference">
        <div className="text-xs tracking-[0.2em] font-mono opacity-80">RJ.IND</div>
        <button 
          onClick={handleAudioToggle}
          className="text-xs tracking-[0.2em] font-mono border border-white/20 rounded-full px-4 py-1.5"
        >
          {audioMuted ? "SOUND OFF" : "SOUND ON"}
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative p-6 snap-start">
        <div className="text-center w-full max-w-[400px]">
          <div className="text-[0.6rem] tracking-[0.4em] text-white/40 mb-6 font-mono">
            INNOVATION BEYOND LIMITS
          </div>
          <Image 
            src="/logo.png" 
            alt="RJ Industries Logo" 
            width={500}
            height={150}
            className="w-full h-auto object-contain filter drop-shadow-[0_0_15px_rgba(136,170,255,0.2)]"
          />
        </div>
        
        <div className="absolute bottom-12 flex flex-col items-center gap-4">
          <div className="text-[0.55rem] tracking-[0.3em] text-white/30 font-mono">
            SCROLL TO EXPLORE
          </div>
          <div className="w-[1px] h-[40px] bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="w-full px-6 py-20 flex flex-col gap-12">
        <div className="mb-4">
          <h2 className="text-sm tracking-[0.3em] font-mono text-white/50 mb-2">01 //</h2>
          <h3 className="text-3xl font-light tracking-wider">PROJECTS</h3>
        </div>

        <div className="flex flex-col gap-16">
          {PROJECTS.map((project, idx) => (
            <a 
              key={project.id} 
              href={project.externalLink || project.link}
              target={project.externalLink ? "_blank" : "_self"}
              className="group block relative w-full aspect-[4/5] overflow-hidden rounded-md border border-white/10"
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end">
                <div className="text-[0.6rem] tracking-[0.2em] text-[#00f0ff] mb-2 font-mono">
                  {project.shortDesc}
                </div>
                <h4 className="text-2xl font-medium tracking-wide mb-3 leading-tight">
                  {project.title}
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.slice(0, 3).map(tech => (
                    <span key={tech} className="text-[0.55rem] tracking-wider px-2 py-1 border border-white/20 rounded-full text-white/70 bg-white/5 backdrop-blur-md">
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-mono line-clamp-2">
                  {project.longDesc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

      {/* TEAM SECTION */}
      <section className="w-full px-6 py-20">
        <div className="mb-12">
          <h2 className="text-sm tracking-[0.3em] font-mono text-white/50 mb-2">02 //</h2>
          <h3 className="text-3xl font-light tracking-wider">TEAM</h3>
        </div>

        <div className="flex flex-col gap-8">
          {TEAM.map((member) => (
            <div key={member.id} className="flex gap-4 items-center border-b border-white/10 pb-8">
              <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border border-white/20 relative">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm tracking-wide font-medium">{member.name}</h4>
                  <span className="text-[0.5rem] tracking-widest px-1.5 py-0.5 rounded-sm" style={{ color: member.color, border: `1px solid ${member.color}40`, backgroundColor: `${member.color}10` }}>
                    {member.clearance}
                  </span>
                </div>
                <div className="text-xs text-white/40 font-mono tracking-wider mb-2">
                  {member.role}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {member.skills.slice(0, 2).map(skill => (
                    <span key={skill} className="text-[0.5rem] tracking-widest text-white/30 bg-white/5 px-1.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT & FOOTER */}
      <section className="w-full px-6 py-24 flex flex-col items-center text-center bg-zinc-950">
        <h2 className="text-[0.7rem] tracking-[0.4em] font-mono text-white/40 mb-8">
          INITIATE PROTOCOL
        </h2>
        
        <div className="flex flex-col gap-6 w-full max-w-[300px]">
          <a href="mailto:contact@rjindustries.dev" className="py-4 border border-white/10 bg-white/5 rounded-lg text-xs tracking-[0.2em] font-mono active:bg-white/10 transition-colors">
            EMAIL SECURE LINE
          </a>
          <a href="https://www.linkedin.com/company/rj-industries01/" className="py-4 border border-white/10 bg-white/5 rounded-lg text-xs tracking-[0.2em] font-mono active:bg-white/10 transition-colors">
            LINKEDIN
          </a>
          <a href="https://www.instagram.com/rj_industries01/" className="py-4 border border-white/10 bg-white/5 rounded-lg text-xs tracking-[0.2em] font-mono active:bg-white/10 transition-colors">
            INSTAGRAM
          </a>
        </div>

        <div className="mt-24 text-[0.55rem] tracking-[0.2em] text-white/20 font-mono">
          © {new Date().getFullYear()} RJ INDUSTRIES. ALL RIGHTS RESERVED.
        </div>
      </section>
    </div>
  );
}
