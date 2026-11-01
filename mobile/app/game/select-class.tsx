import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HeroClass } from "../../types/battle";
import { battleService } from "../../services/battleService";
import { ChallengeHeader } from "../../components/challenge/ChallengeHeader";
import { Sprite } from "../../components/challenge/Sprite";
import { s, colors } from "../../components/challenge/styles";
const heroes: {
  id: HeroClass;
  name: string;
  role: string;
  description: string;
}[] = [
  {
    id: "knight",
    name: "Knight",
    role: "TANKER",
    description:
      "Shield menyerap 1 serangan. Pulih +1 charge pada awal setiap stage.",
  },
  {
    id: "mage",
    name: "Mage",
    role: "TAKTIKAL",
    description:
      "3 charge Kaca Pembesar. Hilangkan 2 opsi salah; pulih +1 tiap 2 stage.",
  },
  {
    id: "archer",
    name: "Archer",
    role: "PENGHINDAR",
    description:
      "Dodge otomatis: 30% di Stage 1–2, meningkat hingga 70% di Stage 9–10.",
  },
];
export default function SelectClass() {
  const { moduleId, restart } = useLocalSearchParams<{
    moduleId: string;
    restart?: string;
  }>();
  const router = useRouter();
  const [hero, setHero] = useState<HeroClass>("knight");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function start() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const run = await battleService.startRun(
        moduleId,
        hero,
        restart === "true",
      );
      router.replace(`/game/${run.stage}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={s.screen}>
      <ChallengeHeader back />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.label}>PETUALANGAN BARU</Text>
        <Text style={s.title}>Pilih Hero Class.</Text>
        <Text style={s.muted}>
          HP 3 • Attack 10 • Class terkunci sampai run berakhir.
        </Text>
        {heroes.map((h) => (
          <Pressable
            key={h.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: hero === h.id }}
            disabled={busy}
            onPress={() => setHero(h.id)}
            style={[
              s.panel,
              {
                borderWidth: 2,
                borderColor: hero === h.id ? colors.ink : "transparent",
                backgroundColor: hero === h.id ? "#fff4ca" : colors.panel,
              },
            ]}
          >
            <View style={s.row}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={s.label}>{h.role}</Text>
                <Text style={s.title}>{h.name}</Text>
                <Text style={s.text}>{h.description}</Text>
              </View>
              <Sprite hero={h.id} size={56} />
            </View>
          </Pressable>
        ))}
        {!!error && <Text style={s.error}>{error}</Text>}
        <Pressable
          disabled={busy}
          onPress={start}
          style={[s.button, { opacity: busy ? 0.5 : 1 }]}
        >
          <Text style={s.buttonText}>
            {busy ? "Menyiapkan dungeon…" : "Masuki dungeon →"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
