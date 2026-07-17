"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  
  const [hovering, setHovering] = useState(false);
  
  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      
      // Check if hovering over an interactive element
      const target = e.target as HTMLElement;
      if (
        target && typeof target.closest === "function" &&
        (
          target.tagName?.toLowerCase() === "button" ||
          target.tagName?.toLowerCase() === "a" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList?.contains("interactive") ||
          target.closest(".interactive")
        )
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    let rafId: number;
    const animate = () => {
      // Lerp for smooth magnetic trailing effect
      delayedMouse.current.x += (mouse.current.x - delayedMouse.current.x) * 0.15;
      delayedMouse.current.y += (mouse.current.y - delayedMouse.current.y) * 0.15;
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${delayedMouse.current.x}px, ${delayedMouse.current.y}px, 0)`;
      }
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }
      
      rafId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {/* The tiny precise dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "4px",
          height: "4px",
          background: "#fff",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          mixBlendMode: "difference"
        }}
      />
      {/* The glowing magnetic ring */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: hovering ? "50px" : "30px",
          height: hovering ? "50px" : "30px",
          border: hovering ? "1px solid rgba(0, 240, 255, 0.8)" : "1px solid rgba(255, 255, 255, 0.3)",
          backgroundColor: hovering ? "rgba(0, 240, 255, 0.1)" : "transparent",
          boxShadow: hovering ? "0 0 20px rgba(0,240,255,0.4)" : "none",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          marginLeft: hovering ? "-25px" : "-15px",
          marginTop: hovering ? "-25px" : "-15px",
          transition: "width 0.3s, height 0.3s, margin 0.3s, border-color 0.3s, background-color 0.3s, box-shadow 0.3s",
        }}
      />
    </>
  );
}
