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
    title: "KRIPA DESIGN STUDIO",
    shortDesc: "Interior & Architectural Studio",
    longDesc: "A complete digital showcase engineered for Kripa Design Studio. Demonstrating bespoke interior spaces, architectural aesthetics, and refined contemporary design portfolios.",
    techStack: ["Next.js", "React", "Three.js", "Tailwind CSS"],
    angle: (Math.PI * 2) / 7,
    scale: [5, 3, 1],
    link: "https://kripa-delta.vercel.app/",
    externalLink: "https://kripa-delta.vercel.app/",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "RENDERING DAYLIGHT",
    shortDesc: "Web-Based Graphics Experiment",
    longDesc: "An interactive graphics engine exploring real-time rendering, light scattering, and complex shading techniques directly in the browser.",
    techStack: ["WebGL", "GLSL", "Shaders"],
    angle: (Math.PI * 4) / 7,
    scale: [3, 2, 1],
    link: "https://rishabhshyamjoshi.github.io/Rendering-daylight/",
    externalLink: "https://rishabhshyamjoshi.github.io/Rendering-daylight/",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "EATSIFY",
    shortDesc: "Culinary Ordering & Discovery Platform",
    longDesc: "A next-generation digital food ordering and dining discovery platform. Engineered for seamless menu navigation, rapid checkout workflows, and modern gastronomy discovery.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    angle: (Math.PI * 6) / 7,
    scale: [4, 3, 1],
    link: "https://eatsify.vercel.app/",
    externalLink: "https://eatsify.vercel.app/",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "MUMUKSHU GAME",
    shortDesc: "Cosmic Action Adventure Universe",
    longDesc: "An immersive gaming experience blending rich narrative lore, high-octane combat mechanics, and stunning visual worldbuilding. Discover the universe and play at www.mumukshugame.com.",
    techStack: ["Unreal Engine 5", "C++", "3D Shaders", "Game Physics"],
    angle: (Math.PI * 8) / 7,
    scale: [5, 3, 1],
    link: "https://www.mumukshugame.com",
    externalLink: "https://www.mumukshugame.com",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "QUANTUM ENCRYPTION",
    shortDesc: "Unhackable Data Arrays",
    longDesc: "State-of-the-art quantum key distribution network. Protecting RJ Industries' intellectual property and providing government-grade security for our defense contractors.",
    techStack: ["Quantum Mechanics", "Rust", "Cryptography"],
    angle: (Math.PI * 10) / 7,
    scale: [4, 3, 1],
    link: "/team",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "RJ INDUSTRIES",
    shortDesc: "Sovereign Systems & Defense Portal",
    longDesc: "The official flagship portal of RJ Industries (rjindustries.dev). Architecting sovereign defense platforms, orbital aerospace vehicles, mechanical systems, and neural hardware.",
    techStack: ["Next.js", "Three.js", "WebGL", "GLSL Shaders"],
    angle: (Math.PI * 12) / 7,
    scale: [5, 3, 1],
    link: "https://rjindustries.dev",
    externalLink: "https://rjindustries.dev",
    image: "/og-image.png",
  }
];
