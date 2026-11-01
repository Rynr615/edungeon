import React from "react";
import { View, Text, Pressable } from "react-native";
import { Run } from "../../types/battle";
import { s } from "./styles";
export function SkillActionPanel({
  run,
  disabled,
  onSkill,
}: {
  run: Run;
  disabled: boolean;
  onSkill: (s: "mage" | "arcane" | "aim") => void;
}) {
  const skills: {
    id: "mage" | "arcane" | "aim";
    name: string;
    disabled: boolean;
  }[] = [];
  if (run.heroClass === "mage")
    skills.push({
      id: "mage",
      name: `Kaca Pembesar (${run.mage}/${run.mageCap})`,
      disabled: run.mage === 0 || !!run.question?.mageUsed,
    });
  if (run.card === "K11")
    skills.push({
      id: "arcane",
      name: "Ingatan Arcane",
      disabled: run.arcaneUsed,
    });
  if (run.card === "K12")
    skills.push({ id: "aim", name: "Bidikan Terarah", disabled: run.aimUsed });
  return (
    <View style={{ gap: 8 }}>
      {skills.map((skill) => (
        <Pressable
          key={skill.id}
          disabled={disabled || skill.disabled}
          onPress={() => onSkill(skill.id)}
          style={[
            s.button,
            {
              backgroundColor: "#58447e",
              opacity: disabled || skill.disabled ? 0.4 : 1,
            },
          ]}
        >
          <Text style={s.buttonText}>{skill.name}</Text>
        </Pressable>
      ))}
      {run.heroClass === "knight" && (
        <Text style={s.muted}>
          Shield otomatis menyerap serangan • pulih +1 tiap stage.
        </Text>
      )}
      {run.heroClass === "archer" && (
        <Text style={s.muted}>Dodge aktif otomatis saat musuh menyerang.</Text>
      )}
    </View>
  );
}
