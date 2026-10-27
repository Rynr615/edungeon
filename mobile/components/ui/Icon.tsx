// mobile/components/ui/Icon.tsx
import React from "react";
import { ColorValue } from "react-native";
import * as OutlineIcons from "react-native-heroicons/outline";
import * as SolidIcons from "react-native-heroicons/solid";

export type IconName = keyof typeof OutlineIcons;

interface IconProps {
  name: IconName;
  variant?: "outline" | "solid";
  size?: number;
  color?: ColorValue | string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  variant = "outline",
  size = 24,
  color = "#f8fafc",
}) => {
  const IconComponent =
    variant === "solid" ? SolidIcons[name] : OutlineIcons[name];

  if (!IconComponent) {
    console.warn(`[Icon] Heroicon dengan nama "${name}" tidak ditemukan.`);
    return null;
  }

  return <IconComponent size={size} color={color as string} />;
};  