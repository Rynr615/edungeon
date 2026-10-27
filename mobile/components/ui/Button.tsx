// mobile/components/ui/Button.tsx
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-primary text-text",
    secondary: "bg-secondary text-text",
    success: "bg-success text-text",
    danger: "bg-danger text-text",
    warning: "bg-warning text-background",
  };

  return (
    <TouchableOpacity
      className={`${variantStyles[variant]} p-4 rounded-xl items-center justify-center ${
        disabled || loading ? "opacity-50" : "active:opacity-80"
      } ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className="font-bold text-base text-text">{title}</Text>
      )}
    </TouchableOpacity>
  );
};