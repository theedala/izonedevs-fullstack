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
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        code: ["Fira Code", "monospace"],
      },
      boxShadow: {
        neon: "0 0 5px #f56e00, 0 0 15px #f56e00",
        "neon-sm": "0 0 2px #f56e00, 0 0 5px #f56e00",
        "neon-blue": "0 0 5px #2c378b, 0 0 15px #2c378b",
        "neon-blue-sm": "0 0 2px #2c378b, 0 0 5px #2c378b",
      },
      animation: {
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}