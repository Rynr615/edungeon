import React from "react";
import { Modal, ScrollView, Text, View, Pressable } from "react-native";
import { BuffCard } from "../../types/battle";
import { s, colors } from "./styles";
export function CardDraftModal({
  cards,
  busy,
  error,
  onSelect,
}: {
  cards: BuffCard[];
  busy: boolean;
  error: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Modal
      visible={cards.length > 0}
      animationType="slide"
      onRequestClose={() => {}}
    >
      <ScrollView
        contentContainerStyle={[
          s.content,
          { paddingTop: 60, flexGrow: 1, backgroundColor: "white" },
        ]}
      >
        <Text style={s.label}>MID-BOSS DIKALAHKAN</Text>
        <Text style={s.title}>Pilih kekuatanmu.</Text>
        <Text style={s.muted}>
          Pilih tepat satu kartu untuk Stage 6–10. Pilihanmu disimpan ke
          koleksi.
        </Text>
        {cards.map((card) => (
          <Pressable
            key={card.id}
            accessibilityLabel={`Pilih ${card.name}`}
            disabled={busy}
            onPress={() => onSelect(card.id)}
            style={[
              s.panel,
              {
                borderWidth: 1,
                borderColor: colors.yellow,
                opacity: busy ? 0.5 : 1,
              },
            ]}
          >
            <View style={s.row}>
              <Text style={s.label}>{card.id}</Text>
              <Text style={s.label}>{card.heroClass.toUpperCase()}</Text>
            </View>
            <Text style={[s.title, { fontSize: 19 }]}>{card.name}</Text>
            <Text style={s.text}>{card.description}</Text>
            <Text style={{ color: "#795b00", fontWeight: "700" }}>
              Pilih kartu →
            </Text>
          </Pressable>
        ))}
        {!!error && <Text style={s.error}>{error}</Text>}
      </ScrollView>
    </Modal>
  );
}
