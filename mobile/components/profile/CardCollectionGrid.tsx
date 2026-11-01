// mobile/components/profile/CardCollectionGrid.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { CardCollectionItem } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface CardCollectionGridProps {
  cards: CardCollectionItem[];
}

// Katalog Baku 12 Kartu Edungeon
const DEFAULT_CARDS: CardCollectionItem[] = [
  {
    id_kartu: "K01",
    nama_kartu: "Perisai Tak Ditembus",
    class_kartu: "knight",
    deskripsi: "Meningkatkan pertahanan fisik sebesar 20% dan mengurangi luka serangan monster.",
    terbuka: false,
  },
  {
    id_kartu: "K02",
    nama_kartu: "Serangan Balik Berduri",
    class_kartu: "knight",
    deskripsi: "Memantulkan 15% damage serangan kembali ke monster penyerang.",
    terbuka: false,
  },
  {
    id_kartu: "K03",
    nama_kartu: "Tekad Baja",
    class_kartu: "knight",
    deskripsi: "Saat HP kritis di bawah 30%, memulihkan +10 HP otomatis setiap giliran.",
    terbuka: false,
  },
  {
    id_kartu: "K04",
    nama_kartu: "Aura Kesatria",
    class_kartu: "knight",
    deskripsi: "Mendapatkan bonus perolehan EXP +15% di akhir pertempuran lantai.",
    terbuka: false,
  },
  {
    id_kartu: "K05",
    nama_kartu: "Badai Petir Arcane",
    class_kartu: "mage",
    deskripsi: "Menghasilkan bonus 25 luka sihir petir saat berhasil menjawab soal matematika.",
    terbuka: false,
  },
  {
    id_kartu: "K06",
    nama_kartu: "Aliran Mana Cepat",
    class_kartu: "mage",
    deskripsi: "Mempercepat pemulihan energi sihir dan mengurangi jeda waktu skill.",
    terbuka: false,
  },
  {
    id_kartu: "K07",
    nama_kartu: "Ledakan Intelek",
    class_kartu: "mage",
    deskripsi: "Menambah EXP +20% jika siswa berhasil menjawab 3 pertanyaan berturut-turut.",
    terbuka: false,
  },
  {
    id_kartu: "K08",
    nama_kartu: "Pembekuan Waktu",
    class_kartu: "mage",
    deskripsi: "Membekukan gerakan monster selama 1 putaran pertempuran.",
    terbuka: false,
  },
  {
    id_kartu: "K09",
    nama_kartu: "Panah Ganda Presisi",
    class_kartu: "archer",
    deskripsi: "Peluang 30% meluncurkan 2 anak panah sekaligus saat menyerang.",
    terbuka: false,
  },
  {
    id_kartu: "K10",
    nama_kartu: "Tembakan Angin Puyuh",
    class_kartu: "archer",
    deskripsi: "Meningkatkan kemampuan menghindar (dodge) siswa hingga 20%.",
    terbuka: false,
  },
  {
    id_kartu: "K11",
    nama_kartu: "Mata Elang Kritis",
    class_kartu: "archer",
    deskripsi: "Meningkatkan peluang serangan kritikal sebesar 25%.",
    terbuka: false,
  },
  {
    id_kartu: "K12",
    nama_kartu: "Langkah Bayangan Cepat",
    class_kartu: "archer",
    deskripsi: "Memberikan kekebalan dari serangan pertama musuh di tiap lantai dungeon.",
    terbuka: false,
  },
];

