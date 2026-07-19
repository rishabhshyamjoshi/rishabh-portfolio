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
      
      const baseColor = "rgba(212, 175, 55,"; 
      const glowColor = "rgba(212, 175, 55, 0.4)";
      
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 15;
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
        <div style={{
          position: "absolute",
          width: "300px", height: "300px",
          borderRadius: "50%",
          transform: `translate(-50%, -50%) scale(${menuOpen ? 1 : 0.4})`,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)",
          border: menuOpen ? "1px solid rgba(212, 175, 55, 0.15)" : "1px solid transparent",
          boxShadow: menuOpen ? "inset 0 0 40px rgba(212, 175, 55, 0.05)" : "none",
        }}>
          {/* Liquid Highlight Blob */}
          <div style={{
            position: "absolute",
            width: "90px",
            height: "36px",
            background: "rgba(212, 175, 55, 0.2)",
            border: "1px solid #d4af37",
            borderRadius: "30px",
            boxShadow: "0 0 20px rgba(212, 175, 55, 0.2)",
            pointerEvents: "none",
            transition: "all 0.4s cubic-bezier(0.25, 1, 0.3, 1)",
            opacity: selectedIndex !== null && menuOpen ? 1 : 0,
            left: selectedIndex !== null ? `calc(50% + ${Math.cos((MENU_ITEMS[selectedIndex].angle * Math.PI) / 180) * 110}px)` : "50%",
            top: selectedIndex !== null ? `calc(50% + ${Math.sin((MENU_ITEMS[selectedIndex].angle * Math.PI) / 180) * 110}px)` : "50%",
            transform: "translate(-50%, -50%) scale(1.05)",
            zIndex: 0,
          }} />

          {/* Radial Items */}
          {MENU_ITEMS.map((item, i) => {
            const rad = (item.angle * Math.PI) / 180;
            const radius = 110; 
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const isSelected = selectedIndex === i;

            return (
              <button
                key={i}
                className="radial-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  item.action();
                  setMenuOpen(false);
                }}
                onMouseEnter={() => setSelectedIndex(i)}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  width: "90px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `translate(-50%, -50%) scale(${isSelected ? 1.05 : 1})`,
                  background: isSelected ? "transparent" : "rgba(10, 10, 12, 0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid",
                  borderColor: isSelected ? "transparent" : "rgba(212, 175, 55, 0.15)",
                  color: isSelected ? "#d4af37" : "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  borderRadius: "30px",
                  cursor: "pointer",
                  transition: "color 0.3s ease, background 0.3s ease",
                  opacity: menuOpen ? 1 : 0,
                  transitionDelay: `${menuOpen ? i * 0.04 : 0}s`,
                  zIndex: 1,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
