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
    canonical: "/",
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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RJ Industries",
    "url": "https://rjindustries.dev",
    "logo": "https://rjindustries.dev/logo.png",
    "description": "Innovation beyond limits. Aerospace, Defense, and Advanced Manufacturing by RJ Industries.",
    "sameAs": [
      "https://github.com/rishabhshyamjoshi",
      "https://www.linkedin.com/in/rishabhshyamjoshi/"
    ]
  };

  return (
    <html lang="en" className={`${orbitron.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-white overflow-hidden">
        <h1 className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
          RJ Industries - Aerospace, Defense, and Advanced Manufacturing
        </h1>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
