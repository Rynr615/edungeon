import React, { useEffect, useState } from "react";
import { Animated, Text, Pressable } from "react-native";
import { Option, Question, BattleResult } from "../../types/battle";
import { s, colors } from "./styles";
export function OptionButtons({
  question,
  selected,
  result,
  disabled,
  onSelect,
}: {
  question: Question;
  selected: Option | null;
  result: BattleResult | null;
  disabled: boolean;
  onSelect: (key: Option) => void;
}) {
  const [flash] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (!result) return;
    const animation = Animated.sequence([
      Animated.timing(flash, {
        toValue: 0.55,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(flash, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [result, flash]);
  return (
    <Animated.View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        opacity: flash,
      }}
    >
      {question.options.map((o) => {
        const hidden = question.hidden.includes(o.key);
        const marked = question.marked.includes(o.key);
        const active = selected === o.key;
        return (
          <Pressable
            key={o.key}
            accessibilityLabel={`${o.key}. ${hidden ? "Dieliminasi" : o.text}${marked ? ", opsi salah" : ""}`}
            accessibilityState={{
              disabled: hidden || disabled,
              selected: active,
            }}
            disabled={hidden || disabled}
            onPress={() => onSelect(o.key)}
            style={{
              width: "48%",
              minHeight: 60,
              padding: 13,
              borderRadius: 16,
              justifyContent: "center",
              backgroundColor:
                active && result
                  ? result.correct
                    ? colors.green
                    : colors.red
                  : active
                    ? colors.ink
                    : colors.option,
              opacity: hidden ? 0.3 : 1,
              borderWidth: marked ? 2 : 0,
              borderColor: colors.red,
            }}
          >
            <Text
              style={[
                s.text,
                {
                  color: active ? "white" : colors.ink,
                  textDecorationLine: marked ? "line-through" : "none",
                },
              ]}
            >
              {o.key}. {hidden ? "—" : o.text}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}
