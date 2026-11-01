import React from "react";
import { Pressable, Text } from "react-native";
import { s, colors } from "./styles";
export function StageNode({
  stage,
  current,
  completed,
  locked,
  onPress,
}: {
  stage: number;
  current: boolean;
  completed: boolean;
  locked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={`Stage ${stage}${stage === 5 ? " Mid-Boss" : stage === 10 ? " Last Boss" : ""}${locked ? " terkunci" : ""}`}
      accessibilityState={{ disabled: locked }}
      disabled={locked}
      onPress={onPress}
      style={{
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: completed
          ? "#d5efdf"
          : stage % 5 === 0
            ? colors.yellow
            : "#f2f2f7",
        borderWidth: current ? 3 : 0,
        borderColor: colors.ink,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
        opacity: locked ? 0.55 : 1,
      }}
    >
      <Text style={[s.text, { fontWeight: "800", fontSize: 20 }]}>
        {completed ? "✓" : `1-${stage}`}
      </Text>
      {stage % 5 === 0 && (
        <Text style={{ fontSize: 8, color: colors.ink }}>
          {stage === 5 ? "MID-BOSS" : "LAST BOSS"}
        </Text>
      )}
    </Pressable>
  );
}
