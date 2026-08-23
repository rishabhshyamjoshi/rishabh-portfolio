"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
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

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="bg-[#020202] text-white min-h-screen w-full font-sans overflow-x-hidden selection:bg-white/20">
      
      {/* HEADER - Glassmorphism */}
      <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-50 backdrop-blur-xl bg-black/20 border-b border-white/5">
        <div className="text-[10px] tracking-[0.25em] font-medium opacity-90">RJ INDUSTRIES</div>
        <button 
          onClick={handleAudioToggle}
          className="text-[9px] tracking-[0.2em] font-medium bg-white/10 hover:bg-white/20 transition-colors border border-white/10 rounded-full px-4 py-2 backdrop-blur-md"
        >
          {audioMuted ? "SOUND OFF" : "SOUND ON"}
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] w-full flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Apple-style background */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/hero-bg-mobile.png" 
            alt="Abstract Background" 
            fill
            quality={100}
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#020202]" />
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 flex flex-col items-center w-full max-w-[400px] mt-10"
        >
          <motion.div variants={fadeUpVariant} className="text-[0.65rem] tracking-[0.4em] text-white/50 mb-8 font-medium">
            INNOVATION BEYOND LIMITS
          </motion.div>
          
          <motion.div variants={fadeUpVariant} className="w-full relative h-[120px] mb-8">
            <Image 
              src="/logo.png" 
              alt="RJ Industries Logo" 
              fill
              className="object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            />
          </motion.div>
          
          <motion.p variants={fadeUpVariant} className="text-center text-sm text-white/60 leading-relaxed font-light px-4">
            Pioneering aerospace, defense, and advanced manufacturing with next-generation generative AI technologies.
          </motion.p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 flex flex-col items-center gap-4 z-10"
        >
          <div className="text-[0.55rem] tracking-[0.3em] text-white/30 font-medium">
            DISCOVER
          </div>
          <div className="w-[1px] h-[40px] bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="w-full px-5 py-24 flex flex-col gap-12 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="mb-2"
        >
          <h2 className="text-xs tracking-[0.3em] text-white/40 mb-3 font-medium">PORTFOLIO</h2>
          <h3 className="text-4xl font-semibold tracking-tight">Featured Work.</h3>
        </motion.div>

        <div className="flex flex-col gap-10">
          {PROJECTS.map((project, idx) => (
            <motion.a 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
              key={project.id} 
              href={project.externalLink || project.link}
              target={project.externalLink ? "_blank" : "_self"}
              className="group block relative w-full aspect-[4/5] overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 shadow-2xl"
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                <div className="text-[0.65rem] tracking-[0.2em] text-white/70 mb-3 font-medium uppercase">
                  {project.shortDesc}
                </div>
                <h4 className="text-3xl font-semibold tracking-tight mb-4 leading-tight">
                  {project.title}
                </h4>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.techStack.slice(0, 3).map(tech => (
                    <span key={tech} className="text-[0.6rem] tracking-wide px-3 py-1.5 border border-white/10 rounded-full text-white/90 bg-black/30 backdrop-blur-md">
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-white/60 leading-relaxed font-light line-clamp-2">
                  {project.longDesc}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="w-full px-5 py-24 bg-white/[0.02] border-t border-white/5">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
          className="mb-12"
        >
          <h2 className="text-xs tracking-[0.3em] text-white/40 mb-3 font-medium">THE TEAM</h2>
          <h3 className="text-4xl font-semibold tracking-tight">Core Operatives.</h3>
        </motion.div>

        <div className="flex flex-col gap-6">
          {TEAM.map((member) => (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
              key={member.id} 
              className="flex gap-5 items-center p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden relative">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-lg font-medium tracking-tight">{member.name}</h4>
                </div>
                <div className="text-xs text-white/50 tracking-wide mb-3">
                  {member.role}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {member.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="text-[0.6rem] tracking-wide text-white/70 bg-white/5 border border-white/5 px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT & FOOTER */}
      <section className="w-full px-5 py-32 flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="flex flex-col items-center w-full"
        >
          <h2 className="text-sm tracking-[0.3em] font-medium text-white/40 mb-10">
            INITIATE PROTOCOL
          </h2>
          
          <div className="flex flex-col gap-4 w-full max-w-[320px]">
            <a href="mailto:contact@rjindustries.dev" className="py-5 border border-white/10 bg-white/5 rounded-2xl text-xs tracking-[0.2em] font-medium active:scale-95 transition-all backdrop-blur-md hover:bg-white/10">
              EMAIL SECURE LINE
            </a>
            <div className="flex gap-4 w-full">
              <a href="https://www.linkedin.com/company/rj-industries01/" className="flex-1 py-5 border border-white/10 bg-white/5 rounded-2xl text-[10px] tracking-[0.2em] font-medium active:scale-95 transition-all backdrop-blur-md hover:bg-white/10">
                LINKEDIN
              </a>
              <a href="https://www.instagram.com/rj_industries01/" className="flex-1 py-5 border border-white/10 bg-white/5 rounded-2xl text-[10px] tracking-[0.2em] font-medium active:scale-95 transition-all backdrop-blur-md hover:bg-white/10">
                INSTAGRAM
              </a>
            </div>
          </div>

          <div className="mt-32 text-[0.6rem] tracking-[0.2em] text-white/30 font-medium">
            © {new Date().getFullYear()} RJ INDUSTRIES.
          </div>
        </motion.div>
      </section>
    </div>
  );
}
