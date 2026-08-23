/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: "#2c378b",
        secondary: "#f56e00",
        accent: "#f3a516",
        highlight: "#dd8939",
        warning: "#f59810",
        success: "#e3a55d",
        neutral: "#616482",
        muted: "#c97322",
        danger: "#d25c07",
        info: "#b4763c",
        dark: "#121212",
        "dark-lighter": "#1a1a1a",
        "dark-light": "#222222",
        orange: "#f56e00",
        blue: "#2c378b",
        "near-white": "#f0f0f0",
        "primary-dark": "#1e2660",
        "accent-light": "#fbbf24",
        surface: "rgba(255,255,255,0.05)",
        "border-glow": "rgba(245,110,0,0.18)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        code: ["Fira Code", "monospace"],
      },
      boxShadow: {
        neon: "0 0 5px #f56e00, 0 0 15px #f56e00",
        "neon-sm": "0 0 2px #f56e00, 0 0 5px #f56e00",
        "neon-blue": "0 0 5px #2c378b, 0 0 15px #2c378b",
        "neon-blue-sm": "0 0 2px #2c378b, 0 0 5px #2c378b",
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        card: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.1), 0 16px 40px rgba(0,0,0,0.08)",
        "card-orange": "0 4px 24px rgba(245,110,0,0.15)",
        "card-blue": "0 4px 24px rgba(44,55,139,0.15)",
      },
      animation: {
        blink: "blink 1s step-end infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        gradientShift: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        glowPulse: {
          "0%, 100%": { "box-shadow": "0 0 5px #f56e00, 0 0 15px rgba(245,110,0,0.3)" },
          "50%": { "box-shadow": "0 0 12px #f56e00, 0 0 35px rgba(245,110,0,0.6), 0 0 60px rgba(245,110,0,0.2)" },
        },
        shimmer: {
          "0%": { "background-position": "-200% 0" },
          "100%": { "background-position": "200% 0" },
        },
      },
    },
  },
  plugins: [],
}