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
        // Adelaide University 2026 Brand Colors
        navy: {
          DEFAULT: "#140F50",   // Violet — primary dark
          light: "#1F1666",
          dark: "#0A0830",
          50: "#F0EDF9",
          100: "#D5D0EF",
          200: "#9B91D9",
        },
        brand: {
          DEFAULT: "#1448FF",   // Blue Ribbon — CTA / accent
          light: "#3D67FF",
          dark: "#0A35CC",
          50: "#EBF0FF",
          100: "#C5D1FF",
          200: "#7FA1FF",
        },
        purple: {
          DEFAULT: "#6956CC",   // Blue Marguerite — secondary
          light: "#8A76DD",
          dark: "#4D3DAA",
          50: "#F0EDF9",
          100: "#D5CEEF",
        },
        cream: {
          DEFAULT: "#F9F2E6",   // Quarter Spanish White
          dark: "#EFE5CC",
          light: "#FDFAF4",
        },
        // Keep "gold" alias → brand blue for backward compat
        gold: {
          DEFAULT: "#1448FF",
          light: "#3D67FF",
          dark: "#0A35CC",
          50: "#EBF0FF",
          100: "#C5D1FF",
        },
      },
      fontFamily: {
        sans: ["Roboto Serif", "Georgia", "serif"],
        serif: ["Roboto Serif", "Georgia", "serif"],
        condensed: ["var(--font-barlow-condensed)", "Barlow Condensed", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px rgba(20, 15, 80, 0.07)",
        "card-hover": "0 8px 32px rgba(20, 15, 80, 0.14)",
        brand: "0 0 0 3px rgba(20, 72, 255, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
