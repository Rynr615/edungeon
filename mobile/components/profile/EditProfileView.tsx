// mobile/components/profile/EditProfileView.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { UserProfile, EditProfilePayload } from "../../types/profile";
import { Icon } from "../ui/Icon";

interface EditProfileViewProps {
  user: UserProfile | null;
  onBack: () => void;
  onSave: (payload: EditProfilePayload) => Promise<boolean | void>;
  loading?: boolean;
}

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  user,
  onBack,
  onSave,
  loading = false,
}) => {
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [activeField, setActiveField] = useState<"nama" | "nama_panggilan" | "kelas" | "no_hp">("nama");

  // Form States
  const [nama, setNama] = useState(user?.nama || "Ryan Yanuar Pradana");
  const [namaPanggilan, setNamaPanggilan] = useState(user?.nama_panggilan || "Ryan");
  const [kelas, setKelas] = useState(user?.kelas || "XI IPA 1");
  const [noHp, setNoHp] = useState(user?.no_hp || "+628123456788");

  const openFieldEditor = (field: "nama" | "nama_panggilan" | "kelas" | "no_hp") => {
    setActiveField(field);
    setIsEditingModalOpen(true);
  };

  const handleSaveAll = async () => {
    if (!nama.trim()) {
      Alert.alert("Perhatian", "Nama lengkap tidak boleh kosong!");
      return;
    }

    try {
      await onSave({
        nama: nama.trim(),
        nama_panggilan: namaPanggilan.trim(),
        kelas: kelas.trim(),
        no_hp: noHp.trim(),
        avatar_class: user?.avatar_class || "knight",
      });
      setIsEditingModalOpen(false);
    } catch {
      // Handled in caller
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-5 pt-8" showsVerticalScrollIndicator={false}>
      {/* Top Header with Back Button */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="mr-3 p-1 rounded-full active:bg-gray-100"
        >
          <Icon name="ArrowLeftIcon" variant="outline" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-[#0f172a] text-2xl font-extrabold">Profile</Text>
      </View>

      {/* Avatar & Identitas Tengah */}
      <View className="items-center mb-4">
        <View className="w-20 h-20 rounded-full bg-[#EBF0F5] items-center justify-center mb-2 shadow-xs">
          <Icon name="UserIcon" variant="solid" size={38} color="#0f172a" />
        </View>
        <Text className="text-[#0f172a] text-sm font-mono font-medium">
          {nama}
        </Text>
        <View className="flex-row items-center mt-1">
          <Icon name="StarIcon" variant="solid" size={15} color="#f59e0b" />
          <Text className="text-[#0f172a] text-sm font-mono ml-1">
            Level {user?.level ?? 15}
          </Text>
        </View>
      </View>

      {/* Card Username & Email */}
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        {/* Username */}
        <View className="mb-2">
          <Text className="text-gray-400 text-xs font-medium">Username</Text>
          <Text className="text-[#0f172a] text-sm font-mono mt-0.5">
            {user?.username || "JohnDoe"}
          </Text>
          <View className="h-[1px] bg-gray-300 w-full mt-2" />
        </View>

        {/* Email */}
        <View className="mt-1">
          <Text className="text-gray-400 text-xs font-medium">Email</Text>
          <View className="flex-row items-center justify-between mt-0.5">
            <Text className="text-[#0f172a] text-sm font-mono">
              {user?.email || "email@gmail.com"}
            </Text>
            <Icon name="ChevronRightIcon" variant="outline" size={16} color="#94a3b8" />
          </View>
        </View>
      </View>

      {/* Section: Informasi Pribadi */}
      <Text className="text-[#0f172a] text-lg font-bold mb-3">Informasi Pribadi</Text>

      <View className="space-y-1 mb-12">
        {/* 1. Nama */}
        <TouchableOpacity
          onPress={() => openFieldEditor("nama")}
          activeOpacity={0.7}
          className="flex-row items-center justify-between py-3 border-b border-gray-200"
        >
          <Text className="text-[#0f172a] text-sm font-mono">Nama</Text>
          <View className="flex-row items-center">
            <Icon name="ExclamationCircleIcon" variant="solid" size={16} color="#eab308" />
            <Text className="text-gray-500 text-sm font-mono ml-1.5">{nama}</Text>
          </View>
        </TouchableOpacity>

        {/* 2. Nama Panggilan */}
        <TouchableOpacity
          onPress={() => openFieldEditor("nama_panggilan")}
          activeOpacity={0.7}
          className="flex-row items-center justify-between py-3 border-b border-gray-200"
        >
          <Text className="text-[#0f172a] text-sm font-mono">Nama Panggilan</Text>
          <View className="flex-row items-center">
            <Text className="text-gray-500 text-sm font-mono mr-1.5">{namaPanggilan}</Text>
            <Icon name="ChevronRightIcon" variant="outline" size={16} color="#94a3b8" />
          </View>
        </TouchableOpacity>

        {/* 3. Kelas */}
        <TouchableOpacity
          onPress={() => openFieldEditor("kelas")}
          activeOpacity={0.7}
          className="flex-row items-center justify-between py-3 border-b border-gray-200"
        >
          <Text className="text-[#0f172a] text-sm font-mono">Kelas</Text>
          <Text className="text-gray-500 text-sm font-mono">{kelas}</Text>
        </TouchableOpacity>

        {/* 4. No.HP */}
        <TouchableOpacity
          onPress={() => openFieldEditor("no_hp")}
          activeOpacity={0.7}
          className="flex-row items-center justify-between py-3 border-b border-gray-200"
        >
          <Text className="text-[#0f172a] text-sm font-mono">No.HP</Text>
          <Text className="text-gray-500 text-sm font-mono">{noHp}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Editor Form */}
      <Modal
        visible={isEditingModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditingModalOpen(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-5">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl">
            <Text className="text-[#0f172a] text-lg font-bold mb-4 capitalize">
              Ubah {activeField.replace("_", " ")}
            </Text>

            {activeField === "nama" && (
              <TextInput
                value={nama}
                onChangeText={setNama}
                placeholder="Masukkan Nama Lengkap"
                className="bg-gray-100 rounded-xl px-4 py-3 text-[#0f172a] text-sm mb-5"
              />
            )}

            {activeField === "nama_panggilan" && (
              <TextInput
                value={namaPanggilan}
                onChangeText={setNamaPanggilan}
                placeholder="Masukkan Nama Panggilan"
                className="bg-gray-100 rounded-xl px-4 py-3 text-[#0f172a] text-sm mb-5"
              />
            )}

            {activeField === "kelas" && (
              <TextInput
                value={kelas}
                onChangeText={setKelas}
                placeholder="Masukkan Kelas (misal XI IPA 1)"
                className="bg-gray-100 rounded-xl px-4 py-3 text-[#0f172a] text-sm mb-5"
              />
            )}

            {activeField === "no_hp" && (
              <TextInput
                value={noHp}
                onChangeText={setNoHp}
                placeholder="Masukkan No. HP (+62...)"
                keyboardType="phone-pad"
                className="bg-gray-100 rounded-xl px-4 py-3 text-[#0f172a] text-sm mb-5"
              />
            )}

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setIsEditingModalOpen(false)}
                className="flex-1 bg-gray-200 py-3 rounded-xl items-center mr-2"
              >
                <Text className="text-gray-700 font-bold text-sm">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveAll}
                disabled={loading}
                className="flex-1 bg-[#0f172a] py-3 rounded-xl items-center ml-2"
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="text-white font-bold text-sm">Simpan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
