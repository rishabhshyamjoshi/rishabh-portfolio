"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SequencePlayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(0);
  const totalFrames = 192; // 000 to 191
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const router = useRouter();

  // 1. Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const img = new window.Image();
      const frameIndex = i.toString().padStart(3, "0");
      img.src = `/sequence/frame_${frameIndex}_delay-0.041s.webp`;
      
      img.onload = () => {
        loadedCount++;
        setLoaded(Math.round((loadedCount / totalFrames) * 100));
      };
      
      images.push(img);
    }
    
    imagesRef.current = images;
  }, []);

  // 2. Draw loop based on virtual scroll
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentFrame = { current: 0 };
    const targetFrame = { current: 0 };

    // Handle Resize
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
      drawFrame(currentFrame.current);
    };
    
    const drawFrame = (frameIndex: number) => {
      const img = imagesRef.current[frameIndex];
      if (img && img.complete) {
        // object-fit: cover equivalent
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    let rafId: number;

    const animate = () => {
      targetFrame.current = Math.floor(progressRef.current * (totalFrames - 1));
      
      // Smooth lerping to target frame
      currentFrame.current += (targetFrame.current - currentFrame.current) * 0.1;
      
      drawFrame(Math.round(currentFrame.current));
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [loaded]);

  const handleWheel = (e: React.WheelEvent) => {
    // 1 scroll tick (deltaY ~ 100) * 0.0002 = 0.02 progress = ~4 frames out of 192.
    const delta = e.deltaY * 0.0002; 
    progressRef.current += delta;
    progressRef.current = Math.max(0, Math.min(1, progressRef.current));
    
    // Close threshold - if user scrolls significantly past 1
    if (progressRef.current >= 1 && e.deltaY > 50) {
      router.push("/"); // Route back to orbit
    }
  };

  return (
    <div className="w-full h-full relative group" onWheel={handleWheel}>
      {loaded < 100 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50 text-[#00f0ff] font-[var(--font-space)] tracking-widest text-sm">
          LOADING SEQUENCE [{loaded}%]
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block" 
      />
      {/* Overlay gradient so text remains readable over the video */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/80 via-[#020202]/20 to-transparent pointer-events-none" />
    </div>
  );
}
