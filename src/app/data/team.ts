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
    id: "RJ-001", name: "Rishabh Joshi", role: "Founder & Lead Educator",
    bio: "Founder of RJ Industries. AI educator, creative developer, and the architect behind 400K+ students.",
    skills: ["AI/ML", "UI/UX Design", "Web Dev"],
    status: "ONLINE", clearance: "OMEGA", color: "#ff2200", initials: "RJ",
    linkedin: "https://linkedin.com",
    angle: 0,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "AK-002", name: "Arjun Kapoor", role: "Lead Full-Stack Developer",
    bio: "Full-stack engineer with a passion for blazing-fast web experiences.",
    skills: ["React", "Next.js", "TypeScript"],
    status: "ONLINE", clearance: "ALPHA", color: "#ffd700", initials: "AK", linkedin: "",
    angle: Math.PI / 3,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "PS-003", name: "Priya Sharma", role: "Senior UI/UX Designer",
    bio: "Pixel-perfect Figma wizard. Takes wireframes from rough sketches to production-grade design systems.",
    skills: ["Figma", "Design Systems", "Prototyping"],
    status: "ONLINE", clearance: "ALPHA", color: "#7c3aed", initials: "PS", linkedin: "",
    angle: (Math.PI / 3) * 2,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "RN-004", name: "Rohit Nair", role: "AI Automation Engineer",
    bio: "Builds autonomous pipelines, n8n workflows, LangChain agents.",
    skills: ["n8n", "LangChain", "Python"],
    status: "ONLINE", clearance: "BETA", color: "#10b981", initials: "RN", linkedin: "",
    angle: Math.PI,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "SM-005", name: "Sneha Mehta", role: "Content & Video Producer",
    bio: "Scripting to final cut. Turns raw ideas into compelling course content and viral social reels.",
    skills: ["Premiere Pro", "After Effects", "HeyGen"],
    status: "BUSY", clearance: "BETA", color: "#ffd700", initials: "SM", linkedin: "",
    angle: (Math.PI / 3) * 4,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "VR-006", name: "Vikram Rao", role: "Growth & Brand Strategist",
    bio: "LinkedIn growth hacker, newsletter architect, organic reach specialist.",
    skills: ["LinkedIn", "SEO", "Newsletters"],
    status: "ONLINE", clearance: "BETA", color: "#ff2200", initials: "VR", linkedin: "",
    angle: (Math.PI / 3) * 5,
    scale: [4, 3, 1],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
  },
];
