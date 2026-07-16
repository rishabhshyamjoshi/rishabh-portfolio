"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const MENU_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const close = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* ── Fixed top bar ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 600,
          height: "var(--nav-height)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.5rem, 4vw, 3rem)",
          transition: "background 0.6s, border-color 0.6s",
          background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(30px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(30px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
        }}
      >
        {/* Logo / Brand mark */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }} data-hover>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            ACTIVE THEORY
          </span>
        </Link>

        {/* Right side: pill links + menu toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Desktop pills */}
          <div className="desktop-links" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {MENU_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="nav-pill">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="menu-btn"
            aria-label="Toggle menu"
            data-hover
            style={{
              display: "none",
              background: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "100px",
              padding: "0.5rem 0.8rem",
              cursor: "none",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {menuOpen ? "CLOSE" : "MENU"}
            </span>
          </button>
        </div>
      </nav>

      {/* ── Full-screen menu overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 590,
          background: "rgba(0,0,0,0.97)",
          backdropFilter: "blur(60px)",
          WebkitBackdropFilter: "blur(60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          transition: "opacity 0.5s ease",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(2rem, 5vh, 3.5rem)" }}>
          {MENU_LINKS.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={close}
              data-hover
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "clamp(1.5rem, 5vw, 3rem)",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms, color 0.3s`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(30px)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; }}
            >
              {link.label}
            </Link>
          ))}

          {/* Footer info in menu */}
          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              opacity: menuOpen ? 1 : 0,
              transition: "opacity 0.5s ease 0.4s",
            }}
          >
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
              Creative Digital Experiences
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.15)" }}>
              EST. 2012
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
