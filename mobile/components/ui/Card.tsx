// mobile/components/ui/Card.tsx
import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "card" | "surface";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const variantStyles = {
    default: "bg-surface border border-border",
    gold: "bg-surface border border-primary/30",
    card: "bg-surface-card border border-primary/20",
    surface: "bg-surface-light border border-border",
  }[variant];

  return (
    <View
      className={`p-4 rounded-2xl shadow-sm ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};