// mobile/components/home/CalloutBox.tsx
import React from "react";
import { View, Text } from "react-native";
import { Icon } from "../ui/Icon";

export type CalloutType = "tip" | "warning" | "info";

interface CalloutBoxProps {
  type: CalloutType;
  title?: string;
  content: string;
  className?: string;
}

export const CalloutBox: React.FC<CalloutBoxProps> = ({
  type,
  title,
  content,
  className = "",
}) => {
  const configs = {
    tip: {
      defaultTitle: "Tips Cerdas Petualang",
      borderColor: "border-l-callout-tip",
      bgClass: "bg-callout-tip/10",
      borderBoxClass: "border-callout-tip/25",
      textColor: "text-primary",
      iconName: "LightBulbIcon" as const,
      iconColor: "#38bdf8",
    },
    warning: {
      defaultTitle: "Hati-Hati! Kesalahan Umum",
      borderColor: "border-l-callout-warn",
      bgClass: "bg-callout-warn/10",
      borderBoxClass: "border-callout-warn/25",
      textColor: "text-warning",
      iconName: "ExclamationTriangleIcon" as const,
      iconColor: "#f59e0b",
    },
    info: {
      defaultTitle: "Konsep Kunci Penting",
      borderColor: "border-l-callout-info",
      bgClass: "bg-callout-info/10",
      borderBoxClass: "border-callout-info/25",
      textColor: "text-indigo-400",
      iconName: "InformationCircleIcon" as const,
      iconColor: "#818cf8",
    },
  };

  const config = configs[type];

  return (
    <View
      className={`rounded-2xl p-4 mb-4 border border-l-4 ${config.borderColor} ${config.bgClass} ${config.borderBoxClass} ${className}`}
    >
      <View className="flex-row items-center mb-1.5">
        <Icon
          name={config.iconName}
          variant="solid"
          size={16}
          color={config.iconColor}
        />
        <Text className={`font-bold text-xs uppercase tracking-wider ml-2 ${config.textColor}`}>
          {title || config.defaultTitle}
        </Text>
      </View>
      <Text className="text-text/90 text-xs leading-relaxed pl-6">
        {content}
      </Text>
    </View>
  );
};
