import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/CustomCursor";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400","500","600","700","800","900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300","400","500","600","700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rjindustries.dev'),
  title: {
    default: "RJ Industries Dev | Aerospace, Defense, Mechanical & Large-Scale Software Engineering (rjindustries.dev)",
    template: "%s | RJ Industries (rjindustries.dev)"
  },
  description: "RJ Industries (rjindustries.dev) is an advanced multi-disciplinary conglomerate pioneering aerospace engineering, sovereign defense platforms, mechanical systems, and large-scale enterprise software and web development. Founded and led by Mechanical Engineer Rishabh Joshi (Rishabh Shyam Joshi).",
  keywords: [
    "rj industries dev",
    "rjindustries.dev",
    "rj industries",
    "RJ Industries",
    "RJ Industries Dev",
    "rjindustries",
    "Rishabh Joshi",
    "Rishabh Shyam Joshi",
    "Rishabh Shyam Joshi Mechanical Engineering",
    "Rishabh Joshi Mechanical Engineer",
    "mechanical engineering",
    "defense mechanical engineering",
    "aerospace engineering",
    "enterprise software development",
    "large-scale web development",
    "software engineering",
    "web development",
    "defense technology",
    "sovereign defense systems",
    "tactical defense",
    "spacecraft systems",
    "orbital launch architecture",
    "advanced manufacturing",
    "precision microelectronics",
    "high-density PCB fabrication",
    "electro-mechanical systems",
    "robotics and kinematics",
    "K.I.N.E.T.I.C Glasses",
    "RJ-A1 Chip",
    "RJ-A1 neural processor",
    "quantum encryption arrays",
    "autonomous cyber-physical systems",
    "deep tech conglomerate"
  ],
  authors: [{ name: "RJ Industries Dev", url: "https://rjindustries.dev" }, { name: "Rishabh Shyam Joshi (Mechanical Engineering)", url: "https://www.linkedin.com/in/rishabhshyamjoshi/" }],
  creator: "Rishabh Joshi (Rishabh Shyam Joshi - Mechanical Engineer)",
  publisher: "RJ Industries Dev",
  alternates: {
    canonical: "https://rjindustries.dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "RJ Industries Dev | Aerospace, Sovereign Defense & Advanced Technologies",
    description: "RJ Industries (rjindustries.dev) is an advanced aerospace engineering, sovereign defense technology, and cognitive computing conglomerate. Pioneering orbital spacecraft architectures, tactical defense platforms, microelectronics fabrication, and the K.I.N.E.T.I.C™ neural platform.",
    url: "https://rjindustries.dev",
    siteName: "RJ Industries (rjindustries.dev)",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "RJ Industries - Next-Gen Aerospace, Sovereign Defense & Advanced Technologies"
    }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RJ Industries Dev | Aerospace, Sovereign Defense & Advanced Technologies",
    description: "RJ Industries (rjindustries.dev) — Next-generation aerospace engineering, tactical defense technology, advanced microelectronics, and cognitive AI hardware.",
    images: ["/og-image.png"],
    creator: "@rishabhshyamjoshi"
  },
  verification: {
    google: "uZtel35Vrxx63SypdVkrGwgR-amUg0nVDkHHRzorGUg",
  },
  other: {
    "geo.region": "IN-MH",
    "geo.placename": "Maharashtra, India",
    "geo.position": "19.0760;72.8777",
    "ICBM": "19.0760, 72.8777"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": ["Corporation", "Organization"],
      "@id": "https://rjindustries.dev/#organization",
      "name": "RJ Industries",
      "legalName": "RJ Industries Dev",
      "alternateName": [
        "rjindustries.dev",
        "RJ Industries Dev",
        "RJ INDUSTRIES",
        "RJ Industries Aerospace & Defense",
        "RJ Industries Technologies",
        "RJ-Industries"
      ],
      "url": "https://rjindustries.dev",
      "logo": "https://rjindustries.dev/logo.png",
      "image": "https://rjindustries.dev/og-image.png",
      "description": "RJ Industries (rjindustries.dev) is a premier aerospace engineering, sovereign defense systems, and cognitive hardware conglomerate. Architecting next-generation orbital launch systems, tactical defense platforms, high-density microelectronics, and the K.I.N.E.T.I.C™ neural interface powered by the proprietary RJ-A1 processor.",
      "founder": {
        "@type": "Person",
        "@id": "https://rjindustries.dev/#founder",
        "name": "Rishabh Joshi",
        "alternateName": [
          "Rishabh Shyam Joshi",
          "Rishabh Shyam Joshi Mechanical Engineering",
          "Rishabh Joshi Mechanical Engineer",
          "RSJ",
          "RJ",
          "Rishabh Joshi RJ Industries"
        ],
        "jobTitle": "Mechanical Engineer & Founder/CEO",
        "disambiguatingDescription": "Mechanical Engineer, Aerospace & Sovereign Systems Architect, Founder and CEO of RJ Industries.",
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Mechanical Engineer",
          "occupationalCategory": "17-2141.00",
          "description": "Mechanical Engineering specializing in aerospace propulsion, electro-mechanical robotics, structural dynamics, thermal architecture, and advanced hardware manufacturing."
        },
        "knowsAbout": [
          "Mechanical Engineering",
          "Aerospace Mechanical Systems",
          "Electro-Mechanical Robotics",
          "Structural Dynamics & Finite Element Analysis",
          "Thermodynamics & Heat Exchanger Architecture",
          "Precision Machining & Advanced Manufacturing",
          "Orbital Propulsion & Ballistics",
          "Sovereign Tactical Defense Hardware",
          "Optical & Spatial Computing Enclosures",
          "Electronic Hardware Packaging & Multilayer PCB Fabrication"
        ],
        "url": "https://www.linkedin.com/in/rishabhshyamjoshi/",
        "sameAs": [
          "https://github.com/rishabhshyamjoshi",
          "https://x.com/rishabhshyamjoshi",
          "https://www.linkedin.com/in/rishabhshyamjoshi/"
        ]
      },
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-8208812534",
        "contactType": "corporate executive office",
        "areaServed": "Global",
        "availableLanguage": ["English", "Hindi"]
      },
      "sameAs": [
        "https://www.crunchbase.com/organization/rj-industries-dev",
        "https://www.linkedin.com/company/rj-industries01/",
        "https://www.instagram.com/rj_industries01/",
        "https://github.com/rishabhshyamjoshi",
        "https://x.com/rishabhshyamjoshi"
      ],
      "knowsAbout": [
        "Mechanical Engineering",
        "Aerospace Systems Engineering",
        "Electro-Mechanical Systems & Robotics",
        "Large-Scale Enterprise Software Development",
        "High-Performance Web Architecture",
        "3D Graphics & WebGL Engineering",
        "Orbital Mechanics & Deep-Space Trajectories",
        "Sovereign Tactical Defense Systems",
        "Electronic Warfare Mitigation",
        "High-Density Interconnect (HDI) PCB Fabrication",
        "Proprietary Neural Silicon Architecture (RJ-A1)",
        "Spatial Computing & Augmented Reality Hardware",
        "Quantum Key Distribution (QKD) & Encryption Arrays",
        "Autonomous Cyber-Physical Systems",
        "Advanced Materials & Precision Manufacturing"
      ],
      "department": [
        {
          "@type": "Organization",
          "name": "RJ Aerospace & Spaceflight Systems",
          "description": "Next-generation orbital spacecraft, hypersonic flight telemetry, and propulsion architectures."
        },
        {
          "@type": "Organization",
          "name": "RJ Tactical Defense & Sovereign Technologies",
          "description": "Advanced tactical defense platforms, autonomous reconnaissance, and electronic threat counter-systems."
        },
        {
          "@type": "Organization",
          "name": "RJ Microelectronics & Semiconductor Fabrication",
          "description": "Proprietary RJ-A1 neural processing silicon, high-precision multilayer HDI PCB packaging."
        },
        {
          "@type": "Organization",
          "name": "RJ Cognitive Systems & Spatial Hardware",
          "description": "The K.I.N.E.T.I.C™ augmented reality platform delivering private, zero-latency visual field intelligence."
        },
        {
          "@type": "Organization",
          "name": "RJ Enterprise Software & Large-Scale Web Systems",
          "description": "Massively scalable digital architectures, enterprise software, high-concurrency web platforms, and GPU-accelerated 3D applications."
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://rjindustries.dev/#website",
      "name": "RJ Industries Dev",
      "alternateName": ["rjindustries.dev", "RJ Industries Official Portal"],
      "url": "https://rjindustries.dev",
      "publisher": {
        "@id": "https://rjindustries.dev/#organization"
      },
      "description": "Official portal of RJ Industries (rjindustries.dev) — Sovereign Defense Systems, Aerospace Propulsion, and Advanced Cognitive Hardware."
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "K.I.N.E.T.I.C™ Spatial Computing Glasses",
      "alternateName": "K.I.N.E.T.I.C AR Glasses with RJ-A1 Chip",
      "brand": {
        "@type": "Brand",
        "name": "RJ Industries"
      },
      "manufacturer": {
        "@id": "https://rjindustries.dev/#organization"
      },
      "description": "Sovereign-grade private spatial computing hardware equipped with the proprietary RJ-A1 Neural Processing Silicon. Delivers real-time, offline visual intelligence directly to the user's field of view without third-party cloud vulnerabilities.",
      "category": "Augmented Reality / Neural Hardware"
    }
  ];

  return (
    <html lang="en" className={`${orbitron.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${orbitron.variable} ${spaceGrotesk.variable} bg-black text-white overflow-hidden`}>
        <div className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
          <header>
            <h1>RJ Industries Dev (rjindustries.dev) - Aerospace, Sovereign Defense & Mechanical Engineering</h1>
            <p>
              RJ Industries (operating internationally via rjindustries.dev) is an advanced multi-disciplinary defense contractor, aerospace engineering powerhouse, and mechanical systems conglomerate founded and led by Mechanical Engineer Rishabh Joshi (also recognized as Rishabh Shyam Joshi).
            </p>
          </header>

          <section>
            <h2>Executive Leadership & Founder Profile</h2>
            <article>
              <h3>Rishabh Shyam Joshi — Mechanical Engineer & Founder / CEO</h3>
              <p>
                <strong>Profession & Discipline:</strong> Mechanical Engineering.
              </p>
              <p>
                <strong>Executive Role:</strong> Founder, Chief Executive Officer & Chief Mechanical Engineer of RJ Industries (rjindustries.dev).
              </p>
              <p>
                Rishabh Shyam Joshi is an engineer whose core expertise lies in Mechanical Engineering, aerospace propulsion, thermodynamic cycle architecture, finite element structural analysis, automated electro-mechanical robotics, and precision manufacturing. Under his leadership, RJ Industries develops sovereign defense hardware, high-density microelectronics, and orbital space systems.
              </p>
            </article>
            <p>
              <strong>Corporate Headquarters & Operations:</strong> Maharashtra, India with international strategic reach across mechanical systems, aerospace engineering, sovereign defense alliances, and enterprise hardware manufacturing.
            </p>
          </section>

          <section>
            <h2>Strategic Core Divisions</h2>
            <article>
              <h3>1. Aerospace & Orbital Systems Division</h3>
              <p>
                Architecting next-generation orbital launch trajectories, deep-space propulsion telemetry, planetary entry vehicles, and autonomous avionics systems engineered for extreme extraterrestrial conditions.
              </p>
            </article>
            <article>
              <h3>2. Sovereign Defense & Tactical Technologies Division</h3>
              <p>
                Developing sovereign defense solutions, electronic warfare mitigation, autonomous tactical surveillance arrays, and state-of-the-art quantum key distribution (QKD) unhackable encryption infrastructure.
              </p>
            </article>
            <article>
              <h3>3. Microelectronics & Precision PCB Manufacturing Division</h3>
              <p>
                High-density interconnect (HDI) multilayer printed circuit board fabrication, high-frequency RF architectures, military-grade thermal management, and rapid microelectronics surface-mount prototyping.
              </p>
            </article>
            <article>
              <h3>4. Cognitive Hardware & Spatial AI — K.I.N.E.T.I.C™ Division</h3>
              <p>
                Engineering the revolutionary K.I.N.E.T.I.C™ Glasses powered by the proprietary RJ-A1 Neural Processing Silicon. Designed for field operators, engineers, and visionaries, delivering offline, private edge intelligence overlaid directly across human visual perception.
              </p>
            </article>
            <article>
              <h3>5. Electro-Mechanical Systems & Robotics Division</h3>
              <p>
                High-precision mechanical engineering, robotic actuators, automated kinematic simulation, structural mechanics, and GPU-accelerated telemetry systems.
              </p>
            </article>
            <article>
              <h3>6. Large-Scale Enterprise Software & Web Engineering Division</h3>
              <p>
                Architecting high-concurrency enterprise software, massive-scale digital web ecosystems, real-time 3D GPU graphics computing, and mission-critical cloud backends.
              </p>
            </article>
          </section>

          <nav>
            <h2>Official Navigation & Verification Directory</h2>
            <ul>
              <li><a href="/">Terminal & Global Command Center (Home)</a></li>
              <li><a href="/project/1">Active Projects & Defense Prototypes</a></li>
              <li><a href="/product">Sovereign Products & Hardware Deployments</a></li>
              <li><a href="/academy">Singularity Academy & Astrophysics Research</a></li>
              <li><a href="/team">Executive Directorate, Engineers & Autonomous Agents</a></li>
              <li><a href="https://www.crunchbase.com/organization/rj-industries-dev" target="_blank" rel="noopener noreferrer">Verified Crunchbase Profile: RJ Industries Dev</a></li>
            </ul>
          </nav>

          <section>
            <h2>Featured Flagship Deployments</h2>
            <ul>
              <li><strong>RJ INDUSTRIES:</strong> Flagship sovereign defense, aerospace engineering, and mechanical systems portal (<a href="https://rjindustries.dev">rjindustries.dev</a>).</li>
              <li><strong>K.I.N.E.T.I.C™ Spatial Computing Glasses:</strong> The pinnacle of wearable neural hardware powered by the RJ-A1 Chip.</li>
              <li><strong>KRIPA DESIGN STUDIO:</strong> Architectural & interior design digital presence (<a href="https://kripa-delta.vercel.app/">kripa-delta.vercel.app</a>).</li>
              <li><strong>EATSIFY:</strong> Next-generation culinary ordering and discovery platform (<a href="https://eatsify.vercel.app/">eatsify.vercel.app</a>).</li>
              <li><strong>MUMUKSHU COSMIC UNIVERSE:</strong> State-of-the-art interactive cosmic simulation powered by high-fidelity graphics computing (<a href="https://www.mumukshugame.com">mumukshugame.com</a>).</li>
              <li><strong>QUANTUM ENCRYPTION ARRAYS:</strong> Unhackable sovereign data transmission leveraging quantum state superposition.</li>
              <li><strong>RENDERING DAYLIGHT:</strong> Next-generation real-time photon scattering and atmospheric ray-tracing research.</li>
            </ul>
          </section>
        </div>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
