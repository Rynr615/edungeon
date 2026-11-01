// mobile/app/profile/edit.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import { Icon } from "../../components/ui/Icon";

export default function EditProfileScreen() {
  const router = useRouter();
  const { userProfile, fetchProfile } = useAuth();

  const [nama, setNama] = useState(userProfile?.nama || "");
  const [namaPanggilan, setNamaPanggilan] = useState(
    userProfile?.nama_panggilan || ""
  );
  const [kelas, setKelas] = useState(userProfile?.kelas || "");
  const [noHp, setNoHp] = useState(userProfile?.no_hp || "");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (userProfile) {
      if (userProfile.nama) setNama(userProfile.nama);
      if (userProfile.nama_panggilan) setNamaPanggilan(userProfile.nama_panggilan);
      if (userProfile.kelas) setKelas(userProfile.kelas);
      if (userProfile.no_hp) setNoHp(userProfile.no_hp);
    }
  }, [userProfile]);

  const level = userProfile?.level ?? 1;
  const username = userProfile?.username || "pahlawan";
  const email = userProfile?.email || "siswa@edungeon.com";

  const handleSave = async () => {
    if (!nama.trim() || nama.trim().length < 2) {
      Alert.alert("Gagal", "Nama minimal terdiri dari 2 karakter.");
      return;
    }

    try {
      setSaving(true);
      await profileService.updateProfile({
        nama: nama.trim(),
        nama_panggilan: namaPanggilan.trim(),
        kelas: kelas.trim(),
        no_hp: noHp.trim(),
      });
      await fetchProfile();
      setIsEditing(false);
      Alert.alert("Berhasil", "Informasi pribadi berhasil diperbarui!");
    } catch (err: any) {
      Alert.alert("Gagal", err.message || "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-12" showsVerticalScrollIndicator={false}>
        {/* Top Header: Title & Back */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="font-bold text-2xl text-gray-900 tracking-tight">
            Profile
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-1 rounded-full"
            accessibilityLabel="Kembali"
          >
            <Icon name="ChevronLeftIcon" variant="outline" size={22} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Centered Identity: Avatar, Name, Level 15 */}
        <View className="items-center my-3">
          <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center mb-2 shadow-xs">
            <Icon name="UserIcon" variant="solid" size={42} color="#1e293b" />
          </View>
          <Text className="font-mono text-gray-900 text-sm font-semibold text-center">
            {nama || "Pahlawan Edungeon"}
          </Text>
          <View className="flex-row items-center justify-center mt-1">
            <Icon name="StarIcon" variant="outline" size={15} color="#eab308" />
            <Text className="font-mono text-gray-900 text-xs ml-1.5 font-semibold">
              Level {level}
            </Text>
          </View>
        </View>

        {/* Card: Username & Email */}
        <View className="bg-white rounded-2xl p-4 my-4 shadow-sm border border-gray-100">
          <Text className="text-gray-400 font-semibold text-xs mb-1">Username</Text>
          <Text className="font-mono text-gray-900 text-sm pb-2.5 border-b border-gray-200">
            {username}
          </Text>

          <Text className="text-gray-400 font-semibold text-xs mt-3 mb-1">Email</Text>
          <View className="flex-row items-center justify-between">
            <Text className="font-mono text-gray-900 text-sm">{email}</Text>
            <Icon name="ChevronRightIcon" variant="outline" size={16} color="#9ca3af" />
          </View>
        </View>

        {/* Section Title: Informasi Pribadi & Edit Button */}
        <View className="flex-row items-center justify-between mt-2 mb-4">
          <Text className="font-bold text-gray-900 text-lg">Informasi Pribadi</Text>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className="bg-slate-100 px-3 py-1 rounded-full border border-gray-300"
          >
            <Text className="text-xs font-bold text-gray-700">Ubah Data</Text>
          </TouchableOpacity>
        </View>

        {/* List of 4 Fields with Bottom Borders */}
        <View className="space-y-4 mb-16">
          {/* 1. Nama */}
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between border-b border-gray-200 pb-2.5 mb-4"
          >
            <Text className="text-gray-900 font-semibold text-sm">Nama</Text>
            <Text className="font-mono text-gray-400 text-sm" numberOfLines={1}>
              {nama || "Belum diisi"}
            </Text>
          </TouchableOpacity>

          {/* 2. Nama Panggilan */}
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between border-b border-gray-200 pb-2.5 mb-4"
          >
            <Text className="text-gray-900 font-semibold text-sm">Nama Panggilan</Text>
            <View className="flex-row items-center">
              <Text className="font-mono text-gray-400 text-sm mr-2">
                {namaPanggilan || "Belum diatur"}
              </Text>
              <Icon name="ChevronRightIcon" variant="outline" size={16} color="#374151" />
            </View>
          </TouchableOpacity>

          {/* 3. Kelas */}
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between border-b border-gray-200 pb-2.5 mb-4"
          >
            <Text className="text-gray-900 font-semibold text-sm">Kelas</Text>
            <Text className="font-mono text-gray-400 text-sm">{kelas || "Belum diatur"}</Text>
          </TouchableOpacity>

          {/* 4. No. HP */}
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between border-b border-gray-200 pb-2.5 mb-4"
          >
            <Text className="text-gray-900 font-semibold text-sm">No. HP</Text>
            <Text className="font-mono text-gray-400 text-sm">{noHp || "Belum diatur"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL DIALOG UBAH INFORMASI PRIBADI */}
      <Modal visible={isEditing} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-bold text-lg text-gray-900">
                Ubah Informasi Pribadi
              </Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Icon name="XMarkIcon" variant="outline" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Input Nama */}
            <Text className="text-gray-700 text-xs font-semibold mb-1">Nama Lengkap</Text>
            <TextInput
              value={nama}
              onChangeText={setNama}
              className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm mb-3 text-gray-900"
            />

            {/* Input Nama Panggilan */}
            <Text className="text-gray-700 text-xs font-semibold mb-1">Nama Panggilan</Text>
            <TextInput
              value={namaPanggilan}
              onChangeText={setNamaPanggilan}
              className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm mb-3 text-gray-900"
            />

            {/* Input Kelas */}
            <Text className="text-gray-700 text-xs font-semibold mb-1">Kelas</Text>
            <TextInput
              value={kelas}
              onChangeText={setKelas}
              className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm mb-3 text-gray-900"
            />

            {/* Input No HP */}
            <Text className="text-gray-700 text-xs font-semibold mb-1">No. HP / WhatsApp</Text>
            <TextInput
              value={noHp}
              onChangeText={setNoHp}
              keyboardType="phone-pad"
              className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm mb-6 text-gray-900"
            />

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              className="bg-gray-900 py-3.5 rounded-xl items-center mb-4"
            >
              {saving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-base">Simpan Perubahan</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
