// mobile/components/profile/KoleksiCard.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import {
  SwordIcon,
  BlackHeartIcon,
  BlackShieldIcon,
  MedalBadgeIcon,
  SunBadgeIcon,
  RedLockBadgeIcon,
} from "./WireframeIcons";
import { CardCollectionItem, BadgeItem } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface KoleksiCardProps {
  cards?: CardCollectionItem[];
  badges?: BadgeItem[];
}

export const KoleksiCard: React.FC<KoleksiCardProps> = ({ cards = [], badges = [] }) => {
  const [selectedDetail, setSelectedDetail] = useState<{
    title: string;
    description: string;
    type: "card" | "badge";
  } | null>(null);

  return (
    <View className="mb-5">
      {/* Container Kotak Koleksi */}
      <View className="bg-[#DBE4EC] rounded-2xl p-4">
        <Text className="text-[#0f172a] text-sm font-bold mb-3 font-mono">
          Koleksi
        </Text>

        {/* Baris 3 Kartu Buff Putih */}
        <View className="flex-row justify-between mb-4">
          {/* Card 1: ATK+2 */}
          <TouchableOpacity
            onPress={() =>
              setSelectedDetail({
                title: "Pedang Ksatria (ATK+2)",
                description: "Meningkatkan daya serang dasar hero sebesar +2 setiap ronde pertempuran.",
                type: "card",
              })
            }
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-2xl p-3 mx-1 items-center justify-center shadow-xs border border-gray-100"
          >
            <SwordIcon size={24} color="#0f172a" />
            <Text className="text-[#0f172a] text-xs font-bold font-mono mt-1.5">
              ATK+2
            </Text>
          </TouchableOpacity>

          {/* Card 2: HP+15 */}
          <TouchableOpacity
            onPress={() =>
              setSelectedDetail({
                title: "Kristal Darah (HP+15)",
                description: "Meningkatkan kapasitas maksimal darah hero sebesar +15 poin.",
                type: "card",
              })
            }
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-2xl p-3 mx-1 items-center justify-center shadow-xs border border-gray-100"
          >
            <BlackHeartIcon size={22} color="#0f172a" />
            <Text className="text-[#0f172a] text-xs font-bold font-mono mt-1.5">
              HP+15
            </Text>
          </TouchableOpacity>

          {/* Card 3: DEF+4 */}
          <TouchableOpacity
            onPress={() =>
              setSelectedDetail({
                title: "Perisai Besi (DEF+4)",
                description: "Meningkatkan pertahanan hero sebesar +4 poin untuk meredam serangan monster.",
                type: "card",
              })
            }
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-2xl p-3 mx-1 items-center justify-center shadow-xs border border-gray-100"
          >
            <BlackShieldIcon size={22} color="#0f172a" />
            <Text className="text-[#0f172a] text-xs font-bold font-mono mt-1.5">
              DEF+4
            </Text>
          </TouchableOpacity>
        </View>

        {/* Baris Badges Bulat */}
        <View className="flex-row items-center pt-1 border-t border-gray-300/40">
          {/* Badge 1: Medal */}
          <TouchableOpacity
            onPress={() =>
              setSelectedDetail({
                title: "Medali Kehormatan (B01)",
                description: "Lencana pencapaian menyelesaikan floor pertama petualangan dungeon.",
                type: "badge",
              })
            }
            activeOpacity={0.8}
            className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-xs mr-3 border border-gray-200"
          >
            <MedalBadgeIcon size={24} />
          </TouchableOpacity>

          {/* Badge 2: Sun */}
          <TouchableOpacity
            onPress={() =>
              setSelectedDetail({
                title: "Bintang Cendekia (B02)",
                description: "Lencana pencapaian menjawab soal tanpa salah secara beruntun.",
                type: "badge",
              })
            }
            activeOpacity={0.8}
            className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-xs mr-3 border border-gray-200"
          >
            <SunBadgeIcon size={24} />
          </TouchableOpacity>

          {/* Badge 3: Red Lock */}
          <TouchableOpacity
            onPress={() =>
              setSelectedDetail({
                title: "Lencana Terkunci (B03)",
                description: "Kalahkan Boss lantai berikutnya untuk membuka lencana misterius ini.",
                type: "badge",
              })
            }
            activeOpacity={0.8}
            className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-xs mr-3 border border-gray-200"
          >
            <RedLockBadgeIcon size={22} />
          </TouchableOpacity>

          {/* Badge 4: Red Lock */}
          <TouchableOpacity
            onPress={() =>
              setSelectedDetail({
                title: "Lencana Terkunci (B04)",
                description: "Selesaikan 10 tantangan dungeon untuk membuka lencana master ini.",
                type: "badge",
              })
            }
            activeOpacity={0.8}
            className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-xs border border-gray-200"
          >
            <RedLockBadgeIcon size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Detail Pop-up */}
      <Modal
        visible={!!selectedDetail}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDetail(null)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-5">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl">
            {selectedDetail && (
              <>
                <Text className="text-[#0f172a] text-lg font-bold mb-2">
                  {selectedDetail.title}
                </Text>
                <Text className="text-gray-600 text-sm leading-relaxed mb-5">
                  {selectedDetail.description}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedDetail(null)}
                  className="w-full bg-[#0f172a] py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-bold text-sm">Tutup</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
