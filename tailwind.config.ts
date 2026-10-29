import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: "#0A1F0A",
        pine: "#1B4332",
        primary: "#2D6A4F",
        sage: "#52B788",
        cream: "#FEFAE0",
        coral: "#FF6B6B",
        charcoal: "#1B1B1B",
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
