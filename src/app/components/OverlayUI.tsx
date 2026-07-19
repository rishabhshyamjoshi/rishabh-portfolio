"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AudioController } from "../utils/AudioController";

export default function OverlayUI() {
  const [displayScroll, setDisplayScroll] = useState(0);
  const [audioMuted, setAudioMuted] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
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
      {/* ═══ TOP LEFT: LOGO ═══ */}
      <div style={{
        position: "absolute",
        top: "clamp(1.5rem, 4vh, 2.5rem)",
        left: "clamp(1.5rem, 4vw, 3rem)",
        pointerEvents: "auto",
        zIndex: 100
      }}>
        <Image 
          src="/logo.png" 
          alt="RJ Industries" 
          width={200}
          height={60}
          style={{
            height: "24px",
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))",
          }}
        />
      </div>

      {/* ═══ TOP RIGHT: MENU BUTTON ═══ */}
      <div style={{
        position: "absolute",
        top: "clamp(1.5rem, 4vh, 2.5rem)",
        right: "clamp(1.5rem, 4vw, 3rem)",
        pointerEvents: "auto",
        zIndex: 100
      }}>
        <button 
          onClick={() => setShowMenu(!showMenu)}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          data-hover
        >
          {showMenu ? "CLOSE" : "MENU"}
        </button>
      </div>

      {/* ═══ BOTTOM RIGHT: AUDIO TOGGLE ═══ */}
      <div style={{
        position: "absolute",
        bottom: "clamp(1.5rem, 4vh, 2.5rem)",
        right: "clamp(1.5rem, 4vw, 3rem)",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        zIndex: 100
      }}>
        <button 
          onClick={handleAudioToggle}
          title={audioMuted ? "Turn Audio ON" : "Turn Audio OFF"}
          style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            width: "40px", 
            height: "20px", 
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }} 
          data-hover
        >
          <svg width="40" height="15" viewBox="0 0 60 15" style={{ overflow: "hidden" }}>
            <g style={{ animation: audioMuted ? "none" : "wave-scroll 2s linear infinite" }}>
              <path 
                d={audioMuted 
                  ? "M 0 7.5 L 120 7.5" 
                  : "M 0 7.5 Q 7.5 0, 15 7.5 T 30 7.5 T 45 7.5 T 60 7.5 T 75 7.5 T 90 7.5"} 
                fill="none" 
                stroke={audioMuted ? "rgba(255,255,255,0.3)" : "rgba(255, 255, 255, 0.9)"} 
                strokeWidth="1.5" 
                strokeLinecap="round"
                style={{ transition: "all 0.3s ease" }}
              />
            </g>
          </svg>
        </button>
        <div style={{
          fontSize: "0.45rem",
          color: audioMuted ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.9)",
          letterSpacing: "0.2em",
          marginTop: "6px",
          textAlign: "right"
        }}>
          {audioMuted ? "SOUND OFF" : "SOUND ON"}
        </div>
      </div>

      {/* ═══ BOTTOM LEFT: SCROLL HINT ═══ */}
      <div style={{
        position: "absolute",
        bottom: "clamp(1.5rem, 4vh, 2.5rem)",
        left: "clamp(1.5rem, 4vw, 3rem)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        opacity: displayScroll > 0.1 ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}>
        <div style={{
          width: "30px",
          height: "1px",
          background: "rgba(255,255,255,0.4)",
        }} />
        <div style={{
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.4)",
        }}>
          SWIPE / SCROLL
        </div>
      </div>

      {/* ═══ HERO SECTION ═══ */}
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
        <div style={{ textAlign: "center", transform: "translateY(-20px)" }}>
          <div style={{
            fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)",
            letterSpacing: "0.5em",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "1rem",
          }}>
            INNOVATION BEYOND LIMITS
          </div>
          <h1 style={{
            fontFamily: "var(--font-orbitron)",
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: "#fff",
            textShadow: "0 0 30px rgba(0, 240, 255, 0.4)",
            margin: 0,
            lineHeight: 1,
          }}>
            RJ INDUSTRIES
          </h1>
        </div>
      </div>

      {/* ═══ FULL SCREEN MENU OVERLAY ═══ */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(5, 8, 20, 0.95)",
        backdropFilter: "blur(30px)",
        pointerEvents: showMenu ? "auto" : "none",
        opacity: showMenu ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 90,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", alignItems: "center" }}>
          {["HOME", "PRODUCT", "TEAM", "ACADEMICS", "MANUFACTURING"].map((item, idx) => (
            <button 
              key={item}
              onClick={() => {
                window.dispatchEvent(new CustomEvent("navTo", { detail: idx }));
                setShowMenu(false);
              }} 
              className="hud-nav-link" 
              data-hover
              style={{
                transform: showMenu ? "translateY(0)" : "translateY(20px)",
                opacity: showMenu ? 1 : 0,
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + (idx * 0.05)}s`,
              }}
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => {
              setShowContact(true);
              setShowMenu(false);
            }} 
            className="hud-nav-link" 
            data-hover
            style={{
              transform: showMenu ? "translateY(0)" : "translateY(20px)",
              opacity: showMenu ? 1 : 0,
              transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.35s`,
              color: "#00f0ff"
            }}
          >
            CONTACT
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hud-nav-link {
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
          font-family: var(--font-body);
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 300;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hud-nav-link:hover {
          color: #fff;
          text-shadow: 0 0 20px rgba(255,255,255,0.5);
          transform: scale(1.05) !important;
        }
        @keyframes wave-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-30px); }
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
          zIndex: 110,
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
