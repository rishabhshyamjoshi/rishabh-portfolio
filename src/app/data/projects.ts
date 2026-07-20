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
    image: "/rj-glasses.png",
  },
  {
    id: 2,
    title: "NEURAL LINK INTERFACE",
    shortDesc: "Direct Brain-Computer Connectivity",
    longDesc: "Advanced neural decoding algorithms enabling seamless, thought-to-digital execution without invasive hardware.",
    techStack: ["Python", "TensorFlow", "BCI API"],
    angle: Math.PI / 4,
    scale: [4, 3, 1],
    link: "/product",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop", 
  },
  {
    id: 3,
    title: "AI EDUCATION ECOSYSTEM",
    shortDesc: "Empowering 400K+ Students",
    longDesc: "A massive, distributed educational platform. Turning complex technology into digestible, actionable knowledge for over 400,000 students across 21+ platforms worldwide.",
    techStack: ["Node.js", "Redis", "Next.js", "React"],
    angle: Math.PI / 2,
    scale: [5, 3, 1],
    link: "/team",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop", 
  },
  {
    id: 4,
    title: "QUANTUM CRYPTO-VAULT",
    shortDesc: "Next-Generation Data Security",
    longDesc: "Military-grade encryption leveraging post-quantum cryptographic primitives to secure enterprise communications.",
    techStack: ["Rust", "Cryptography", "WebAssembly"],
    angle: Math.PI * 0.75,
    scale: [4, 3, 1],
    link: "/product",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop", 
  },
  {
    id: 5,
    title: "MOD-CPU HARDWARE",
    shortDesc: "High-Performance Edge AI",
    longDesc: "A custom hardware solution designed to run AI models locally. Fast, entirely private, and completely offline-capable. No cloud required. Engineered for the future.",
    techStack: ["C++", "CUDA", "Embedded Systems"],
    angle: Math.PI,
    scale: [3, 2, 1],
    link: "/product",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop", 
  },
  {
    id: 6,
    title: "AUTONOMOUS DRONE SWARM",
    shortDesc: "Tactical Aerial Robotics",
    longDesc: "Synchronized UAVs powered by decentralized AI. Designed for search-and-rescue, tactical reconnaissance, and environmental mapping.",
    techStack: ["ROS2", "Computer Vision", "Python"],
    angle: Math.PI * 1.25,
    scale: [4, 3, 1],
    link: "/product",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000&auto=format&fit=crop", 
  },
  {
    id: 7,
    title: "CREATIVE DEVELOPMENT",
    shortDesc: "Next-Gen UI/UX Engineering",
    longDesc: "The internal design and engineering division of RJ Industries. We blend story, art, and cutting-edge web technologies to create immersive, award-winning digital experiences.",
    techStack: ["GLSL Shaders", "React Three Fiber", "Zustand"],
    angle: Math.PI * 1.5,
    scale: [4, 3, 1],
    link: "/team",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", 
  },
  {
    id: 8,
    title: "EXO-SUIT HYDRAULICS",
    shortDesc: "Biomechatronic Enhancements",
    longDesc: "Advanced robotic exoskeletons designed for heavy industrial lifting and military logistics, seamlessly translating human intent into mechanical force.",
    techStack: ["SolidWorks", "C++", "Control Systems"],
    angle: Math.PI * 1.75,
    scale: [4, 3, 1],
    link: "/product",
    image: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?q=80&w=1000&auto=format&fit=crop", 
  },
];
