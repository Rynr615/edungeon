// mobile/constants/theme.ts
/**
 * SISTEM TOKEN TEMA EDUNGEON: "ARCANE DUNGEON ACADEMY"
 * Terinspirasi oleh estetika Genshin Impact UI & Dark Fantasy Academy.
 * Menyeimbangkan atmosfer dungeon magis dengan kenyamanan membaca materi matematika SMA.
 */

export const THEME_COLORS = {
  dark: {
    // Canvas & Permukaan (Astral Midnight & Slate Indigo Hangat)
    background: "#0d131d",        // Latar belakang utama: midnight navy hangat, tidak hitam pekat
    surface: "#151d2a",           // Kartu & kontainer: slate indigo elegan
    surfaceAlt: "#1c2637",        // Kartu sekunder & input: elevasi tingkat 2
    surfaceLight: "#26344b",      // Hover & highlight halus
    border: "#28374f",            // Border netral
    borderStrong: "#3b4f70",      // Border tegas untuk kartu aktif

    // Tipografi (Ivory & Slate Mist, tidak menyilaukan mata)
    text: "#f1f5f9",              // Teks utama: soft ivory off-white (WCAG AAA)
    textMuted: "#9cb0c9",         // Teks sekunder & durasi: slate mist (WCAG AA)
    textInverse: "#0d131d",       // Teks di atas tombol aksen terang

    // Aksen Utama & Gamifikasi (Mora Gold & Runic Cyan ala Genshin)
    primary: "#48bfe3",           // Runic Cyan: tombol navigasi & fokus sihir
    primaryMuted: "#0096c7",      // Cyan gelap untuk border tombol
    accentGold: "#f3c05b",        // Mora / Primogem Gold: EXP, badge, tombol Challenge
    accentGoldMuted: "#c8942b",   // Emas temaram kuno
    secondary: "#627d98",         // Netral sekunder

    // Status Pembelajaran & Interaksi
    success: "#34d399",           // Emerald Gem: jawaban benar & materi selesai
    successBg: "rgba(52, 211, 153, 0.12)",
    danger: "#f87171",            // Coral Red: umpan balik salah (ramah, tidak menakutkan)
    dangerBg: "rgba(248, 113, 113, 0.12)",
    warning: "#fbbf24",           // Amber: peringatan kesalahan umum
    warningBg: "rgba(251, 191, 36, 0.12)",
    locked: "#485b75",            // Slate runik terkunci

    // Area Belajar & Reader Matematika Spesifik
    readingBg: "#0d131d",         // Latar baca terfokus
    formulaBg: "#121926",         // Blok rumus: indigo gelap nyaman dibaca lama
    formulaBorder: "#2a3952",     // Garis tepi formula
    calloutTip: "#38bdf8",        // Lampu tips petualang
    calloutTipBg: "rgba(56, 189, 248, 0.08)",
    calloutWarn: "#fbbf24",       // Peringatan salah konsep
    calloutWarnBg: "rgba(251, 191, 36, 0.08)",
    calloutInfo: "#a78bfa",       // Konsep kunci mistis (Arcane Violet)
    calloutInfoBg: "rgba(167, 139, 250, 0.08)",

    // Token Gamifikasi Bersama (Challenge & Profile)
    hp: "#f43f5e",                // Hati HP Karakter (Crimson Rose)
    exp: "#f3c05b",               // Bar & angka EXP (Mora Gold)
    shield: "#38bdf8",            // Perisai Knight
    mana: "#22d3ee",              // Sihir Mage
    dodge: "#34d399",             // Lincah Archer
    boss: "#c084fc",              // Aura Monster Boss
  },
  light: {
    // Mode Terang (Aksesibilitas Belajar Siang Hari di Luar Ruangan)
    background: "#f6f8fb",        // Latar kanvas putih keperakan lembut
    surface: "#ffffff",           // Kartu putih bersih
    surfaceAlt: "#edf2f7",        // Kontainer sekunder
    surfaceLight: "#e2e8f0",      // Border & pemisah
    border: "#d5dfeb",
    borderStrong: "#b8c9de",

    text: "#101827",              // Teks hitam arang pekat (WCAG AAA)
    textMuted: "#52637a",         // Teks sekunder (WCAG AA)
    textInverse: "#ffffff",

    primary: "#0284c7",           // Sky Blue tebal
    primaryMuted: "#0369a1",
    accentGold: "#b45309",        // Emas tembaga berbobot tinggi untuk kontras putih
    accentGoldMuted: "#92400e",
    secondary: "#64748b",

    success: "#15803d",           // Hijau hutan pekat
    successBg: "rgba(21, 128, 61, 0.10)",
    danger: "#dc2626",            // Merah pekat
    dangerBg: "rgba(220, 38, 38, 0.10)",
    warning: "#b45309",
    warningBg: "rgba(180, 83, 9, 0.10)",
    locked: "#64748b",

    readingBg: "#ffffff",
    formulaBg: "#f1f5f9",
    formulaBorder: "#cbd5e1",
    calloutTip: "#0284c7",
    calloutTipBg: "rgba(2, 132, 199, 0.08)",
    calloutWarn: "#b45309",
    calloutWarnBg: "rgba(180, 83, 9, 0.08)",
    calloutInfo: "#6366f1",
    calloutInfoBg: "rgba(99, 102, 241, 0.08)",

    hp: "#be123c",
    exp: "#b45309",
    shield: "#1d4ed8",
    mana: "#0e7490",
    dodge: "#047857",
    boss: "#7e22ce",
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 32,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};
