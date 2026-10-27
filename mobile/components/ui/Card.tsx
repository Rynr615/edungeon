// mobile/components/ui/Card.tsx
import React from "react";
import { View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <View className={`bg-surface border border-surface-light p-4 rounded-2xl shadow-sm ${className}`}>
      {children}
    </View>
  );
};