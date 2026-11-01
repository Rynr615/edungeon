// mobile/components/profile/BadgeGallery.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { BadgeItem } from "../../types/profile";
import { Icon, IconName } from "../ui/Icon";

interface BadgeGalleryProps {
  badges: BadgeItem[];
}

// Katalog Baku 15 Badge Pencapaian Edungeon
const DEFAULT_BADGES: BadgeItem[] = [
  {
    id_badge: "B01",
    nama_badge: "Langkah Pertama",
    deskripsi: "Selesaikan pertarungan atau soal pertama di dungeon.",
    kategori: "universal",
    icon_name: "SparklesIcon",
    terbuka: false,
  },
  {
    id_badge: "B02",
    nama_badge: "Murid Cekatan",
    deskripsi: "Menjawab 10 soal dungeon dengan benar.",
    kategori: "universal",
    icon_name: "BoltIcon",
    terbuka: false,
  },
  {
    id_badge: "B03",
    nama_badge: "Pejuang Tangguh",
    deskripsi: "Kalahkan 10 monster musuh di ruang dungeon.",
    kategori: "universal",
    icon_name: "ShieldExclamationIcon",
    terbuka: false,
  },
  {
    id_badge: "B04",
    nama_badge: "Penakluk Bos",
    deskripsi: "Kalahkan setidaknya 1 Boss Lantai Dungeon.",
    kategori: "universal",
    icon_name: "TrophyIcon",
    terbuka: false,
  },
  {
    id_badge: "B05",
    nama_badge: "Ahli Matematika",
    deskripsi: "Jawab 15 soal materi Matematika dengan benar.",
    kategori: "universal",
    icon_name: "AcademicCapIcon",
    terbuka: false,
  },
  {
    id_badge: "B06",
    nama_badge: "Jago Informatika",
    deskripsi: "Jawab 15 soal materi Informatika dengan benar.",
    kategori: "universal",
    icon_name: "CpuChipIcon",
    terbuka: false,
  },
  {
    id_badge: "B07",
    nama_badge: "Kolektor Pemula",
    deskripsi: "Kumpulkan minimal 3 kartu buff power-up di dungeon.",
    kategori: "universal",
    icon_name: "RectangleStackIcon",
    terbuka: false,
  },
  {
    id_badge: "B08",
    nama_badge: "Benteng Tak Tertembus",
    deskripsi: "Khusus Knight: Menangkan pertarungan dengan HP di atas 50%.",
    kategori: "knight",
    icon_name: "ShieldCheckIcon",
    terbuka: false,
  },
  {
    id_badge: "B09",
    nama_badge: "Badai Mantra",
    deskripsi: "Khusus Mage: Jawab 5 soal matematika beruntun tanpa salah.",
    kategori: "mage",
    icon_name: "SparklesIcon",
    terbuka: false,
  },
  {
    id_badge: "B10",
    nama_badge: "Bidikan Maut",
    deskripsi: "Khusus Archer: Berhasil melancarkan 5 serangan kritikal.",
    kategori: "archer",
    icon_name: "EyeIcon",
    terbuka: false,
  },
  {
    id_badge: "B11",
    nama_badge: "Sarjana Sempurna",
    deskripsi: "Raih akurasi 100% pada satu sesi penjelajahan dungeon penuh.",
    kategori: "universal",
    icon_name: "StarIcon",
    terbuka: false,
  },
  {
    id_badge: "B12",
    nama_badge: "Penguasa Ruang Bawah",
    deskripsi: "Berhasil menembus dan menyelesaikan Lantai 5 (Floor 5).",
    kategori: "universal",
    icon_name: "KeyIcon",
    terbuka: false,
  },
  {
    id_badge: "B13",
    nama_badge: "Kolektor Sempurna",
    deskripsi: "Kumpulkan lengkap seluruh 12 Kartu Power-Up Edungeon.",
    kategori: "universal",
    icon_name: "GiftIcon",
    terbuka: false,
  },
  {
    id_badge: "B14",
    nama_badge: "Pahlawan Legendaris",
    deskripsi: "Capai Level 10 atau raih total akumulasi 1.000 EXP.",
    kategori: "universal",
    icon_name: "FireIcon",
    terbuka: false,
  },
  {
    id_badge: "B15",
    nama_badge: "Penguasa Peringkat",
    deskripsi: "Raih peringkat #1 teratas pada Leaderboard Siswa.",
    kategori: "universal",
    icon_name: "TrophyIcon",
    terbuka: false,
  },
];

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ badges = [] }) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  // Padankan status siswa dengan 15 katalog baku
  const displayBadges: BadgeItem[] = DEFAULT_BADGES.map((defBadge) => {
    const userBadge = badges.find((b) => b.id_badge === defBadge.id_badge);
    return userBadge
      ? { ...defBadge, terbuka: userBadge.terbuka, tgl_perolehan: userBadge.tgl_perolehan }
      : defBadge;
  });

  const totalTerbuka = displayBadges.filter((b) => b.terbuka).length;

  return (
    <View className="mb-6">
      {/* Header Galeri Badge */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <View>
          <Text className="text-text font-bold text-lg">Lencana Prestasi</Text>
          <Text className="text-subtext text-xs">Pencapaian Petualangan & Belajar</Text>
        </View>
        <View className="bg-surface-light/50 px-2.5 py-1 rounded-full border border-surface-light">
          <Text className="text-exp text-xs font-bold">
            {totalTerbuka} / {displayBadges.length}
          </Text>
        </View>
      </View>

      {/* Grid 5 Kolom Badge */}
      <View className="bg-surface border border-surface-light p-4 rounded-3xl">
        <View className="flex-row flex-wrap justify-between">
          {displayBadges.map((badge) => {
            const isUnlocked = badge.terbuka;
            const iconColor = isUnlocked ? "#eab308" : "#64748b";

            return (
              <TouchableOpacity
                key={badge.id_badge}
                onPress={() => setSelectedBadge(badge)}
                activeOpacity={0.7}
                className="w-[18%] items-center mb-3"
              >
                <View
                  className={`w-12 h-12 rounded-2xl items-center justify-center border ${
                    isUnlocked
                      ? "bg-amber-500/15 border-amber-500/50 shadow-sm"
                      : "bg-background/80 border-surface-light/40"
                  }`}
                >
                  {isUnlocked ? (
                    <Icon
                      name={(badge.icon_name as IconName) || "SparklesIcon"}
                      variant="solid"
                      size={22}
                      color={iconColor}
                    />
                  ) : (
                    <Icon name="LockClosedIcon" variant="solid" size={18} color="#64748b" />
                  )}
                </View>
                <Text
                  className={`text-[9px] font-medium text-center mt-1 ${
                    isUnlocked ? "text-text" : "text-subtext"
                  }`}
                  numberOfLines={1}
                >
                  {badge.nama_badge}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Modal Detail Badge */}
      <Modal
        visible={!!selectedBadge}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View className="flex-1 bg-black/75 justify-center items-center p-5">
          <View className="w-full max-w-sm bg-surface border border-surface-light rounded-3xl p-6 shadow-2xl">
            {selectedBadge && (
              <>
                <View className="items-center mb-4">
                  <View
                    className={`w-20 h-20 rounded-3xl items-center justify-center mb-3 border ${
                      selectedBadge.terbuka
                        ? "bg-amber-500/20 border-amber-500/60"
                        : "bg-surface-light/30 border-surface-light"
                    }`}
                  >
                    <Icon
                      name={
                        selectedBadge.terbuka
                          ? ((selectedBadge.icon_name as IconName) || "SparklesIcon")
                          : "LockClosedIcon"
                      }
                      variant="solid"
                      size={40}
                      color={selectedBadge.terbuka ? "#eab308" : "#94a3b8"}
                    />
                  </View>

                  <Text className="text-text font-bold text-xl text-center">
                    {selectedBadge.nama_badge}
                  </Text>
                  <Text className="text-subtext text-xs uppercase font-semibold mt-0.5">
                    ID: {selectedBadge.id_badge} • Kategori: {selectedBadge.kategori}
                  </Text>
                </View>

                {/* Status Lencana */}
                <View
                  className={`p-3 rounded-xl mb-4 border ${
                    selectedBadge.terbuka
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-surface-light/40 border-surface-light"
                  }`}
                >
                  <View className="flex-row items-center justify-center">
                    <Icon
                      name={selectedBadge.terbuka ? "CheckCircleIcon" : "LockClosedIcon"}
                      variant="solid"
                      size={18}
                      color={selectedBadge.terbuka ? "#eab308" : "#94a3b8"}
                    />
                    <Text
                      className={`text-xs font-bold ml-2 ${
                        selectedBadge.terbuka ? "text-amber-400" : "text-subtext"
                      }`}
                    >
                      {selectedBadge.terbuka
                        ? "Lencana Sudah Terbuka!"
                        : "Lencana Masih Terkunci"}
                    </Text>
                  </View>
                  {selectedBadge.tgl_perolehan && (
                    <Text className="text-subtext text-[11px] text-center mt-1">
                      Diperoleh pada: {selectedBadge.tgl_perolehan}
                    </Text>
                  )}
                </View>

                {/* Syarat Membuka */}
                <View className="bg-background/80 p-4 rounded-2xl border border-surface-light/50 mb-6">
                  <Text className="text-subtext text-xs font-semibold uppercase mb-1">
                    Syarat Membuka:
                  </Text>
                  <Text className="text-text text-sm leading-relaxed">
                    {selectedBadge.deskripsi}
                  </Text>
                </View>

                {/* Tombol Tutup */}
                <TouchableOpacity
                  onPress={() => setSelectedBadge(null)}
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
