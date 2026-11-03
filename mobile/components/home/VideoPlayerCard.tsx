// mobile/components/home/VideoPlayerCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { Icon } from "../ui/Icon";
import { COPY } from "../../constants/copy";

interface VideoPlayerCardProps {
  title?: string;
  videoId?: string;
  videoUrl?: string;
  durationMinutes?: number;
  className?: string;
}

export const VideoPlayerCard: React.FC<VideoPlayerCardProps> = ({
  title = "Video Edukasi Pendukung",
  videoId,
  videoUrl,
  durationMinutes = 8,
  className = "",
}) => {
  const targetUrl =
    videoUrl ||
    (videoId
      ? `https://www.youtube.com/watch?v=${videoId}`
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(
          title + " matematika kelas 10"
        )}`);

  const handleOpenVideo = async () => {
    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
      } else {
        await Linking.openURL(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`
        );
      }
    } catch (err: any) {
      Alert.alert("Video Tidak Dapat Dibuka", "Pastikan aplikasi YouTube atau peramban terpasang.");
    }
  };

  return (
    <View
      className={`bg-surface border border-border rounded-2xl overflow-hidden mb-5 shadow-sm ${className}`}
    >
      {/* Wadah Video Rasio 16:9 */}
      <View className="h-44 bg-surface-alt items-center justify-center relative">
        {/* Latar Belakang Desain Siluet Gelap */}
        <View className="absolute inset-0 bg-primary/5 items-center justify-center">
          <View className="w-16 h-16 rounded-full bg-red-600/90 items-center justify-center shadow-lg">
            <Icon name="PlayIcon" variant="solid" size={28} color="#ffffff" />
          </View>
        </View>

        {/* Badge Durasi di Pojok Kanan Bawah */}
        <View className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded-md flex-row items-center">
          <Icon name="ClockIcon" size={11} color="#f8fafc" />
          <Text className="text-white text-[10px] font-bold ml-1">
            ~{durationMinutes} Menit
          </Text>
        </View>
      </View>

      {/* Bagian Deskripsi & Tombol Aksi */}
      <View className="p-4">
        <View className="flex-row items-center mb-1">
          <Icon name="VideoCameraIcon" size={14} color="#ef4444" />
          <Text className="text-red-400 font-bold text-xs uppercase tracking-wider ml-1.5">
            {COPY.module.reader.youtubeTitle}
          </Text>
        </View>
        <Text className="text-text font-bold text-sm mb-3" numberOfLines={2}>
          {title}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOpenVideo}
          className="bg-red-600 py-3 rounded-xl flex-row items-center justify-center active:opacity-90"
        >
          <Icon name="PlayIcon" variant="solid" size={16} color="#ffffff" />
          <Text className="text-white font-bold text-xs ml-2">
            {COPY.module.reader.youtubeButton}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
