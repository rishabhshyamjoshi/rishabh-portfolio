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
      {/* ═══ HERO SECTION — Full-screen cinematic landing ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: heroOpacity,
          transition: "opacity 0.1s ease",
          pointerEvents: "none",
        }}
      >
        {/* Main title */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)",
            letterSpacing: "0.5em",
            color: "rgba(255,255,255,0.35)",
            marginBottom: "1.5rem",
            fontWeight: 400,
            animation: "fadeInUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
          }}>
            INNOVATION BEYOND LIMITS
          </div>
          <Image 
            src="/logo.png" 
            alt="RJ Industries Logo" 
            width={700}
            height={200}
            priority
            style={{
              width: "90%",
              maxWidth: "700px",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 0 20px rgba(136,170,255,0.3))",
              marginTop: "1rem",
              transform: "translateX(6%)",
              animation: "fadeInUp 2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both",
            }}
          />
        </div>

        {/* Subtle scroll indicator */}
        <div style={{
          position: "absolute",
          bottom: "10%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.8rem",
          animation: "fadeInUp 1.5s ease 1s both",
        }}>
          <div style={{
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.3)",
          }}>
            SWIPE OR SCROLL
          </div>
          <div style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
            animation: "scrollPulse 2s ease infinite",
          }} />
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
          background: "rgba(10, 10, 12, 0.9)",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          padding: "3rem",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "380px",
          transform: showContact ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.7), inset 0 0 20px rgba(212, 175, 55, 0.05)",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "1.2rem", color: "#d4af37", marginBottom: "0.3rem", letterSpacing: "0.15em", fontWeight: 400 }}>GET IN TOUCH</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", marginBottom: "2rem", letterSpacing: "0.1em" }}>Let&apos;s build something extraordinary.</p>
          
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
