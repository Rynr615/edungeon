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
  const { fetchProfile } = useAuth();
  const { audioEnabled, volume: ctxVolume, toggleAudio, setVolumeLevel, playSfx } = useAudio();

  const [audioAktif, setAudioAktif] = useState(audioEnabled);
  const [volume, setVolume] = useState(ctxVolume);
  const [saving, setSaving] = useState(false);

  const volumePresets = [
    { label: "Mute", val: 0.0 },
    { label: "25%", val: 0.25 },
    { label: "50%", val: 0.5 },
    { label: "75%", val: 0.75 },
    { label: "100%", val: 1.0 },
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
      Alert.alert("Berhasil", "Pengaturan audio berhasil disimpan.");
    } catch (err: any) {
      playSfx("wrong");
      Alert.alert("Gagal", err.message || "Terjadi kesalahan pada server");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Top App Bar */}
      <View className="pt-12 pb-4 px-6 flex-row items-center justify-between border-b border-gray-100 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center border border-gray-200"
        >
          <Icon name="ChevronLeftIcon" variant="outline" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={{ fontFamily: "DMSans_700Bold" }} className="text-gray-900 text-xl tracking-tight">Settings</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Audio Section */}
        <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-xs">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mr-3">
              <Icon
                name={audioAktif ? "SpeakerWaveIcon" : "SpeakerXMarkIcon"}
                variant="solid"
                size={20}
                color="#6366f1"
              />
            </View>
            <View>
              <Text className="font-mono text-gray-900 font-bold text-base">Suara & Audio Game</Text>
              <Text className="font-mono text-gray-400 text-xs">Musik latar BGM dan efek suara pertarungan</Text>
            </View>
          </View>

          {/* Toggle Switch */}
          <View className="flex-row items-center justify-between py-3 border-t border-gray-100">
            <View>
              <Text className="font-mono text-gray-900 font-semibold text-sm">Aktifkan Suara</Text>
              <Text className="font-mono text-gray-400 text-xs">Suara dungeon, tebasan, dan combo</Text>
            </View>
            <Switch
              value={audioAktif}
              onValueChange={handleToggle}
              trackColor={{ false: "#e5e7eb", true: "#6366f1" }}
              thumbColor={audioAktif ? "#ffffff" : "#9ca3af"}
            />
          </View>

          {/* Volume Presets */}
          <View className="pt-4 border-t border-gray-100">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-mono text-gray-900 font-semibold text-sm">Tingkat Volume</Text>
              <Text className="font-mono text-indigo-600 font-bold text-xs">
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
                        ? "opacity-30 bg-gray-50 border-gray-200"
                        : isSelected
                        ? "bg-indigo-50 border-indigo-500"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-mono font-bold text-xs ${
                        isSelected && audioAktif ? "text-indigo-600" : "text-gray-600"
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
          className="bg-gray-900 p-4 rounded-xl items-center justify-center mb-6 shadow-xs active:opacity-90"
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-sm tracking-wide">
              Simpan Pengaturan
            </Text>
          )}
        </TouchableOpacity>

        {/* Application Information */}
        <View className="bg-white border border-gray-200 rounded-2xl p-5 mb-12 shadow-xs">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-3">
              <Icon name="InformationCircleIcon" variant="solid" size={20} color="#64748b" />
            </View>
            <View>
              <Text className="text-gray-900 font-bold text-base">Tentang Edungeon</Text>
              <Text className="text-gray-400 text-xs">Gamified Roguelike Learning App</Text>
            </View>
          </View>

          <View className="space-y-2 pt-2 border-t border-gray-100">
            <View className="flex-row justify-between py-1.5">
              <Text className="text-gray-500 text-xs">Versi Aplikasi</Text>
              <Text className="font-mono text-gray-900 font-semibold text-xs">v1.0.0 (SDK 57)</Text>
            </View>
            <View className="flex-row justify-between py-1.5">
              <Text className="text-gray-500 text-xs">Basis Database</Text>
              <Text className="font-mono text-gray-900 font-semibold text-xs">Firebase Cloud Firestore</Text>
            </View>
            <View className="flex-row justify-between py-1.5">
              <Text className="text-gray-500 text-xs">Arsitektur Game</Text>
              <Text className="font-mono text-gray-900 font-semibold text-xs">Deterministic Roguelike</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
