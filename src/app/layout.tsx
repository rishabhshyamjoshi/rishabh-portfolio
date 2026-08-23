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
  title: "RJ Industries | Aerospace, Defense, and Advanced Manufacturing",
  description: "RJ Industries is a pioneer in aerospace, defense, and advanced manufacturing. Innovation beyond limits. We build the future.",
  keywords: ["rjindustries", "RJ Industries", "aerospace", "defense", "advanced manufacturing", "Rishabh Joshi", "space tech", "innovation"],
  authors: [{ name: "RJ Industries" }],
  creator: "RJ Industries",
  publisher: "RJ Industries",
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
    title: "RJ Industries | Aerospace, Defense, and Advanced Manufacturing",
    description: "RJ Industries is a pioneer in aerospace, defense, and advanced manufacturing. Innovation beyond limits.",
    url: "https://rjindustries.dev",
    siteName: "RJ Industries",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "RJ Industries Logo"
    }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RJ Industries | Aerospace, Defense, and Advanced Manufacturing",
    description: "RJ Industries is a pioneer in aerospace, defense, and advanced manufacturing. Innovation beyond limits.",
    images: ["/og-image.png"],
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
      "@type": "Corporation",
      "name": "RJ Industries",
      "url": "https://rjindustries.dev",
      "logo": "https://rjindustries.dev/logo.png",
      "description": "Pioneering aerospace, defense, advanced manufacturing, and AI technologies. Founded by Rishabh Joshi.",
      "founder": {
        "@type": "Person",
        "name": "Rishabh Joshi",
        "url": "https://www.linkedin.com/in/rishabhshyamjoshi/"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-8208812534",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://www.linkedin.com/company/rj-industries01/",
        "https://www.instagram.com/rj_industries01/",
        "https://github.com/rishabhshyamjoshi"
      ],
      "knowsAbout": [
        "Aerospace Engineering",
        "Defense Technology",
        "Generative AI",
        "Advanced Manufacturing",
        "Game Development",
        "K.I.N.E.T.I.C Glasses"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "RJ Industries",
      "url": "https://rjindustries.dev",
      "description": "RJ Industries is a pioneer in aerospace, defense, and advanced manufacturing. Innovation beyond limits."
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
      <body className="bg-black text-white overflow-hidden">
        <div className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
          <h1>RJ Industries - Aerospace, Defense, and Advanced Manufacturing</h1>
          <p>
            Welcome to RJ Industries, founded by Rishabh Joshi. We are a pioneer in aerospace, defense, advanced manufacturing, and generative AI technologies. 
            Our mission is innovation beyond limits, building the future of humanity&apos;s capabilities.
          </p>
          <h2>Our Core Divisions</h2>
          <ul>
            <li>Aerospace Engineering - Next generation spacecraft and aviation systems.</li>
            <li>Defense Technology - Advanced tactical systems and threat mitigation.</li>
            <li>Advanced Manufacturing - Precision engineering and industrial automation.</li>
            <li>Consumer AI - Featuring the K.I.N.E.T.I.C Glasses powered by the proprietary RJ-A1 Chip, delivering high-performance, private, offline-capable AI models directly to your visual field.</li>
          </ul>
          <h2>Featured Projects</h2>
          <ul>
            <li>K.I.N.E.T.I.C Glasses: Consumer AR / AI Division.</li>
            <li>NAM EAS Portfolio: Professional Portfolio Website built with React, WebGL, and Three.js.</li>
            <li>RENDERING DAYLIGHT: Web-Based Graphics Experiment exploring real-time rendering and light scattering.</li>
          </ul>
        </div>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
