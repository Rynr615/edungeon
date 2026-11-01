// mobile/constants/theme.ts
/**
 * Token Tema Resmi Edungeon (Sesuai Desain Figma: Dark Fantasy RPG)
 * Digunakan untuk prop inline, pewarnaan Heroicons, border, dan dynamic styling.
 */

export const THEME_COLORS = {
  // Latar & Surface
  background: "#140D07",
  surface: "#23170E",
  surfaceCard: "#2A1D13",
  surfaceLight: "#3B281A",

  // Emas Antik & Kuningan
  primary: "#D4A373",
  primaryLight: "#E6B87D",
  primaryDark: "#9A6A38",
  gold: "#E6B87D",

  // Border
  border: "#3D2817",
  borderGold: "rgba(212, 163, 115, 0.35)",
  borderGoldBright: "#D4A373",

  // Teks
  text: "#FAEDCD",
  subtext: "#A79A8B",
  textMuted: "#7C6E5F",

  // Status & Indikator
  success: "#22C55E",
  danger: "#E63946",
  warning: "#F59E0B",

  // Token Game
  hp: "#E63946",
  exp: "#F59E0B",
  boss: "#9333EA",
  shield: "#3B82F6",
  mana: "#06B6D4",
  dodge: "#10B981",

  // Medali & Badge
  badgeBronze: "#CD7F32",
  badgeSilver: "#C0C0C0",
  badgeGold: "#FFD700",
  badgeRuby: "#E63946",
} as const;

export type ThemeColorKey = keyof typeof THEME_COLORS;
