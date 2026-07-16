"use client";

import { useEffect, useRef } from "react";
import { AudioController } from "../utils/AudioController";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMove = (e: MouseEvent) => {
      pos.current.targetX = e.clientX;
      pos.current.targetY = e.clientY;
    };

    const onEnterHover = () => {
      cursor.classList.add("hovering");
      try { AudioController.getInstance().playHoverSound(); } catch (e) {}
    };
    const onLeaveHover = () => cursor.classList.remove("hovering");
    
    const onClick = () => {
      try { AudioController.getInstance().playClickSound(); } catch (e) {}
    };

    const animate = () => {
      pos.current.x += (pos.current.targetX - pos.current.x) * 0.15;
      pos.current.y += (pos.current.targetY - pos.current.y) * 0.15;
      cursor.style.left = `${pos.current.x}px`;
      cursor.style.top = `${pos.current.y}px`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    animate();

    // Add hover detection to interactive elements
    const addHoverListeners = () => {
      const targets = document.querySelectorAll("a, button, .project-item, .nav-pill, [data-hover]");
      targets.forEach((el) => {
        // Prevent duplicate listeners
        el.removeEventListener("mouseenter", onEnterHover);
        el.removeEventListener("mouseleave", onLeaveHover);
        el.removeEventListener("click", onClick);
        
        el.addEventListener("mouseenter", onEnterHover);
        el.addEventListener("mouseleave", onLeaveHover);
        el.addEventListener("click", onClick);
      });
    };

    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
}
