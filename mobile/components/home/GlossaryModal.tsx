// mobile/components/home/GlossaryModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Icon } from "../ui/Icon";

export interface GlossaryTerm {
  istilah: string;
  definisi: string;
  contoh?: string;
}

interface GlossaryModalProps {
  visible: boolean;
  onClose: () => void;
  terms?: GlossaryTerm[];
}

const DEFAULT_TERMS: GlossaryTerm[] = [
  {
    istilah: "Basis (Bilangan Pokok)",
    definisi:
      "Bilangan yang dikalikan berulang dalam suatu perpangkatan. Contoh pada 2^5, bilangan 2 adalah basis.",
    contoh: "2^3 -> 2 adalah basis",
  },
  {
    istilah: "Eksponen (Pangkat)",
    definisi:
      "Angka yang menunjukkan berapa kali bilangan pokok dikalikan dengan dirinya sendiri.",
    contoh: "a^n -> n adalah eksponen",
  },
  {
    istilah: "Logaritma",
    definisi:
      "Operasi kebalikan (invers) dari eksponensial. Mencari pangkat dari suatu bilangan pokok untuk menghasilkan nilai tertentu.",
    contoh: "^2log(8) = 3 karena 2^3 = 8",
  },
  {
    istilah: "Numerus / Argumen",
    definisi:
      "Bilangan yang dicari nilai logaritmanya. Syarat numerus harus selalu bernilai positif (> 0).",
    contoh: "^a log(b) -> b adalah numerus",
  },
  {
    istilah: "Barisan Aritmetika",
    definisi:
      "Barisan bilangan dengan selisih (beda) antara dua suku berurutan selalu bernilai tetap.",
    contoh: "2, 5, 8, 11... (beda = 3)",
  },
  {
    istilah: "Rasio (Geometri)",
    definisi:
      "Nilai perbandingan pembagian antara suatu suku dengan suku sebelumnya pada barisan geometri.",
    contoh: "r = U_n / U_(n-1)",
  },
];

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  visible,
  onClose,
  terms = DEFAULT_TERMS,
}) => {
  const [search, setSearch] = useState("");

  const filteredTerms = terms.filter(
    (t) =>
      t.istilah.toLowerCase().includes(search.toLowerCase()) ||
      t.definisi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/75 justify-end">
        <View className="bg-surface border-t-2 border-border rounded-t-3xl max-h-[85%] p-5 pb-8 shadow-2xl">
          {/* Header Glosarium */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-8 h-8 rounded-xl bg-primary/20 items-center justify-center mr-2.5 border border-primary/30">
                <Icon name="BookOpenIcon" size={18} color="#38bdf8" />
              </View>
              <View className="flex-1">
                <Text className="text-text font-bold text-base">
                  Glosarium Matematika
                </Text>
                <Text className="text-text-muted text-xs">
                  Kamus istilah cepat & konsep penting
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-surface-alt items-center justify-center border border-border"
            >
              <Icon name="XMarkIcon" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Kotak Pencarian Istilah */}
          <View className="bg-surface-alt border border-border rounded-xl px-3 py-2 flex-row items-center mb-4">
            <Icon name="MagnifyingGlassIcon" size={16} color="#94a3b8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Cari istilah matematika..."
              placeholderTextColor="#64748b"
              className="flex-1 text-text text-xs ml-2 py-0"
            />
          </View>

          {/* Daftar Istilah Scrollable */}
          <ScrollView
            className="space-y-3 mb-2"
            showsVerticalScrollIndicator={false}
          >
            {filteredTerms.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-text-muted text-xs">
                  Istilah "{search}" tidak ditemukan.
                </Text>
              </View>
            ) : (
              filteredTerms.map((t, idx) => (
                <View
                  key={idx}
                  className="bg-surface-alt/50 border border-border p-3.5 rounded-xl mb-2.5"
                >
                  <Text className="text-primary font-bold text-sm mb-1">
                    {t.istilah}
                  </Text>
                  <Text className="text-text/90 text-xs leading-relaxed mb-2">
                    {t.definisi}
                  </Text>
                  {t.contoh && (
                    <View className="bg-surface p-2 rounded-lg border border-border/60">
                      <Text className="text-accent-gold font-mono text-[11px]">
                        💡 Contoh: {t.contoh}
                      </Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
