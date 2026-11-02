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
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-6 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-lg bg-primary/20 items-center justify-center mr-2.5">
                <Icon name="SpeakerWaveIcon" variant="solid" size={18} color="#38bdf8" />
              </View>
              <Text className="text-white font-bold text-lg">Pengaturan Audio</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Icon name="XMarkIcon" variant="outline" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Toggle Switch Audio Aktif */}
          <View className="flex-row items-center justify-between bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-white font-bold text-sm">Audio & Musik</Text>
              <Text className="text-slate-400 text-xs mt-0.5">
                Aktifkan efek suara (SFX) dan latar musik (BGM)
              </Text>
            </View>
            <Switch
              value={audioAktif}
              onValueChange={handleToggle}
              trackColor={{ false: "#334155", true: "#0284c7" }}
              thumbColor={audioAktif ? "#38bdf8" : "#94a3b8"}
            />
          </View>

          {/* Volume Presets */}
          <View className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-bold text-sm">Tingkat Volume</Text>
              <Text className="text-sky-400 font-extrabold text-xs">
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
                        ? "bg-primary border-blue-400"
                        : "bg-slate-700/60 border-slate-600"
                    } ${!audioAktif ? "opacity-40" : ""}`}
                  >
                    <Text
                      className={`font-black text-xs ${
                        isActive ? "text-white" : "text-slate-300"
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
            className="bg-primary py-3.5 rounded-xl items-center shadow-lg shadow-blue-500/20"
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-black text-base">Simpan Pengaturan</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
