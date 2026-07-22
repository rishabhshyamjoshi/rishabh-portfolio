"use client";

import { useEffect, useRef, useState } from "react";

const MENU_ITEMS = [
  { label: "HOME", angle: -90, action: () => window.dispatchEvent(new CustomEvent("navTo", { detail: 0 })) },
  { label: "PRODUCTS", angle: -30, action: () => window.dispatchEvent(new CustomEvent("navTo", { detail: 1 })) },
  { label: "TEAM", angle: 30, action: () => window.dispatchEvent(new CustomEvent("navTo", { detail: 2 })) },
  { label: "AUDIO", angle: 90, action: () => window.dispatchEvent(new CustomEvent("toggleAudio")) },
  { label: "CONTACT", angle: 150, action: () => window.dispatchEvent(new CustomEvent("toggleContact")) },
  { label: "ACADEMY", angle: 210, action: () => window.dispatchEvent(new CustomEvent("navTo", { detail: 3 })) },
];

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const lockedPos = useRef({ x: 0, y: 0 });
  
  const numPoints = 40;
  const numStrands = 4;
  const mouse = useRef({ x: typeof window !== "undefined" ? window.innerWidth / 2 : 0, y: typeof window !== "undefined" ? window.innerHeight / 2 : 0 });
  const points = useRef(Array.from({ length: numPoints }, () => ({ x: mouse.current.x, y: mouse.current.y })));
  
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      lockedPos.current = { x: e.clientX, y: e.clientY };
      setMenuOpen(prev => {
        if (!prev) setSelectedIndex(null);
        return !prev;
      });
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      setSelectedIndex(null);
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      setSelectedIndex(prev => {
        if (e.deltaY > 0) return prev === null ? 0 : (prev + 1) % MENU_ITEMS.length;
        if (e.deltaY < 0) return prev === null ? MENU_ITEMS.length - 1 : (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
        return prev;
      });
    };
    
    const handleClick = (e: MouseEvent) => {
      if (selectedIndex !== null) {
        MENU_ITEMS[selectedIndex].action();
      }
      setMenuOpen(false);
    };

    window.addEventListener("wheel", handleWheel, { capture: true, passive: false });
    window.addEventListener("click", handleClick);
    
    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true } as any);
      window.removeEventListener("click", handleClick);
    };
  }, [menuOpen, selectedIndex]);
  
  if (points.current.length !== numPoints) {
    points.current = Array.from({ length: numPoints }, () => ({ x: mouse.current.x, y: mouse.current.y }));
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      const target = e.target as HTMLElement;
      setHovering(!!(target && typeof target.closest === "function" && (
        target.tagName?.toLowerCase() === "button" ||
        target.tagName?.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".interactive") ||
        target.closest("[data-hover]")
      )));
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    
    let rafId: number;
    let time = 0;

    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const pts = points.current;
      pts[0].x = mouse.current.x;
      pts[0].y = mouse.current.y;
      
      const lerp = hovering ? 0.4 : 0.3;
      for (let i = 1; i < numPoints; i++) {
        if (!pts[i] || !pts[i-1]) continue;
        pts[i].x += (pts[i - 1].x - pts[i].x) * lerp;
        pts[i].y += (pts[i - 1].y - pts[i].y) * lerp;
      }
      
      const baseColor = "rgba(255, 255, 255,";
      const glowColor = "#ffffff";
      
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 12;
      ctx.shadowColor = glowColor;

      for (let s = 0; s < numStrands; s++) {
        ctx.beginPath();
        const strandPts = [];
        
        for (let i = 0; i < numPoints; i++) {
          const p = pts[i];
          let nx = 0, ny = 0;
          if (i < numPoints - 1) {
            const dx = pts[i+1].x - p.x;
            const dy = pts[i+1].y - p.y;
            const len = Math.sqrt(dx*dx + dy*dy) || 1;
            nx = -dy / len;
            ny = dx / len;
          }
          
          const progress = i / numPoints;
          const widthTaper = Math.sin(progress * Math.PI);
          const phase = (s / numStrands) * Math.PI * 2;
          const wave = Math.sin(time * 2 + progress * 8 + phase);
          const amplitude = hovering ? 30 : 15;
          
          strandPts.push({ x: p.x + nx * wave * widthTaper * amplitude, y: p.y + ny * wave * widthTaper * amplitude });
        }
        
        ctx.moveTo(strandPts[0].x, strandPts[0].y);
        for (let i = 1; i < numPoints - 1; i++) {
          const p0 = strandPts[i];
          const p1 = strandPts[i + 1];
          ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
        }
        
        const gradient = ctx.createLinearGradient(pts[numPoints - 1].x, pts[numPoints - 1].y, pts[0].x, pts[0].y);
        gradient.addColorStop(0, `${baseColor} 0)`);
        gradient.addColorStop(0.5, `${baseColor} 0.3)`);
        gradient.addColorStop(1, `${baseColor} 0.8)`);
        
        ctx.lineWidth = hovering ? 3 : 1.5;
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }

      if (hudRef.current) {
        hudRef.current.style.transform = `translate(${lockedPos.current.x}px, ${lockedPos.current.y}px)`;
      }
      
      rafId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [hovering, menuOpen]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          pointerEvents: "none", zIndex: 999998, position: "fixed", inset: 0,
          width: "100vw", height: "100vh", mixBlendMode: "difference",
        }}
      />

      <div
        ref={hudRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: 0, height: 0,
          pointerEvents: menuOpen ? "auto" : "none",
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Nebula-Pulse Menu Container */}
      <div
        ref={hudRef}
        className="nebula-menu"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          pointerEvents: menuOpen ? "auto" : "none",
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Central Nebula Core */}
        <div className="nebula-core" />

        {/* Menu Items */}
        <div className="nebula-items">
          {MENU_ITEMS.map((item, i) => {
            const rad = (item.angle * Math.PI) / 180;
            const radius = menuOpen ? 115 : 0;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const isSelected = selectedIndex === i;

            return (
              <button
                key={i}
                className="nebula-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  item.action();
                  setMenuOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(i)}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isSelected ? 1.15 : 1})`,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      {/* Inline styles for nebula theme */}
      <style jsx>{`
        .nebula-menu {
          /* optional background for full-screen nebula */
          /* Could add a subtle gradient here if desired */
        }
        .nebula-core {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(${menuOpen ? 1 : 0});
          opacity: ${menuOpen ? 1 : 0};
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255,255,255,0.1),
            rgba(255,0,150,0.08),
            transparent 60%
          );
          box-shadow: 0 0 60px rgba(255,0,150,0.15), inset 0 0 40px rgba(255,255,255,0.05);
          filter: blur(5px);
        }
        .nebula-items {
          position: absolute;
          width: 300px;
          height: 300px;
          transform: translate(-50%, -50%);
          pointer-events: ${menuOpen ? "auto" : "none"};
        }
        .nebula-btn {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8);
          backdrop-filter: blur(12px);
          border-radius: 40px;
          padding: 12px 20px;
          font-size: 0.65rem;
          font-family: var(--font-jakarta), sans-serif;
          font-weight: 600;
          letter-spacing: 0.15em;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: transform 0.8s cubic-bezier(0.34,1.56,0.64,1),
                      background 0.3s ease,
                      border 0.3s ease,
                      color 0.3s ease,
                      box-shadow 0.3s ease,
                      opacity 0.4s ease;
          opacity: ${menuOpen ? 1 : 0};
          transition-delay: ${menuOpen ? "calc(var(--i) * 0.06s)" : "0s"};
        }
        .nebula-btn:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.6);
          color: #fff;
          box-shadow: 0 10px 30px rgba(255,0,150,0.3), inset 0 1px 0 rgba(255,255,255,0.5);
        }
        .nebula-btn::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
          animation: nebulaPulse 3s infinite ease-in-out;
          pointer-events: none;
        }
        @keyframes nebulaPulse {
          0%,100% { transform:scale(1); opacity:.6; }
          50% { transform:scale(1.12); opacity:1; }
        }
      `}</style>
    </>
  );
}
