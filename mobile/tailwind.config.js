// mobile/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Token Semantik UI (Placeholder Netral)
        primary: "#2563eb",
        secondary: "#475569",
        background: "#0f172a",
        surface: "#1e293b",
        "surface-light": "#334155",
        text: "#f8fafc",
        subtext: "#94a3b8",
        success: "#22c55e",
        danger: "#ef4444",
        warning: "#f59e0b",
        
        // Token Semantik Game
        hp: "#ef4444",
        exp: "#eab308",
        boss: "#a855f7",
        shield: "#3b82f6",
        mana: "#06b6d4",
        dodge: "#10b981",
      },
    },
  },
  plugins: [],
};