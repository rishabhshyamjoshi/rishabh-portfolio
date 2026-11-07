"use client";

import { useEffect, useState } from "react";
import { useThemeColors } from "../hooks/useThemeColors";

export default function VideoModal({ onClose, url, title, subtitle, videoSrc }: { onClose: () => void, url: string, title: string, subtitle: string, videoSrc: string }) {
  const theme = useThemeColors();
  const [showRipples, setShowRipples] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setShowRipples(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999, // Cover entire screen
      backgroundColor: '#000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Clean Portal Expansion Transition */}
      <style>{`
        @keyframes portalExpand {
          0% {
            clip-path: circle(0% at center);
          }
          100% {
            clip-path: circle(150% at center);
          }
        }
      `}</style>

      {/* Background Video with Clean Nostalgic Filter */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(3px) sepia(0.2) contrast(1.1) brightness(0.6)',
          zIndex: 1,
          animation: 'portalExpand 1.5s cubic-bezier(0.7, 0, 0.3, 1) forwards',
          transform: 'scale(1.02)'
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        opacity: showRipples ? 0 : 1,
        transition: 'opacity 1.5s ease-in-out 1s', // Fade in UI after splash settles
        pointerEvents: showRipples ? 'none' : 'auto'
      }}>
        <h1 style={{
          color: '#fff',
          fontFamily: 'var(--font-orbitron)',
          fontSize: '3.5rem',
          letterSpacing: '0.15em',
          marginBottom: '0.5rem',
          textShadow: `0 0 20px ${theme.primary}, 0 0 40px rgba(0,0,0,0.8)`,
          textAlign: 'center'
        }}>
          {title.toUpperCase()}
        </h1>
        <p style={{
          color: theme.secondary,
          fontFamily: 'var(--font-space)',
          fontSize: '1rem',
          letterSpacing: '0.2em',
          marginBottom: '3rem',
          textTransform: 'uppercase',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          textAlign: 'center'
        }}>
          {subtitle}
        </p>

        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '1.2rem 3rem',
            background: 'rgba(0,0,0,0.6)',
            border: `1px solid ${theme.primary}`,
            color: '#fff',
            fontFamily: 'var(--font-orbitron)',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            boxShadow: `0 0 20px rgba(0,0,0,0.5)`,
            fontSize: '0.9rem',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.primary;
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.boxShadow = `0 0 30px ${theme.primary}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.boxShadow = `0 0 20px rgba(0,0,0,0.5)`;
          }}
        >
          VISIT SITE ↗
        </a>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          zIndex: 30,
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          color: '#fff',
          fontFamily: 'var(--font-space)',
          fontSize: '0.8rem',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          backdropFilter: 'blur(5px)',
          opacity: showRipples ? 0 : 1,
          transition: 'all 0.3s ease 1s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
        }}
      >
        ✕ CLOSE
      </button>

      {/* Global styles for splash keyframes */}
      <style>{`
        @keyframes splashRing {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
            border-width: 10px;
          }
          100% {
            width: 100vw;
            height: 100vw;
            opacity: 0;
            border-width: 1px;
          }
        }
      `}</style>
    </div>
  );
}
