"use client";

import { useState, useEffect, useRef } from "react";
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
    
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("navTo", handleNav as any);
    
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
          pointerEvents: heroOpacity > 0.1 ? "auto" : "none",
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
          }}>
            INNOVATION BEYOND LIMITS
          </div>
          <img 
            src="/logo.png" 
            alt="RJ Industries Logo" 
            style={{
              width: "90%",
              maxWidth: "700px",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 0 20px rgba(136,170,255,0.3))",
              marginTop: "1rem",
              transform: "translateX(8%)",
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
            SCROLL TO EXPLORE
          </div>
          <div style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
            animation: "scrollPulse 2s ease infinite",
          }} />
        </div>
      </div>

      {/* ═══ TOP NAV BAR ═══ */}
      <div
        style={{
          position: "absolute",
          top: "clamp(1.5rem, 3vh, 2.5rem)",
          right: "clamp(1.5rem, 3vw, 3rem)",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            fontSize: "0.55rem",
            padding: "0.7rem 1.2rem",
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "1.2rem",
            letterSpacing: "0.15em",
            borderRadius: "100px",
            transition: "all 0.3s ease",
          }}
        >
          <a href="#work" style={{ cursor: "pointer", color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "color 0.3s" }} data-hover>WORK</a>
          
          {/* Audio Toggle */}
          <button 
            onClick={handleAudioToggle}
            title={audioMuted ? "Turn Audio ON" : "Turn Audio OFF"}
            style={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px", 
              height: "16px", 
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }} 
            data-hover
          >
            <svg width="36" height="12" viewBox="0 0 40 12" style={{ overflow: "hidden" }}>
              <g style={{ animation: audioMuted ? "none" : "wave-scroll 1.2s linear infinite" }}>
                <path 
                  d={audioMuted 
                    ? "M 0 6 L 60 6" 
                    : "M 0 6 Q 5 0, 10 6 T 20 6 T 30 6 T 40 6 T 50 6 T 60 6"} 
                  fill="none" 
                  stroke={audioMuted ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)"} 
                  strokeWidth="1.5" 
                  style={{ transition: "all 0.3s ease" }}
                />
              </g>
            </svg>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes wave-scroll {
                from { transform: translateX(0); }
                to { transform: translateX(-20px); }
              }
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes scrollPulse {
                0%, 100% { opacity: 0.4; transform: scaleY(1); }
                50% { opacity: 0.8; transform: scaleY(1.2); }
              }
            `}} />
          </button>
          
          <button 
            onClick={() => setShowContact(!showContact)} 
            style={{ cursor: "pointer", color: "rgba(255,255,255,0.6)", background: "none", border: "none", fontSize: "inherit", letterSpacing: "inherit", fontFamily: "inherit", padding: 0, transition: "color 0.3s" }} 
            data-hover
          >
            CONTACT
          </button>
        </div>
      </div>
      
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

      {/* ═══ LEFT SIDEBAR NAV ═══ */}
      <div
        style={{
          position: "absolute",
          left: "clamp(2rem, 4vw, 4rem)",
          bottom: "clamp(2rem, 6vh, 5rem)",
          pointerEvents: displayScroll > 0.5 ? "auto" : "none",
          opacity: displayScroll > 0.5 ? Math.min(1, (displayScroll - 0.5) * 4) : 0,
          transform: displayScroll > 0.5 ? "translateY(0)" : "translateY(15px)",
          transition: "transform 0.1s var(--ease-out-expo)",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div style={{ 
          fontSize: "0.6rem", 
          letterSpacing: "0.3em", 
          fontWeight: 400, 
          color: "rgba(255,255,255,0.25)",
          marginBottom: "0.5rem",
        }}>
          NAVIGATE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", fontSize: "0.75rem", letterSpacing: "0.08em" }}>
          <a href="#product" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navTo', { detail: 0.5 })); }} className="sidebar-link" data-hover>
            Products
          </a>
          <a href="#team" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navTo', { detail: 2.5 })); }} className="sidebar-link" data-hover>
            Team
          </a>
          <a href="#academy" className="sidebar-link" data-hover>
            Academy
          </a>
          <a href="#vision" className="sidebar-link" data-hover>
            Vision
          </a>
        </div>
      </div>
    </div>
  );
}
