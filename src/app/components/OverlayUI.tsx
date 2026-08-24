"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AudioController } from "../utils/AudioController";
import { useThemeColors } from "../hooks/useThemeColors";

export default function OverlayUI() {
  const [displayScroll, setDisplayScroll] = useState(0);
  const [audioMuted, setAudioMuted] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showRightClickWarning, setShowRightClickWarning] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const visRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeColors();

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

    const handleTrackChange = (e: any) => {
      setCurrentTrack(e.detail);
    };
    
    window.addEventListener("wheel", handleWheel);
    window.addEventListener("navTo", handleNav as any);
    window.addEventListener("toggleContact", handleToggleContact);
    window.addEventListener("toggleAudio", handleToggleAudio);
    window.addEventListener("audioTrackChanged", handleTrackChange);
    
    let frameId: number;
    const updateScroll = () => {
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.08;
      setDisplayScroll(currentScroll.current);
      
      // Audio Visualizer Update
      if (visRef.current) {
        const audio = AudioController.getInstance();
        const data = audio.getFrequencyData();
        const canvas = visRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          let intensity = 0;
          if (data && data.length > 0 && !audio.isMuted) {
             let sum = 0;
             // Focus on the lower 16 bands (bass & low-mids) for reactivity
             for(let i = 0; i < 16; i++) sum += data[i];
             intensity = sum / (16 * 255);
             
             // Keep the color strictly tied to the BGM theme color, no rainbow hue shifts
             canvas.style.filter = `drop-shadow(0 0 ${4 + intensity * 8}px ${theme.primary || "#00f0ff"})`;
          } else {
             canvas.style.filter = `drop-shadow(0 0 4px ${theme.primary || "#00f0ff"}40)`;
          }

          const t = Date.now() * 0.002;
          const midY = canvas.height / 2;
          const w = canvas.width;
          
          // Draw 3 overlapping waves for a liquid fluid effect
          for (let layer = 0; layer < 3; layer++) {
            ctx.beginPath();
            ctx.moveTo(0, midY);
            
            // Smoother amplitude multiplier so it doesn't jump too aggressively
            const amplitude = (2 + intensity * 18) * (1 - layer * 0.2);
            const frequency = 0.05 + layer * 0.02;
            const speed = t * (1 + layer * 0.3 + intensity * 0.8); // Gentle speed modulation
            
            for (let x = 0; x <= w; x += 2) {
               // Taper the edges so the wave blends smoothly into a flat line at the ends
               const edgeTaper = Math.sin((x / w) * Math.PI); 
               const y = midY + Math.sin(x * frequency + speed) * Math.cos(x * 0.01 - speed * 0.5) * amplitude * edgeTaper;
               ctx.lineTo(x, y);
            }
            
            ctx.strokeStyle = theme.primary || "#00f0ff";
            ctx.lineWidth = 1.5 - layer * 0.4;
            ctx.globalAlpha = 0.8 - layer * 0.25;
            if (layer === 0) {
              ctx.shadowColor = theme.primary || "#00f0ff";
              ctx.shadowBlur = intensity > 0.05 ? 10 : 3;
            } else {
              ctx.shadowBlur = 0;
            }
            ctx.stroke();
          }
          ctx.globalAlpha = 1.0;
        }
      }

      frameId = requestAnimationFrame(updateScroll);
    };
    frameId = requestAnimationFrame(updateScroll);
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("navTo", handleNav as any);
      window.removeEventListener("toggleContact", handleToggleContact);
      window.removeEventListener("toggleAudio", handleToggleAudio);
      window.removeEventListener("audioTrackChanged", handleTrackChange);
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
            fontSize: "clamp(0.65rem, 1.2vw, 0.9rem)",
            letterSpacing: "0.6em",
            color: "rgba(255,255,255,0.8)",
            marginBottom: "0.5rem",
            fontWeight: 500,
            animation: "fadeInUp 1s ease 0.2s both",
            fontFamily: "'Inter', sans-serif"
          }}>
            INNOVATION BEYOND LIMITS
          </div>
          <div style={{
            fontSize: "clamp(0.45rem, 0.8vw, 0.6rem)",
            letterSpacing: "0.4em",
            color: "rgba(255,255,255,0.4)",
            marginBottom: "1.5rem",
            fontWeight: 400,
            animation: "fadeInUp 1s ease 0.4s both",
            fontFamily: "'Inter', sans-serif"
          }}>
            ADVANCED ENGINEERING SOLUTIONS
          </div>
          <div style={{ animation: "fadeInUp 1.5s ease 0.6s both" }}>
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
                filter: "drop-shadow(0 0 30px rgba(255,255,255,0.15))",
                marginTop: "1rem",
                transform: "translateX(8%)",
              }}
            />
          </div>
        </div>

        {/* Explore Button */}
        <div style={{
          position: "absolute",
          bottom: "12%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          animation: "fadeInUp 1.5s ease 1.2s both",
          pointerEvents: "auto",
        }}>
          <button 
            onClick={() => {
              window.dispatchEvent(new CustomEvent("navTo", { detail: 1 }));
            }}
            style={{
              padding: "0.8rem 2.5rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              borderRadius: "30px",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            EXPLORE PROJECTS
          </button>
        </div>

        {/* Audio Visualizer & Track Switcher (Bottom Left) */}
        <div 
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            animation: "fadeInUp 1.5s ease 1.5s both",
            pointerEvents: "auto",
          }}
        >
          {/* Track Switcher */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[1, 2, 3].map((trackNum, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  AudioController.getInstance().switchTrack(i);
                }}
                style={{
                  background: currentTrack === i ? "rgba(255,255,255,0.2)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: currentTrack === i ? "#fff" : "rgba(255,255,255,0.5)",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "0.5rem",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
                onMouseOut={(e) => e.currentTarget.style.color = currentTrack === i ? "#fff" : "rgba(255,255,255,0.5)"}
              >
                BGM {trackNum}
              </button>
            ))}
          </div>

          {/* Visualizer & Audio Toggle */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "30px", pointerEvents: "auto" }}>
            <button
              onClick={handleAudioToggle}
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                color: audioMuted ? "rgba(255,255,255,0.4)" : theme.primary,
                marginRight: "1rem",
                marginBottom: "2px",
                fontFamily: "'Inter', sans-serif",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                transition: "all 0.3s ease",
                backgroundColor: audioMuted ? "transparent" : `${theme.primary}22`,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = audioMuted ? "rgba(255,255,255,0.4)" : (theme.primary || "#fff");
                e.currentTarget.style.backgroundColor = audioMuted ? "transparent" : `${theme.primary}22`;
              }}
            >
              SYSTEM AUDIO {audioMuted ? "OFF" : "ON"}
            </button>
            <canvas 
              ref={visRef} 
              width={140} 
              height={30} 
              style={{ pointerEvents: "none", filter: "drop-shadow(0 0 4px rgba(0,240,255,0.2))" }} 
            />
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
