// mobile/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Tema Utama Edungeon (Dark Fantasy RPG sesuai Figma)
        background: "#140D07",          // Latar belakang utama dungeon gelap
        surface: "#23170E",             // Latar kartu profil & container
        "surface-card": "#2A1D13",      // Kartu statistik 2x2
        "surface-light": "#3B281A",     // State hover / aktif kartu
        
        // Aksen Emas & Kuningan Antik (Vintage Gold / Amber)
        primary: "#D4A373",             // Emas antik standar
        "primary-light": "#E6B87D",     // Emas cerah untuk tombol aktif
        "primary-dark": "#9A6A38",      // Perunggu tua / bayangan emas
        gold: "#E6B87D",
        
        // Garis Tepi (Borders)
        border: "#3D2817",              // Border gelap
        "border-gold": "rgba(212, 163, 115, 0.35)", // Border tipis keemasan
        "border-gold-bright": "#D4A373", // Border emas solid
        
        // Tipografi
        text: "#FAEDCD",                // Krem gading terang untuk judul & angka
        subtext: "#A79A8B",             // Abu-abu pasir hangat untuk username & label
        
        // Status & Metrik
        success: "#22C55E",
        danger: "#E63946",
        warning: "#F59E0B",
        
        // Token Semantik Game Roguelike
        hp: "#E63946",                  // Hati / Health
        exp: "#F59E0B",                 // EXP Bar
        boss: "#9333EA",                // Boss icon
        shield: "#3B82F6",              // Knight Shield
        mana: "#06B6D4",                // Mage Mana
        dodge: "#10B981",               // Archer Dodge
        
        // Token Medali & Badge Prestasi
        "badge-bronze": "#CD7F32",
        "badge-silver": "#C0C0C0",
        "badge-gold": "#FFD700",
        "badge-ruby": "#E63946",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};