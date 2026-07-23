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
    title: "K.I.N.E.T.I.C GLASSES",
    shortDesc: "Consumer AR / K.I.N.E.T.I.C. Division",
    longDesc: "The flagship consumer AR product from RJ Industries. Powered by the proprietary RJ-A1 Chip, these glasses deliver high-performance, private, offline-capable AI models directly to your visual field.",
    techStack: ["WebGL", "RJ-A1 Chip", "React", "WebSockets"],
    angle: 0,
    scale: [4, 3, 1],
    link: "/project/1",
    image: "/rj-glasses.png",
  },
  {
    id: 2,
    title: "NAM EAS PORTFOLIO",
    shortDesc: "Professional Portfolio Website",
    longDesc: "A complete portfolio website engineered for performance and immersive user experience. Discover the work and capabilities of NAM EAS.",
    techStack: ["React", "WebGL", "Three.js"],
    angle: Math.PI / 3, // 60 degrees
    scale: [5, 3, 1],
    link: "https://rj01.netlify.app",
    externalLink: "https://rj01.netlify.app",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop", 
  },
  {
    id: 3,
    title: "RENDERING DAYLIGHT",
    shortDesc: "Web-Based Graphics Experiment",
    longDesc: "An interactive graphics engine exploring real-time rendering, light scattering, and complex shading techniques directly in the browser.",
    techStack: ["WebGL", "GLSL", "Shaders"],
    angle: (Math.PI * 2) / 3, // 120 degrees
    scale: [3, 2, 1],
    link: "https://rishabhshyamjoshi.github.io/Rendering-daylight/",
    externalLink: "https://rishabhshyamjoshi.github.io/Rendering-daylight/",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop", 
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
    title: "MUMUKSHU GAME",
    shortDesc: "Cosmic Action Adventure Universe",
    longDesc: "An immersive gaming experience blending rich narrative lore, high-octane combat mechanics, and stunning visual worldbuilding. Discover the universe and play at www.mumukshugame.com.",
    techStack: ["Unreal Engine 5", "C++", "3D Shaders", "Game Physics"],
    angle: (Math.PI * 4) / 3, // 240 degrees
    scale: [5, 3, 1],
    link: "https://www.mumukshugame.com",
    externalLink: "https://www.mumukshugame.com",
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
