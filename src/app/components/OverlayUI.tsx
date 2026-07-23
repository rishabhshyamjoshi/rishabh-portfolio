"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AudioController } from "../utils/AudioController";

export default function OverlayUI() {
  const [displayScroll, setDisplayScroll] = useState(0);
  const [audioMuted, setAudioMuted] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      targetScroll.current += e.deltaY * 0.001;
      if (targetScroll.current > 4) targetScroll.current = 4;
      if (targetScroll.current < 0) targetScroll.current = 0;
    };
    
    const handleNav = (e: any) => {
      targetScroll.current = e.detail;
    };

    const handleToggleContact = () => {
      setShowContact(prev => !prev);
    };

    const handleToggleAudio = async () => {
      try {
        const isMuted = await AudioController.getInstance().toggleMute();
        setAudioMuted(isMuted);
      } catch(err) {}
    };
    
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("navTo", handleNav as any);
    window.addEventListener("toggleContact", handleToggleContact);
    window.addEventListener("toggleAudio", handleToggleAudio);
    
    let frameId: number;
    const updateScroll = () => {
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.08;
      setDisplayScroll(currentScroll.current);
      frameId = requestAnimationFrame(updateScroll);
    };
    frameId = requestAnimationFrame(updateScroll);
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("navTo", handleNav as any);
      window.removeEventListener("toggleContact", handleToggleContact);
      window.removeEventListener("toggleAudio", handleToggleAudio);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const handleAudioToggle = async (e: any) => {
    e.stopPropagation();
    try {
      const isMuted = await AudioController.getInstance().toggleMute();
      setAudioMuted(isMuted);
    } catch(err) {}
  };

  // Hero section fades out as you scroll in either direction
  const heroOpacity = Math.max(0, 1 - Math.abs(displayScroll) * 4);

  // End station contact section fades in when scrolling past Mars (scroll > 3.1 to 4.0)
  const endSectionOpacity = Math.max(0, Math.min(1, (displayScroll - 3.1) * 2.5));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        fontFamily: "'Space Mono', monospace",
        color: "rgba(255,255,255,0.9)",
      }}
    >
      {/* ═══ END STATION CONTACT HUB — Fades in at scroll > 3.1 ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: endSectionOpacity,
          pointerEvents: endSectionOpacity > 0.1 ? "auto" : "none",
          transition: "opacity 0.2s ease",
          padding: "2rem",
        }}
      >
        <div 
          className="relative max-w-2xl w-full bg-black/60 backdrop-blur-xl border border-[#00f0ff]/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col items-center text-center space-y-6"
        >
          {/* High-tech HUD Brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]" />

          {/* Station Badge */}
          <div className="text-[0.6rem] tracking-[0.4em] text-[#00f0ff] uppercase font-bold border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-4 py-1 rounded-full animate-pulse">
            TRANSMISSION STATION 03 // RJ INDUSTRIES HQ
          </div>

          {/* Logo */}
          <div className="py-2">
            <Image 
              src="/logo.png" 
              alt="RJ Industries Logo" 
              width={450}
              height={130}
              className="w-72 md:w-96 h-auto object-contain filter drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            />
          </div>

          <p className="text-[0.75rem] md:text-[0.85rem] tracking-[0.15em] text-white/80 max-w-lg leading-relaxed uppercase">
            Pioneering Spatial Computing, Neural Chips & Interactive WebGL Experiences.
          </p>

          {/* WORK WITH US CTA BUTTON */}
          <div className="pt-2 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="mailto:hello@rj.industries?subject=Work%20With%20RJ%20Industries"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#00f0ff]/20 to-[#00f0ff]/40 hover:from-[#00f0ff]/40 hover:to-[#00f0ff]/70 border border-[#00f0ff] text-white text-[0.7rem] tracking-[0.25em] font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 interactive"
              data-hover
            >
              💼 WORK WITH US / COLLABORATE ↗
            </a>
            
            <a 
              href="tel:+919876543210"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/15 border border-white/20 text-white/90 text-[0.7rem] tracking-[0.2em] font-bold rounded-lg transition-all duration-300 interactive"
              data-hover
            >
              📞 CALL UPLINK
            </a>
          </div>

          {/* CONTACT INFO GRID */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left border-t border-white/10">
            <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[0.55rem] text-[#00f0ff] tracking-[0.2em]">DIRECT EMAIL</span>
              <a href="mailto:hello@rj.industries" className="text-[0.7rem] text-white hover:text-[#00f0ff] transition-colors truncate">
                hello@rj.industries
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[0.55rem] text-[#00f0ff] tracking-[0.2em]">PHONE / WHATSAPP</span>
              <a href="tel:+919876543210" className="text-[0.7rem] text-white hover:text-[#00f0ff] transition-colors">
                +91 98765 43210
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[0.55rem] text-[#00f0ff] tracking-[0.2em]">MAIN DOMAIN</span>
              <a href="https://rjindustries.dev" target="_blank" rel="noopener noreferrer" className="text-[0.7rem] text-white hover:text-[#00f0ff] transition-colors">
                rjindustries.dev
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[0.55rem] text-[#00f0ff] tracking-[0.2em]">GLOBAL HQ LOCATION</span>
              <span className="text-[0.7rem] text-white/90">
                Mumbai, Maharashtra, India
              </span>
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="w-full flex items-center justify-center gap-6 pt-2 text-[0.65rem] tracking-[0.2em]">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#00f0ff]/80 hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 interactive"
              data-hover
            >
              <span>📸</span> INSTAGRAM
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#00f0ff]/80 hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 interactive"
              data-hover
            >
              <span>💼</span> LINKEDIN
            </a>
            <a 
              href="https://github.com/rishabhshyamjoshi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#00f0ff]/80 hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 interactive"
              data-hover
            >
              <span>🐙</span> GITHUB
            </a>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.2); }
        }
      `}} />
      
      {/* ═══ CONTACT MODAL ═══ */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          background: showContact ? "rgba(0,0,0,0.6)" : "transparent",
          backdropFilter: showContact ? "blur(20px)" : "none",
          pointerEvents: showContact ? "auto" : "none",
          transition: "all 0.5s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          opacity: showContact ? 1 : 0,
        }}
      >
        <div style={{
          background: "rgba(15, 15, 20, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "3rem",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "380px",
          transform: showContact ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "0.3rem", letterSpacing: "0.15em", fontWeight: 400 }}>GET IN TOUCH</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", marginBottom: "2rem", letterSpacing: "0.1em" }}>Let&apos;s build something extraordinary.</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <a href="mailto:contact@rj-industries.com" style={{ padding: "0.8rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", textDecoration: "none", letterSpacing: "0.1em", fontSize: "0.7rem", transition: "all 0.3s", borderRadius: "6px" }} data-hover>EMAIL</a>
            <a href="#" style={{ padding: "0.8rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", textDecoration: "none", letterSpacing: "0.1em", fontSize: "0.7rem", transition: "all 0.3s", borderRadius: "6px" }} data-hover>GITHUB</a>
            <a href="#" style={{ padding: "0.8rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", textDecoration: "none", letterSpacing: "0.1em", fontSize: "0.7rem", transition: "all 0.3s", borderRadius: "6px" }} data-hover>LINKEDIN</a>
          </div>
          
          <button onClick={() => setShowContact(false)} style={{ marginTop: "1.5rem", background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", fontSize: "0.6rem", letterSpacing: "0.1em" }} data-hover>
            CLOSE
          </button>
        </div>
      </div>

    </div>
  );
}
