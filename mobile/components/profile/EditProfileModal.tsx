// mobile/components/profile/EditProfileModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { UserProfile, EditProfilePayload, HeroClass } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface EditProfileModalProps {
  visible: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onSave: (payload: EditProfilePayload) => Promise<boolean | void>;
  loading?: boolean;
}

const AVAILABLE_CLASSES = [
  "X-1",
  "X-2",
  "X-3",
  "X-4",
  "X-5",
  "X-6",
  "X-7",
  "X-8",
  "X-9",
  "X-10",
];

const HERO_ROLES: { id: HeroClass; name: string; icon: "ShieldCheckIcon" | "SparklesIcon" | "BoltIcon"; color: string }[] = [
  { id: "knight", name: "Knight", icon: "ShieldCheckIcon", color: "#3b82f6" },
  { id: "mage", name: "Mage", icon: "SparklesIcon", color: "#06b6d4" },
  { id: "archer", name: "Archer", icon: "BoltIcon", color: "#10b981" },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  user,
  onClose,
  onSave,
  loading = false,
}) => {
  const [nama, setNama] = useState(user?.nama || "");
  const [kelas, setKelas] = useState(user?.kelas || "X-1");
  const [avatarClass, setAvatarClass] = useState<HeroClass>(
    (user?.avatar_class as HeroClass) || "knight"
  );

  useEffect(() => {
    if (user) {
      setNama(user.nama || "");
      setKelas(user.kelas || "X-1");
      setAvatarClass((user.avatar_class as HeroClass) || "knight");
    }
  }, [user, visible]);

  const handleSave = async () => {
    if (!nama.trim()) {
      Alert.alert("Perhatian", "Nama lengkap siswa tidak boleh kosong!");
      return;
    }

    try {
      await onSave({
        nama: nama.trim(),
        kelas,
        avatar_class: avatarClass,
      });
      onClose();
    } catch {
      // error handled in caller
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/75 justify-end">
        <View className="bg-surface border-t border-surface-light rounded-t-3xl max-h-[90%] p-6 shadow-2xl">
          {/* Header Modal */}
          <View className="flex-row items-center justify-between pb-4 border-b border-surface-light/60">
            <View>
              <Text className="text-text font-bold text-xl">Edit Profil</Text>
              <Text className="text-subtext text-xs">Perbarui Identitas Siswa & Hero</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              className="w-9 h-9 rounded-full bg-surface-light/60 items-center justify-center"
            >
              <Icon name="XMarkIcon" variant="outline" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
            {/* Pilihan Avatar / Role Hero */}
            <View className="mb-5">
              <Text className="text-subtext text-xs font-bold uppercase tracking-wider mb-2">
                Pilih Role Hero Avatar
              </Text>
              <View className="flex-row justify-between">
                {HERO_ROLES.map((role) => {
                  const isSelected = avatarClass === role.id;
                  return (
                    <TouchableOpacity
                      key={role.id}
                      onPress={() => setAvatarClass(role.id)}
                      activeOpacity={0.7}
                      className={`w-[31%] p-3 rounded-2xl items-center border ${
                        isSelected
                          ? "bg-primary/20 border-primary"
                          : "bg-background/80 border-surface-light/50"
                      }`}
                    >
                      <View className="w-12 h-12 rounded-xl bg-surface items-center justify-center mb-1.5 shadow-sm">
                        <Icon name={role.icon} variant="solid" size={26} color={role.color} />
                      </View>
                      <Text
                        className={`text-xs font-bold ${
                          isSelected ? "text-primary" : "text-subtext"
                        }`}
                      >
                        {role.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Input Nama Lengkap */}
            <View className="mb-4">
              <Text className="text-subtext text-xs font-bold uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </Text>
              <TextInput
                value={nama}
                onChangeText={setNama}
                placeholder="Masukkan nama lengkap siswa"
                placeholderTextColor="#64748b"
                className="bg-background border border-surface-light rounded-xl px-4 py-3.5 text-text text-sm"
              />
            </View>

            {/* Field Username (Read Only) */}
            <View className="mb-4">
              <Text className="text-subtext text-xs font-bold uppercase tracking-wider mb-1.5">
                Username Siswa (Permanen)
              </Text>
              <View className="bg-surface-light/30 border border-surface-light/40 rounded-xl px-4 py-3.5 flex-row items-center justify-between">
                <Text className="text-subtext font-medium text-sm">
                  @{user?.username || "username"}
                </Text>
                <Icon name="LockClosedIcon" variant="solid" size={16} color="#64748b" />
              </View>
              <Text className="text-subtext/70 text-[11px] mt-1 italic">
                * Username akun sekolah terikat dengan basis data siswa dan tidak dapat diubah.
              </Text>
            </View>

            {/* Pilihan Kelas Siswa */}
            <View className="mb-6">
              <Text className="text-subtext text-xs font-bold uppercase tracking-wider mb-2">
                Pilih Kelas (Tingkat X SMA)
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {AVAILABLE_CLASSES.map((item) => {
                  const isSelected = kelas === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setKelas(item)}
                      activeOpacity={0.7}
                      className={`px-3.5 py-2 rounded-xl border ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-background border-surface-light/60"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          isSelected ? "text-white" : "text-subtext"
                        }`}
                      >
                        Kelas {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Action Buttons: Simpan & Batal */}
            <View className="flex-row space-x-3 mb-6">
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
                    <Text className="text-white font-bold text-base ml-1.5">Simpan</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
