import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#ff6b35",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' }
        }
      },
      animation: {
        scanline: 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
};

export default config;
