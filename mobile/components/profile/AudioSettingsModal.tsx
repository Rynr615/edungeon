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
import { Icon } from "../ui/Icon";
import { THEME_COLORS } from "../../constants/theme";
import { UserProfileData } from "../../types/profile";
import { profileService } from "../../services/profileService";

interface AudioSettingsModalProps {
  visible: boolean;
  profile: UserProfileData | null;
  onClose: () => void;
  onSuccess: (audioAktif: boolean, volume: number) => void;
}

const VOLUME_PRESETS = [
  { label: "Mute", value: 0.0 },
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1.0 },
];

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  visible,
  profile,
  onClose,
  onSuccess,
}) => {
  const [audioAktif, setAudioAktif] = useState(profile?.audio_aktif !== false);
  const [volume, setVolume] = useState(
    typeof profile?.volume_audio === "number" ? profile.volume_audio : 1.0
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setAudioAktif(profile.audio_aktif !== false);
      setVolume(typeof profile.volume_audio === "number" ? profile.volume_audio : 1.0);
    }
  }, [profile, visible]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await profileService.updateSettings({
        audio_aktif: audioAktif,
        volume_audio: audioAktif ? volume : 0,
      });
      onSuccess(audioAktif, volume);
      onClose();
      Alert.alert("Pengaturan Disimpan", "Preferensi audio Anda berhasil diperbarui.");
    } catch (err: any) {
      Alert.alert("Gagal", err.message || "Gagal menyimpan pengaturan audio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-surface border-t-2 border-gold rounded-t-3xl p-6 shadow-2xl">
          {/* Header Modal */}
          <View className="flex-row justify-between items-center mb-5">
            <View className="flex-row items-center">
              <Icon name="SpeakerWaveIcon" variant="solid" size={22} color={THEME_COLORS.gold} />
              <Text className="text-text font-bold text-lg ml-2">Pengaturan Audio</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Icon name="XMarkIcon" variant="outline" size={24} color={THEME_COLORS.subtext} />
            </TouchableOpacity>
          </View>

          {/* Toggle Efek Suara & Musik */}
          <View className="flex-row justify-between items-center bg-surface-card border border-border-gold/50 rounded-2xl p-4 mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-text font-bold text-sm">Musik & Suara Latar</Text>
              <Text className="text-subtext text-xs mt-0.5">
                Aktifkan musik latar bertema RPG dan efek sound battle
              </Text>
            </View>
            <Switch
              value={audioAktif}
              onValueChange={setAudioAktif}
              trackColor={{ false: THEME_COLORS.surfaceLight, true: THEME_COLORS.gold }}
              thumbColor={audioAktif ? THEME_COLORS.surface : "#f4f3f4"}
            />
          </View>

          {/* Volume Preset */}
          {audioAktif && (
            <View className="bg-surface-card border border-border-gold/50 rounded-2xl p-4 mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-text font-bold text-sm">Tingkat Volume</Text>
                <Text className="text-gold font-bold text-xs">{Math.round(volume * 100)}%</Text>
              </View>

              <View className="flex-row justify-between">
                {VOLUME_PRESETS.map((p) => {
                  const isSelected = Math.abs(volume - p.value) < 0.05;
                  return (
                    <TouchableOpacity
                      key={p.label}
                      onPress={() => setVolume(p.value)}
                      className={`px-3 py-2 rounded-xl border ${
                        isSelected
                          ? "bg-primary border-gold"
                          : "bg-surface-light border-border/40"
                      }`}
                    >
                      <Text
                        className={`font-bold text-xs ${
                          isSelected ? "text-surface" : "text-subtext"
                        }`}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Tombol Simpan */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.8}
            className="bg-primary py-4 rounded-xl items-center shadow-lg shadow-primary/30 flex-row justify-center"
          >
            {saving ? (
              <ActivityIndicator color={THEME_COLORS.surface} size="small" />
            ) : (
              <>
                <Icon name="CheckIcon" variant="solid" size={20} color={THEME_COLORS.surface} />
                <Text className="text-surface font-extrabold text-base ml-2">
                  Terapkan Pengaturan
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
