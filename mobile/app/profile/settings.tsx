// mobile/app/profile/settings.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import { Icon } from "../../components/ui/Icon";
import { useAudio } from "../../context/AudioContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { userProfile, fetchProfile } = useAuth();
  const { audioEnabled, volume: ctxVolume, toggleAudio, setVolumeLevel, playSfx } = useAudio();

  const [audioAktif, setAudioAktif] = useState(audioEnabled);
  const [volume, setVolume] = useState(ctxVolume);
  const [saving, setSaving] = useState(false);

  const volumePresets = [
    { label: "Mute (0%)", val: 0.0 },
    { label: "25%", val: 0.25 },
    { label: "50%", val: 0.5 },
    { label: "75%", val: 0.75 },
    { label: "Max (100%)", val: 1.0 },
  ];

  const handleToggle = (val: boolean) => {
    setAudioAktif(val);
    toggleAudio(val);
    if (val) playSfx("click");
  };

  const handleSelectVolume = (val: number) => {
    setVolume(val);
    setVolumeLevel(val);
    playSfx("click");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await profileService.updateSettings({
        audio_aktif: audioAktif,
        volume_audio: volume,
      });
      await toggleAudio(audioAktif);
      await setVolumeLevel(volume);
      await fetchProfile();
      playSfx("correct");
      Alert.alert("Pengaturan Disimpan", "Preferensi audio kamu telah berhasil disimpan.");
    } catch (err: any) {
      playSfx("wrong");
      Alert.alert("Gagal Menyimpan", err.message || "Terjadi kesalahan pada server");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Top App Bar */}
      <View className="pt-12 pb-4 px-5 flex-row items-center justify-between border-b border-surface-light bg-surface/80">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-light/60 items-center justify-center border border-slate-700"
        >
          <Icon name="ChevronLeftIcon" variant="outline" size={20} color="#f8fafc" />
        </TouchableOpacity>
        <Text className="text-text font-black text-lg">Pengaturan Aplikasi</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Audio Section */}
        <View className="bg-surface border border-surface-light rounded-3xl p-5 mb-5 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-9 h-9 rounded-xl bg-blue-500/20 items-center justify-center mr-3">
              <Icon
                name={audioAktif ? "SpeakerWaveIcon" : "SpeakerXMarkIcon"}
                variant="solid"
                size={20}
                color="#3b82f6"
              />
            </View>
            <View>
              <Text className="text-text font-bold text-base">Suara & Audio Game</Text>
              <Text className="text-subtext text-xs">Musik latar BGM dan efek suara pertarungan</Text>
            </View>
          </View>

          {/* Toggle Switch */}
          <View className="flex-row items-center justify-between py-3 border-t border-surface-light">
            <View>
              <Text className="text-text font-semibold text-sm">Aktifkan Suara</Text>
              <Text className="text-subtext text-xs">Suara dungeon, tebasan, dan combo</Text>
            </View>
            <Switch
              value={audioAktif}
              onValueChange={handleToggle}
              trackColor={{ false: "#334155", true: "#2563eb" }}
              thumbColor={audioAktif ? "#ffffff" : "#94a3b8"}
            />
          </View>

          {/* Volume Presets */}
          <View className="pt-4 border-t border-surface-light">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-text font-semibold text-sm">Tingkat Volume</Text>
              <Text className="text-blue-400 font-extrabold text-xs">
                {Math.round(volume * 100)}%
              </Text>
            </View>

            <View className="flex-row justify-between">
              {volumePresets.map((preset) => {
                const isSelected = Math.abs(volume - preset.val) < 0.05;
                return (
                  <TouchableOpacity
                    key={preset.label}
                    disabled={!audioAktif}
                    onPress={() => handleSelectVolume(preset.val)}
                    className={`px-3 py-2 rounded-xl border ${
                      !audioAktif
                        ? "opacity-30 bg-slate-800 border-slate-700"
                        : isSelected
                        ? "bg-primary/20 border-primary"
                        : "bg-surface-light/40 border-slate-700"
                    }`}
                  >
                    <Text
                      className={`font-bold text-xs ${
                        isSelected && audioAktif ? "text-blue-400" : "text-slate-400"
                      }`}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Save Audio Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="bg-primary p-4 rounded-2xl items-center justify-center mb-6 shadow-md shadow-blue-500/20 active:opacity-90"
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-sm tracking-wide">
              Simpan Pengaturan Audio
            </Text>
          )}
        </TouchableOpacity>

        {/* Application Information */}
        <View className="bg-surface border border-surface-light rounded-3xl p-5 mb-12 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="w-9 h-9 rounded-xl bg-purple-500/20 items-center justify-center mr-3">
              <Icon name="InformationCircleIcon" variant="solid" size={20} color="#a855f7" />
            </View>
            <View>
              <Text className="text-text font-bold text-base">Tentang Edungeon</Text>
              <Text className="text-subtext text-xs">Gamified Roguelike Learning App</Text>
            </View>
          </View>

          <View className="space-y-2 pt-2 border-t border-surface-light">
            <View className="flex-row justify-between py-1.5">
              <Text className="text-subtext text-xs">Versi Aplikasi</Text>
              <Text className="text-slate-300 font-semibold text-xs">v1.0.0 (SDK 57)</Text>
            </View>
            <View className="flex-row justify-between py-1.5">
              <Text className="text-subtext text-xs">Basis Database</Text>
              <Text className="text-slate-300 font-semibold text-xs">Firebase Cloud Firestore</Text>
            </View>
            <View className="flex-row justify-between py-1.5">
              <Text className="text-subtext text-xs">Arsitektur Game</Text>
              <Text className="text-slate-300 font-semibold text-xs">Deterministic Turn-based</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
