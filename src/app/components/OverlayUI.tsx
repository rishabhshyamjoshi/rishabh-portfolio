"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AudioController } from "../utils/AudioController";

export default function OverlayUI() {
  const [displayScroll, setDisplayScroll] = useState(0);
  const [audioMuted, setAudioMuted] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showRightClickWarning, setShowRightClickWarning] = useState(true);
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
          }}>
            INNOVATION BEYOND LIMITS
          </div>
          <Image 
            src="/logo.png" 
            alt="RJ Industries Logo" 
            width={700}
            height={200}
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
            @keyframes warningPulse {
              0%, 100% { opacity: 0.7; box-shadow: 0 0 5px rgba(255,68,68,0.1); }
              50% { opacity: 1; box-shadow: 0 0 15px rgba(255,68,68,0.4); }
            }
            @keyframes blink {
              50% { opacity: 0; }
            }
          `}} />
      
      {/* ═══ CONTACT MODAL ═══ */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          background: showContact ? "rgba(0,0,0,0.3)" : "transparent",
          backdropFilter: showContact ? "blur(16px)" : "none",
          WebkitBackdropFilter: showContact ? "blur(16px)" : "none",
          pointerEvents: showContact ? "auto" : "none",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          opacity: showContact ? 1 : 0,
        }}
      >
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "2.5rem 3rem",
          borderRadius: "24px",
          width: "90%",
          maxWidth: "380px",
          transform: showContact ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          textAlign: "center",
          fontFamily: "'Inter', 'Space Grotesk', sans-serif",
        }}>
          
          <div style={{ 
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "1.5rem"
          }}>
            {/* Elegant mail icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "0.5rem", letterSpacing: "-0.02em", fontWeight: 500 }}>Get in Touch</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "2rem", letterSpacing: "0.01em", fontWeight: 400 }}>
            Let&apos;s build something extraordinary.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <a href="mailto:contact@rjindustries.dev" target="_blank" rel="noopener noreferrer" 
               style={{ padding: "0.8rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem", transition: "all 0.2s ease", borderRadius: "12px" }} 
               onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
               onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
               data-hover>Email</a>
            <a href="tel:+918208812534" 
               style={{ padding: "0.8rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem", transition: "all 0.2s ease", borderRadius: "12px" }} 
               onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
               onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
               data-hover>Mobile</a>
            <a href="https://www.instagram.com/rj_industries01/" target="_blank" rel="noopener noreferrer" 
               style={{ padding: "0.8rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem", transition: "all 0.2s ease", borderRadius: "12px" }} 
               onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
               onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
               data-hover>Instagram</a>
            <a href="https://www.linkedin.com/company/rj-industries01/" target="_blank" rel="noopener noreferrer" 
               style={{ padding: "0.8rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem", transition: "all 0.2s ease", borderRadius: "12px" }} 
               onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
               onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
               data-hover>LinkedIn</a>
          </div>
          
          <button 
            onClick={() => setShowContact(false)} 
            style={{ 
              marginTop: "2rem", 
              background: "none", 
              border: "none", 
              color: "rgba(255,255,255,0.4)", 
              cursor: "pointer", 
              fontSize: "0.85rem", 
              fontWeight: 400,
              transition: "color 0.2s" 
            }} 
            onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
            onMouseOut={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
            data-hover
          >
            Close
          </button>
        </div>
      </div>

      {/* ═══ ONBOARDING MODAL ═══ */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          background: showRightClickWarning ? "rgba(0,0,0,0.3)" : "transparent",
          backdropFilter: showRightClickWarning ? "blur(16px)" : "none",
          WebkitBackdropFilter: showRightClickWarning ? "blur(16px)" : "none",
          pointerEvents: showRightClickWarning ? "auto" : "none",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 60,
          opacity: showRightClickWarning ? 1 : 0,
        }}
      >
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "2.5rem 3rem",
          borderRadius: "24px",
          maxWidth: "400px",
          textAlign: "center",
          transform: showRightClickWarning ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
          transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          fontFamily: "'Inter', 'Space Grotesk', sans-serif",
        }}>
          
          <div style={{ 
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "1.5rem"
          }}>
            {/* Elegant minimal mouse icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5">
              <rect x="7" y="3" width="10" height="18" rx="5" />
              <path d="M12 7v4" strokeLinecap="round" />
            </svg>
          </div>

          <h2 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "0.8rem", letterSpacing: "-0.02em", fontWeight: 500 }}>Quick Navigation</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "2rem", letterSpacing: "0.01em", lineHeight: 1.5, fontWeight: 400 }}>
            Right-click anywhere to open the radial menu.<br/>
            Scroll to travel through the portfolio, and drag to rotate the camera.
          </p>
          <button 
            onClick={() => setShowRightClickWarning(false)} 
            style={{ 
              padding: "0.75rem 2.5rem", 
              background: "#fff", 
              color: "#000", 
              border: "none",
              cursor: "pointer", 
              fontSize: "0.9rem", 
              fontWeight: 500,
              transition: "all 0.2s ease",
              borderRadius: "30px",
              boxShadow: "0 4px 14px rgba(255,255,255,0.25)"
            }} 
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,255,255,0.35)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(255,255,255,0.25)";
            }}
          >
            Got it
          </button>
        </div>
      </div>

    </div>
  );
}
