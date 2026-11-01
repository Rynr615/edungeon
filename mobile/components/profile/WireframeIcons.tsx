// mobile/components/profile/WireframeIcons.tsx
import React from "react";
import Svg, { Path, Circle, Rect, G } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

// 👻 Ghost Icon for Monster dikalahkan
export const GhostIcon: React.FC<IconProps> = ({ size = 24, color = "#0f172a" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C7.58 2 4 5.58 4 10v9.5c0 .41.48.64.81.4l2.19-1.64 2.22 1.66a.5.5 0 0 0 .6 0l2.18-1.63 2.18 1.63a.5.5 0 0 0 .6 0l2.22-1.66 2.19 1.64c.33.24.81.01.81-.4V10c0-4.42-3.58-8-8-8zm-3 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
  </Svg>
);

// 💀 Skull Icon for Boss dikalahkan
export const SkullIcon: React.FC<IconProps> = ({ size = 24, color = "#0f172a" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C6.48 2 2 6.48 2 12c0 3.31 1.61 6.24 4.09 8.04V21c0 .55.45 1 1 1h2v-2h1v2h2v-2h1v2h2c.55 0 1-.45 1-1v-.96C19.39 18.24 21 15.31 21 12c0-5.52-4.48-10-10-10zm-3.5 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm7 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
  </Svg>
);

// 🎯 Target / Bullseye Icon for Akurasi jawaban
export const TargetIcon: React.FC<IconProps> = ({ size = 24, color = "#0f172a" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" />
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// 🗡️ Sword Icon for ATK+2
export const SwordIcon: React.FC<IconProps> = ({ size = 22, color = "#0f172a" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19.5 4.5l-9 9m0 0l-2 2 1 1-2 2-1-1-1 1-1-1 1-1-1-1 2-2 1 1 2-2zm0 0L21 3l-1.5 1.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M14.5 9.5l-5-5L11 3l5 5-1.5 1.5z" fill={color} />
  </Svg>
);

// 🖤 Heart Icon for HP+15
export const BlackHeartIcon: React.FC<IconProps> = ({ size = 20, color = "#0f172a" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </Svg>
);

// 🛡️ Shield Icon for DEF+4
export const BlackShieldIcon: React.FC<IconProps> = ({ size = 20, color = "#0f172a" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
  </Svg>
);

// 🏅 Medal Badge Icon
export const MedalBadgeIcon: React.FC<IconProps> = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="15" r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
    <Path d="M9 14l1.5 2 3-3" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M7 3l3 8m4-8l-3 8" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

// 🏵️ Sun / Starburst Badge Icon
export const SunBadgeIcon: React.FC<IconProps> = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#FBBF24">
    <Path d="M12 2l2.4 3.7 4.4-.3.9 4.3 4 1.8-1.5 4.1 2.7 3.5-3.4 2.8-.2 4.4-4.3.9-1.8 4-4.1-1.5-3.5 2.7-2.8-3.4-4.4-.2-.9-4.3-4-1.8 1.5-4.1L1 11.4l3.4-2.8.2-4.4 4.3-.9L10.7 2 12 2z" />
    <Circle cx="12" cy="12" r="4" fill="#D97706" />
  </Svg>
);

// 🔒 Red Lock Badge Icon
export const RedLockBadgeIcon: React.FC<IconProps> = ({ size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="10" width="14" height="11" rx="2" fill="#EF4444" />
    <Path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="12" cy="15" r="1.5" fill="#FFFFFF" />
  </Svg>
);
