"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovering, setHovering] = useState(false);
  
  // Optimized for faster loading: Reduced points and strands
  const numPoints = 40;
  const numStrands = 4;
  const mouse = useRef({ x: -100, y: -100 });
  const points = useRef(Array.from({ length: numPoints }, () => ({ x: -100, y: -100 })));
  
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
        if (!pts[i] || !pts[i-1]) continue; // Guard against hot-reload undefined points
        pts[i].x += (pts[i - 1].x - pts[i].x) * lerp;
        pts[i].y += (pts[i - 1].y - pts[i].y) * lerp;
      }
      
      // STATIC WHITE COLOR (Normal)
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
      
      rafId = requestAnimationFrame(animate);
    };
    
    // Initialize exactly in the center of the screen
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    mouse.current = { x: startX, y: startY };
    points.current.forEach(p => { p.x = startX; p.y = startY; });
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [hovering]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        pointerEvents: "none", zIndex: 999999, position: "fixed", inset: 0,
        width: "100vw", height: "100vh", mixBlendMode: "difference",
      }}
    />
  );
}
