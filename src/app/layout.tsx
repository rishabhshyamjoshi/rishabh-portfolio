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
  title: "RJ INDUSTRIES | Next-Gen Portfolio",
  description: "Innovation beyond limits. Portfolio of Rishabh Joshi.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "RJ INDUSTRIES",
    description: "Innovation beyond limits. Portfolio of Rishabh Joshi.",
    images: ["/logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RJ INDUSTRIES",
    description: "Innovation beyond limits. Portfolio of Rishabh Joshi.",
    images: ["/logo.png"],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-black text-white overflow-hidden">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
