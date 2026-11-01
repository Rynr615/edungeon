import React from "react";
import { View, Text, Image } from "react-native";
import { SvgUri } from "react-native-svg";
import { s } from "./styles";
export function QuestionBox({
  text,
  seconds,
}: {
  text: string;
  seconds: number;
}) {
  return (
    <View style={s.panel}>
      <View style={s.row}>
        <Text style={s.label}>PERTANYAAN</Text>
        <View
          style={{
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ position: "absolute" }}>
            <SvgUri
              uri={
                Image.resolveAssetSource(
                  require("../../assets/challenge/timer.svg"),
                ).uri
              }
            />
          </View>
          <Text
            accessibilityLabel={`${seconds} detik tersisa`}
            style={{
              color: "white",
              fontFamily: "monospace",
              fontWeight: "700",
            }}
          >
            {seconds}
          </Text>
        </View>
      </View>
      <Text style={[s.text, { fontSize: 17, lineHeight: 26 }]}>{text}</Text>
    </View>
  );
}
