export interface ProjectData {
  id: number;
  title: string;
  shortDesc: string;
  longDesc: string;
  techStack: string[];
  angle: number;
  scale: [number, number, number];
  link: string;
  externalLink?: string;
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
    link: "/project/1",
    image: "/rj-glasses.png", // Keep the original for the first one
  },
  {
    id: 2,
    title: "AI EDUCATION ECOSYSTEM",
    shortDesc: "Empowering 400K+ Students",
    longDesc: "A massive, distributed educational platform. Turning complex technology into digestible, actionable knowledge for over 400,000 students across 21+ platforms worldwide.",
    techStack: ["Node.js", "Redis", "Next.js", "React"],
    angle: Math.PI / 3, // 60 degrees
    scale: [5, 3, 1],
    link: "/project/2",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop", // Cyberpunk desk
  },
  {
    id: 3,
    title: "MOD-CPU HARDWARE",
    shortDesc: "High-Performance Edge AI",
    longDesc: "A custom hardware solution designed to run AI models locally. Fast, entirely private, and completely offline-capable. No cloud required. Engineered for the future.",
    techStack: ["C++", "CUDA", "Embedded Systems"],
    angle: (Math.PI * 2) / 3, // 120 degrees
    scale: [3, 2, 1],
    link: "/project/3",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop", // Microchip
  },
  {
    id: 4,
    title: "CREATIVE DEVELOPMENT",
    shortDesc: "Next-Gen UI/UX Engineering",
    longDesc: "The internal design and engineering division of RJ Industries. We blend story, art, and cutting-edge web technologies to create immersive, award-winning digital experiences.",
    techStack: ["GLSL Shaders", "React Three Fiber", "Zustand"],
    angle: Math.PI, // 180 degrees
    scale: [4, 3, 1],
    link: "/project/4",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", // Abstract liquid
  },
  {
    id: 5,
    title: "MUMUKSHO GAME",
    shortDesc: "Cosmic Action Adventure Universe",
    longDesc: "An immersive gaming experience blending rich narrative lore, high-octane combat mechanics, and stunning visual worldbuilding. Discover the universe and play at mumukshogame.com.",
    techStack: ["Unreal Engine 5", "C++", "3D Shaders", "Game Physics"],
    angle: (Math.PI * 4) / 3, // 240 degrees
    scale: [5, 3, 1],
    link: "https://mumukshogame.com",
    externalLink: "https://mumukshogame.com",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop", // Futuristic gaming setup
  },
  {
    id: 6,
    title: "QUANTUM ENCRYPTION",
    shortDesc: "Unhackable Data Arrays",
    longDesc: "State-of-the-art quantum key distribution network. Protecting RJ Industries' intellectual property and providing government-grade security for our defense contractors.",
    techStack: ["Quantum Mechanics", "Rust", "Cryptography"],
    angle: (Math.PI * 5) / 3, // 300 degrees
    scale: [4, 3, 1],
    link: "/team",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop", // Matrix/Code
  }
];
