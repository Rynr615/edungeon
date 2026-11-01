import React from "react";
import { View, Text } from "react-native";
import { Icon } from "../ui/Icon";
import { s } from "./styles";
export function HpIndicator({
  hp,
  maxHp,
  buffer = 0,
}: {
  hp: number;
  maxHp: number;
  buffer?: number;
}) {
  return (
    <View
      accessibilityLabel={`HP ${hp} dari ${maxHp}`}
      style={[
        s.row,
        { justifyContent: "flex-start", gap: 3, flexWrap: "wrap" },
      ]}
    >
      {Array.from({ length: maxHp }, (_, i) => (
        <Icon
          key={i}
          name="HeartIcon"
          variant={i < hp ? "solid" : "outline"}
          size={20}
          color={i < hp ? "#e53557" : "#8c959f"}
        />
      ))}
      {buffer > 0 && <Text style={s.label}> +1 Buffer</Text>}
    </View>
  );
}
