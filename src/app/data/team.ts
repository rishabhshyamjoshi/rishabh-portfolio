export interface TeamData {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  status: string;
  clearance: string;
  color: string;
  initials: string;
  linkedin: string;
  angle: number;
  scale: [number, number, number];
  image: string;
}

export const TEAM: TeamData[] = [
  {
    id: "AI-001", name: "Project Genesis", role: "Generative AI",
    bio: "Advanced multimodal generative model capable of synthesizing text, image, and audio in real-time.",
    skills: ["PyTorch", "Transformers", "CUDA"],
    status: "LIVE", clearance: "OMEGA", color: "#ff2200", initials: "PG",
    linkedin: "https://github.com",
    angle: 0,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "AI-002", name: "Neural Vision", role: "Computer Vision",
    bio: "Real-time object detection and spatial mapping system for autonomous drone navigation.",
    skills: ["OpenCV", "TensorFlow", "C++"],
    status: "BETA", clearance: "ALPHA", color: "#ffd700", initials: "NV", linkedin: "",
    angle: Math.PI / 3,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "AI-003", name: "Quantum Mind", role: "Quantum NLP",
    bio: "Experimental NLP model leveraging quantum circuit simulations for exponential parameter scaling.",
    skills: ["Qiskit", "Python", "NLP"],
    status: "ALPHA", clearance: "ALPHA", color: "#7c3aed", initials: "QM", linkedin: "",
    angle: (Math.PI / 3) * 2,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "AI-004", name: "Auto Agent", role: "Autonomous Agents",
    bio: "Self-healing distributed agent framework for automated code writing and infrastructure maintenance.",
    skills: ["LangChain", "Node.js", "Docker"],
    status: "LIVE", clearance: "BETA", color: "#10b981", initials: "AA", linkedin: "",
    angle: Math.PI,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "AI-005", name: "Cyber Shield", role: "Predictive Security",
    bio: "AI-driven threat detection system analyzing network traffic anomalies with 99.9% accuracy.",
    skills: ["Scikit-Learn", "Go", "AWS"],
    status: "TESTING", clearance: "BETA", color: "#ffd700", initials: "CS", linkedin: "",
    angle: (Math.PI / 3) * 4,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "AI-006", name: "Synth Wave", role: "Audio Generation",
    bio: "Zero-shot text-to-audio model capable of generating studio-quality music and sound effects.",
    skills: ["JAX", "Python", "WebAudio"],
    status: "LIVE", clearance: "BETA", color: "#ff2200", initials: "SW", linkedin: "",
    angle: (Math.PI / 3) * 5,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
  },
];
