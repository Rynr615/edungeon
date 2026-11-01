// mobile/components/profile/AudioSettingsModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AudioSettingsPayload } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface AudioSettingsModalProps {
  visible: boolean;
  audioAktif: boolean;
  volumeAudio: number; // 0.0 - 1.0
  onClose: () => void;
  onSave: (payload: AudioSettingsPayload) => Promise<boolean | void>;
  loading?: boolean;
}

const VOLUME_PRESETS = [0.2, 0.4, 0.6, 0.8, 1.0];

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  visible,
  audioAktif = true,
  volumeAudio = 0.8,
  onClose,
  onSave,
  loading = false,
}) => {
  const [enabled, setEnabled] = useState(audioAktif);
  const [volume, setVolume] = useState(volumeAudio);

  useEffect(() => {
    setEnabled(audioAktif);
    setVolume(volumeAudio);
  }, [audioAktif, volumeAudio, visible]);

  const handleSave = async () => {
    try {
      await onSave({
        audio_aktif: enabled,
        volume_audio: enabled ? volume : 0,
      });
      onClose();
    } catch {
      // error handled in caller
    }
  };

  const volumePercent = Math.round(volume * 100);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/75 justify-center items-center p-5">
        <View className="w-full max-w-sm bg-surface border border-surface-light rounded-3xl p-6 shadow-2xl">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-surface-light/60 mb-5">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-primary/20 items-center justify-center mr-3">
                <Icon name="SpeakerWaveIcon" variant="solid" size={22} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-text font-bold text-lg">Pengaturan Suara</Text>
                <Text className="text-subtext text-xs">Audio BGM & SFX Dungeon</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              className="w-8 h-8 rounded-full bg-surface-light/60 items-center justify-center"
            >
              <Icon name="XMarkIcon" variant="outline" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Toggle Switch Audio Aktif */}
          <View className="bg-background/80 p-4 rounded-2xl border border-surface-light/50 flex-row items-center justify-between mb-5">
            <View className="flex-1 mr-3">
              <Text className="text-text font-semibold text-sm">
                Efek Suara & Musik
              </Text>
              <Text className="text-subtext text-xs mt-0.5">
                Nyalakan musik latar & SFX
              </Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: "#334155", true: "#2563eb" }}
              thumbColor={enabled ? "#ffffff" : "#94a3b8"}
            />
          </View>

          {/* Volume Stepper & Presets */}
          <View className="mb-6 opacity-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-subtext text-xs font-bold uppercase tracking-wider">
                Volume Master
              </Text>
              <Text className="text-exp font-bold text-sm">
                {enabled ? `${volumePercent}%` : "Dibisukan (Mute)"}
              </Text>
            </View>

            {/* Visual Volume Bar */}
            <View className="w-full bg-surface-light h-3 rounded-full overflow-hidden mb-3">
              <View
                className="bg-primary h-full rounded-full"
                style={{ width: enabled ? `${volumePercent}%` : "0%" }}
              />
            </View>

            {/* Presets Button Row */}
            <View className="flex-row justify-between">
              {VOLUME_PRESETS.map((val) => {
                const isSelected = enabled && Math.abs(volume - val) < 0.05;
                const percent = Math.round(val * 100);

                return (
                  <TouchableOpacity
                    key={val}
                    disabled={!enabled}
                    onPress={() => setVolume(val)}
                    activeOpacity={0.7}
                    className={`px-2.5 py-1.5 rounded-lg border ${
                      isSelected
                        ? "bg-primary border-primary"
                        : "bg-background border-surface-light/60"
                    } ${!enabled ? "opacity-40" : ""}`}
                  >
                    <Text
                      className={`text-[11px] font-bold ${
                        isSelected ? "text-white" : "text-subtext"
                      }`}
                    >
                      {percent}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              activeOpacity={0.7}
              className="flex-1 bg-surface-light/60 py-3.5 rounded-xl items-center mr-2 border border-surface-light"
            >
              <Text className="text-subtext font-bold text-base">Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.8}
              className="flex-1 bg-primary py-3.5 rounded-xl items-center flex-row justify-center ml-2 shadow-md"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Icon name="CheckIcon" variant="solid" size={18} color="#ffffff" />
                  <Text className="text-white font-bold text-base ml-1.5">Terapkan</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
