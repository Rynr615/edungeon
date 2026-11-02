// mobile/components/profile/AudioSettingsModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAudio } from "../../context/AudioContext";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import { Icon } from "../ui/Icon";

interface AudioSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  visible,
  onClose,
  onSaved,
}) => {
  const { fetchProfile } = useAuth();
  const { audioEnabled, volume: ctxVolume, toggleAudio, setVolumeLevel, playSfx } = useAudio();

  const [audioAktif, setAudioAktif] = useState(audioEnabled);
  const [volume, setVolume] = useState(ctxVolume);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAudioAktif(audioEnabled);
    setVolume(ctxVolume);
  }, [audioEnabled, ctxVolume, visible]);

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
      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      playSfx("wrong");
      Alert.alert("Gagal", err.message || "Gagal menyimpan pengaturan audio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white border-t border-gray-200 rounded-t-3xl p-6 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-sky-50 items-center justify-center mr-2.5 border border-sky-100">
                <Icon name="SpeakerWaveIcon" variant="solid" size={18} color="#0284c7" />
              </View>
              <Text className="font-mono text-gray-900 font-bold text-lg">Pengaturan Audio</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Icon name="XMarkIcon" variant="outline" size={22} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Toggle Switch Audio Aktif */}
          <View className="flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl border border-gray-200 mb-4">
            <View className="flex-1 mr-3">
              <Text className="font-mono text-gray-900 font-bold text-sm">Audio & Musik</Text>
              <Text className="text-gray-500 font-mono text-xs mt-0.5">
                Aktifkan efek suara (SFX) dan latar musik (BGM)
              </Text>
            </View>
            <Switch
              value={audioAktif}
              onValueChange={handleToggle}
              trackColor={{ false: "#e2e8f0", true: "#0284c7" }}
              thumbColor={audioAktif ? "#ffffff" : "#94a3b8"}
            />
          </View>

          {/* Volume Presets */}
          <View className="bg-slate-50 p-4 rounded-2xl border border-gray-200 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-mono text-gray-900 font-bold text-sm">Tingkat Volume</Text>
              <Text className="text-sky-700 font-mono font-bold text-xs">
                {Math.round(volume * 100)}%
              </Text>
            </View>
            <View className="flex-row justify-between">
              {volumePresets.map((preset) => {
                const isActive = Math.abs(volume - preset.val) < 0.05;
                return (
                  <TouchableOpacity
                    key={preset.label}
                    onPress={() => handleSelectVolume(preset.val)}
                    disabled={!audioAktif}
                    className={`px-3 py-2 rounded-xl border items-center flex-1 mx-0.5 ${
                      isActive
                        ? "bg-gray-900 border-gray-900"
                        : "bg-white border-gray-300"
                    } ${!audioAktif ? "opacity-40" : ""}`}
                  >
                    <Text
                      className={`font-mono font-bold text-xs ${
                        isActive ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="bg-gray-900 py-3.5 rounded-xl items-center shadow-xs"
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="font-mono text-white font-bold text-base">Simpan Pengaturan</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