export const CardCollectionGrid: React.FC<CardCollectionGridProps> = ({ cards = [] }) => {
  const [selectedCard, setSelectedCard] = useState<CardCollectionItem | null>(null);

  // Gabungkan katalog baku dengan status siswa
  const displayCards: CardCollectionItem[] = DEFAULT_CARDS.map((defCard) => {
    const userCard = cards.find((c) => c.id_kartu === defCard.id_kartu);
    return userCard ? { ...defCard, terbuka: userCard.terbuka, tgl_didapat: userCard.tgl_didapat } : defCard;
  });

  const totalTerbuka = displayCards.filter((c) => c.terbuka).length;

  const getClassTheme = (cardClass: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        bg: "bg-surface/50",
        border: "border-surface-light/40",
        tagBg: "bg-surface-light/40",
        tagText: "text-subtext",
        iconColor: "#64748b",
      };
    }

    switch (cardClass) {
      case "knight":
        return {
          bg: "bg-blue-950/40",
          border: "border-blue-500/60",
          tagBg: "bg-blue-500/20",
          tagText: "text-blue-400",
          iconColor: "#3b82f6",
        };
      case "mage":
        return {
          bg: "bg-cyan-950/40",
          border: "border-cyan-500/60",
          tagBg: "bg-cyan-500/20",
          tagText: "text-cyan-400",
          iconColor: "#06b6d4",
        };
      case "archer":
        return {
          bg: "bg-emerald-950/40",
          border: "border-emerald-500/60",
          tagBg: "bg-emerald-500/20",
          tagText: "text-emerald-400",
          iconColor: "#10b981",
        };
      default:
        return {
          bg: "bg-amber-950/40",
          border: "border-amber-500/60",
          tagBg: "bg-amber-500/20",
          tagText: "text-amber-400",
          iconColor: "#f59e0b",
        };
    }
  };

  return (
    <View className="mb-6">
      {/* Header Koleksi Kartu */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <View>
          <Text className="text-text font-bold text-lg">Koleksi Kartu Power-Up</Text>
          <Text className="text-subtext text-xs">Kartu Peningkat Kekuatan di Dungeon</Text>
        </View>
        <View className="bg-surface-light/50 px-2.5 py-1 rounded-full border border-surface-light">
          <Text className="text-exp text-xs font-bold">
            {totalTerbuka} / {displayCards.length}
          </Text>
        </View>
      </View>

      {/* Grid Kartu 3 Kolom */}
      <View className="flex-row flex-wrap justify-between">
        {displayCards.map((card) => {
          const theme = getClassTheme(card.class_kartu, card.terbuka);

          return (
            <TouchableOpacity
              key={card.id_kartu}
              onPress={() => setSelectedCard(card)}
              activeOpacity={0.7}
              className={`w-[31%] aspect-[3/4] ${theme.bg} border ${theme.border} rounded-2xl p-2.5 mb-3.5 items-center justify-between shadow-sm`}
            >
              {/* ID Badge Atas */}
              <View className="w-full flex-row justify-between items-center">
                <Text className="text-subtext text-[10px] font-bold">{card.id_kartu}</Text>
                {card.terbuka ? (
                  <View className={`px-1.5 py-0.5 rounded ${theme.tagBg}`}>
                    <Text className={`text-[8px] font-extrabold uppercase ${theme.tagText}`}>
                      {card.class_kartu}
                    </Text>
                  </View>
                ) : (
                  <Icon name="LockClosedIcon" variant="solid" size={12} color="#64748b" />
                )}
              </View>

              {/* Icon Utama Kartu */}
              <View className="items-center justify-center my-auto">
                <Icon
                  name={
                    card.class_kartu === "knight"
                      ? "ShieldCheckIcon"
                      : card.class_kartu === "mage"
                      ? "SparklesIcon"
                      : "BoltIcon"
                  }
                  variant="solid"
                  size={30}
                  color={theme.iconColor}
                />
              </View>

              {/* Nama Kartu di Bawah */}
              <Text
                className={`text-[11px] font-semibold text-center leading-tight ${
                  card.terbuka ? "text-text" : "text-subtext"
                }`}
                numberOfLines={2}
              >
                {card.nama_kartu}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal Detail Kartu */}
      <Modal
        visible={!!selectedCard}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCard(null)}
      >
        <View className="flex-1 bg-black/75 justify-center items-center p-5">
          <View className="w-full max-w-sm bg-surface border border-surface-light rounded-3xl p-6 shadow-2xl">
            {selectedCard && (
              <>
                <View className="items-center mb-4">
                  <View
                    className={`w-16 h-16 rounded-2xl items-center justify-center mb-3 ${
                      getClassTheme(selectedCard.class_kartu, selectedCard.terbuka).bg
                    } border ${getClassTheme(selectedCard.class_kartu, selectedCard.terbuka).border}`}
                  >
                    <Icon
                      name={
                        selectedCard.class_kartu === "knight"
                          ? "ShieldCheckIcon"
                          : selectedCard.class_kartu === "mage"
                          ? "SparklesIcon"
                          : "BoltIcon"
                      }
                      variant="solid"
                      size={36}
                      color={getClassTheme(selectedCard.class_kartu, selectedCard.terbuka).iconColor}
                    />
                  </View>

                  <Text className="text-text font-bold text-xl text-center">
                    {selectedCard.nama_kartu}
                  </Text>
                  <View className="flex-row items-center mt-1 space-x-2">
                    <Text className="text-subtext text-xs uppercase font-semibold">
                      ID: {selectedCard.id_kartu} • Role: {selectedCard.class_kartu}
                    </Text>
                  </View>
                </View>

                {/* Status Terbuka / Terkunci */}
                <View
                  className={`p-3 rounded-xl mb-4 border ${
                    selectedCard.terbuka
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-surface-light/40 border-surface-light"
                  }`}
                >
                  <View className="flex-row items-center justify-center">
                    <Icon
                      name={selectedCard.terbuka ? "CheckCircleIcon" : "LockClosedIcon"}
                      variant="solid"
                      size={18}
                      color={selectedCard.terbuka ? "#22c55e" : "#94a3b8"}
                    />
                    <Text
                      className={`text-xs font-bold ml-2 ${
                        selectedCard.terbuka ? "text-green-400" : "text-subtext"
                      }`}
                    >
                      {selectedCard.terbuka
                        ? "Kartu Sudah Diperoleh!"
                        : "Kartu Terkunci (Dapatkan di Dungeon)"}
                    </Text>
                  </View>
                </View>

                {/* Deskripsi Efek */}
                <View className="bg-background/80 p-4 rounded-2xl border border-surface-light/50 mb-6">
                  <Text className="text-subtext text-xs font-semibold uppercase mb-1">
                    Efek Kartu:
                  </Text>
                  <Text className="text-text text-sm leading-relaxed">
                    {selectedCard.deskripsi}
                  </Text>
                </View>

                {/* Tombol Tutup */}
                <TouchableOpacity
                  onPress={() => setSelectedCard(null)}
                  className="w-full bg-primary py-3.5 rounded-xl items-center"
                  activeOpacity={0.8}
                >
                  <Text className="text-text font-bold text-base">Tutup</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
