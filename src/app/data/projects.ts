export interface ProjectData {
  id: number;
  title: string;
  shortDesc: string;
  longDesc: string;
  techStack: string[];
  angle: number;
  scale: [number, number, number];
  link: string;
  image: string;
}

export const PROJECTS: ProjectData[] = [
  {
    id: 1,
    title: "RJ.GLASS GEN-ONE",
    shortDesc: "Consumer AR / K.I.N.E.T.I.C. Division",
    longDesc: "The flagship consumer AR product from RJ Industries. Powered by the proprietary RJ-A1 Chip, these glasses deliver high-performance, private, offline-capable AI models directly to your visual field.",
    techStack: ["WebGL", "RJ-A1 Chip", "React", "WebSockets"],
    angle: 0,
    scale: [4, 3, 1],
    link: "/product",
    image: "/rj-glasses.png", // Keep the original for the first one
  },
  {
    id: 2,
    title: "AI EDUCATION ECOSYSTEM",
    shortDesc: "Empowering 400K+ Students",
    longDesc: "A massive, distributed educational platform. Turning complex technology into digestible, actionable knowledge for over 400,000 students across 21+ platforms worldwide.",
    techStack: ["Node.js", "Redis", "Next.js", "React"],
    angle: Math.PI / 2,
    scale: [5, 3, 1],
    link: "/team",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop", // Cyberpunk desk
  },
  {
    id: 3,
    title: "MOD-CPU HARDWARE",
    shortDesc: "High-Performance Edge AI",
    longDesc: "A custom hardware solution designed to run AI models locally. Fast, entirely private, and completely offline-capable. No cloud required. Engineered for the future.",
    techStack: ["C++", "CUDA", "Embedded Systems"],
    angle: Math.PI,
    scale: [3, 2, 1],
    link: "/product",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop", // Microchip
  },
  {
    id: 4,
    title: "CREATIVE DEVELOPMENT",
    shortDesc: "Next-Gen UI/UX Engineering",
    longDesc: "The internal design and engineering division of RJ Industries. We blend story, art, and cutting-edge web technologies to create immersive, award-winning digital experiences.",
    techStack: ["GLSL Shaders", "React Three Fiber", "Zustand"],
    angle: Math.PI * 1.5,
    scale: [4, 3, 1],
    link: "/team",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", // Abstract liquid
  },
];
