// mobile/components/profile/EditProfileModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Icon } from "../ui/Icon";
import { THEME_COLORS } from "../../constants/theme";
import { UserProfileData } from "../../types/profile";
import { profileService } from "../../services/profileService";

interface EditProfileModalProps {
  visible: boolean;
  profile: UserProfileData | null;
  onClose: () => void;
  onSuccess: (updated: UserProfileData) => void;
}

const AVATAR_OPTIONS = [
  { id: "knight", label: "Knight", icon: "ShieldCheckIcon" as const, color: THEME_COLORS.gold },
  { id: "mage", label: "Mage", icon: "SparklesIcon" as const, color: "#A855F7" },
  { id: "archer", label: "Archer", icon: "BoltIcon" as const, color: "#10B981" },
];

const KELAS_OPTIONS = ["Kelas X", "Kelas XI", "Kelas XII"];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  profile,
  onClose,
  onSuccess,
}) => {
  const [nama, setNama] = useState(profile?.nama || "");
  const [kelas, setKelas] = useState(profile?.kelas || "Kelas X");
  const [avatar, setAvatar] = useState(profile?.avatar || "knight");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setNama(profile.nama || "");
      setKelas(profile.kelas || "Kelas X");
      setAvatar(profile.avatar || "knight");
    }
  }, [profile, visible]);

  const handleSave = async () => {
    if (!nama.trim() || nama.trim().length < 2) {
      Alert.alert("Perhatian", "Nama harus memiliki minimal 2 karakter.");
      return;
    }

    try {
      setSaving(true);
      const updated = await profileService.updateProfile({
        nama: nama.trim(),
        kelas,
        avatar,
      });
      onSuccess(updated);
      onClose();
      Alert.alert("Sukses", "Profil pahlawan Anda berhasil diperbarui!");
    } catch (err: any) {
      Alert.alert("Gagal", err.message || "Gagal memperbarui profil.");
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
              <Icon name="PencilSquareIcon" variant="solid" size={22} color={THEME_COLORS.gold} />
              <Text className="text-text font-bold text-lg ml-2">Edit Profil Pahlawan</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Icon name="XMarkIcon" variant="outline" size={24} color={THEME_COLORS.subtext} />
            </TouchableOpacity>
          </View>

          {/* Form Input Nama */}
          <Text className="text-subtext font-semibold text-xs mb-1.5">NAMA LENGKAP</Text>
          <TextInput
            value={nama}
            onChangeText={setNama}
            placeholder="Masukkan nama pahlawan..."
            placeholderTextColor={THEME_COLORS.textMuted}
            className="bg-surface-card border border-border-gold/60 rounded-xl px-4 py-3 text-text font-semibold text-sm mb-4"
          />

          {/* Pilihan Kelas */}
          <Text className="text-subtext font-semibold text-xs mb-1.5">TINGKAT KELAS</Text>
          <View className="flex-row gap-2 mb-4">
            {KELAS_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setKelas(item)}
                className={`flex-1 py-2.5 rounded-xl items-center border ${
                  kelas === item
                    ? "bg-primary border-gold"
                    : "bg-surface-card border-border/60"
                }`}
              >
                <Text
                  className={`font-bold text-xs ${
                    kelas === item ? "text-surface" : "text-subtext"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pilihan Avatar Hero Class */}
          <Text className="text-subtext font-semibold text-xs mb-2">PILIH AVATAR HERO</Text>
          <View className="flex-row justify-between mb-6">
            {AVATAR_OPTIONS.map((opt) => {
              const isSelected = avatar === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setAvatar(opt.id)}
                  className={`w-[31%] p-3 rounded-2xl items-center border-2 ${
                    isSelected
                      ? "bg-surface-card border-gold shadow-md shadow-gold/20"
                      : "bg-surface/50 border-border/40 opacity-70"
                  }`}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-1.5"
                    style={{ backgroundColor: `${opt.color}20` }}
                  >
                    <Icon name={opt.icon} variant="solid" size={24} color={opt.color} />
                  </View>
                  <Text
                    className={`font-bold text-xs ${
                      isSelected ? "text-gold" : "text-subtext"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

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
                  Simpan Perubahan
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
