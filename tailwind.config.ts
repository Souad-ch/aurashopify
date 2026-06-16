import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effdf6",
          100: "#d8fbe9",
          200: "#b3f5d4",
          300: "#7eebb8",
          400: "#42d896",
          500: "#1abf77",
          600: "#0f9d60",
          700: "#0e7d4f",
          800: "#106342",
          900: "#0f5138",
        },
        ink: {
          DEFAULT: "#1a1a1a",
          soft: "#616161",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        pop: "0 10px 30px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
