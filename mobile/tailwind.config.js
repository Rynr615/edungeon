// mobile/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // [TOKEN TEMA EDUNGEON: ARCANE DUNGEON ACADEMY - GENSHIN INSPIRED]
        background: "#0d131d",
        surface: "#151d2a",
        "surface-alt": "#1c2637",
        "surface-light": "#26344b",
        border: "#28374f",
        "border-strong": "#3b4f70",

        text: "#f1f5f9",
        subtext: "#9cb0c9",
        "text-muted": "#9cb0c9",

        primary: "#48bfe3",
        "primary-dark": "#0096c7",
        "accent-gold": "#f3c05b",
        secondary: "#627d98",

        success: "#34d399",
        danger: "#f87171",
        warning: "#fbbf24",
        locked: "#485b75",

        // [TOKEN BELAJAR SPESIFIK - MATEMATIKA NYAMAN DIBACA]
        "reading-bg": "#0d131d",
        "formula-bg": "#121926",
        "formula-border": "#2a3952",
        "callout-tip": "#38bdf8",
        "callout-warn": "#fbbf24",
        "callout-info": "#a78bfa",

        // [TOKEN GAMIFIKASI BERSAMA - ROGUELIKE DUNGEON]
        hp: "#f43f5e",
        exp: "#f3c05b",
        boss: "#c084fc",
        shield: "#38bdf8",
        mana: "#22d3ee",
        dodge: "#34d399",
      },
    },
  },
  plugins: [],
};
