# RJ Industries — Rishabh Joshi Portfolio

> Tony Stark meets AI Education. Built with Next.js 14 · Framer Motion · Tailwind CSS.

---

## Setup

```bash
npm install
```

### Extract your 192 frames
```bash
bash extract-frames.sh your-video.mp4
```
Outputs: `public/sequence/frame_000_delay-0_041s.webp` … `frame_191_delay-0_041s.webp`

### Logo
Your `logo.png` is already in `public/logo.png` ✅

### Run
```bash
npm run dev   # http://localhost:3000
npm run build # production build
```

---

## Pages

| Route   | Description |
|---------|-------------|
| `/`     | Hero scroll + canvas, about, services, timeline, courses, footer |
| `/team` | Full team roster with HUD cards + Join CTA |

---

## Structure

```
src/app/
├── layout.tsx            # Orbitron + Rajdhani fonts, HUD grid + scan line
├── globals.css           # Stark HUD variables, animations, utility classes
├── page.tsx              # Main page — shared heroRef
├── team/page.tsx         # Team roster page
└── components/
    ├── Navbar.tsx         # Transparent → frosted, RJ Industries logo
    ├── ScrollyCanvas.tsx  # 192-frame canvas, arc reactor loader
    ├── Overlay.tsx        # 4 scroll phases with HUD text
    ├── TagScroll.tsx      # Dual-row infinite marquee
    ├── AboutMeSplit.tsx   # Stats + skill bars + bio
    ├── ServicesGrid.tsx   # 6-card bento grid
    ├── JourneyTimeline.tsx # Alternating timeline
    ├── Courses.tsx        # 6 course cards with badges
    └── Footer.tsx         # 3-col footer with logo
```

---

## Customise

Update `Overlay.tsx` phases, `AboutMeSplit.tsx` bio & skills, `Courses.tsx` course list, `JourneyTimeline.tsx` milestones, and `Footer.tsx` socials with real links from linkedin.com/in/rishabh-shyam-joshi.

---

© 2026 Rishabh Joshi / RJ Industries
