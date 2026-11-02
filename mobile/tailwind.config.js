// mobile/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SourceCodePro_400Regular", "monospace"],
        mono: ["SourceCodePro_400Regular", "monospace"],
        "source-regular": ["SourceCodePro_400Regular", "monospace"],
        "source-medium": ["SourceCodePro_500Medium", "monospace"],
        "source-semibold": ["SourceCodePro_600SemiBold", "monospace"],
        "source-bold": ["SourceCodePro_700Bold", "monospace"],
        dmsans: ["DMSans_700Bold", "sans-serif"],
        "dmsans-bold": ["DMSans_700Bold", "sans-serif"],
        "dmsans-regular": ["DMSans_400Regular", "sans-serif"],
      },
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