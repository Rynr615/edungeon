// mobile/app/profile/edit.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import { Icon } from "../../components/ui/Icon";

export default function EditProfileScreen() {
  const router = useRouter();
  const { userProfile, fetchProfile } = useAuth();

  const [nama, setNama] = useState(userProfile?.nama || "");
  const [namaPanggilan, setNamaPanggilan] = useState(userProfile?.nama_panggilan || "");
  const [kelas, setKelas] = useState(userProfile?.kelas || "");
  const [noHp, setNoHp] = useState(userProfile?.no_hp || "");
  const [avatar, setAvatar] = useState(userProfile?.avatar || "knight");
  const [saving, setSaving] = useState(false);

  const avatarOptions = [
    { id: "knight", label: "Knight", icon: "ShieldCheckIcon" as const, color: "#3b82f6" },
    { id: "mage", label: "Mage", icon: "SparklesIcon" as const, color: "#06b6d4" },
    { id: "archer", label: "Archer", icon: "BoltIcon" as const, color: "#10b981" },
  ];

  const handleSave = async () => {
    if (!nama.trim() || nama.trim().length < 2) {
      Alert.alert("Validasi Gagal", "Nama lengkap minimal terdiri dari 2 karakter.");
      return;
    }

    try {
      setSaving(true);
      await profileService.updateProfile({
        nama: nama.trim(),
        nama_panggilan: namaPanggilan.trim(),
        kelas: kelas.trim(),
        no_hp: noHp.trim(),
        avatar,
      });

      await fetchProfile();
      Alert.alert("Berhasil", "Informasi profil berhasil diperbarui!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Gagal Menyimpan", err.message || "Terjadi kesalahan pada server");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      {/* Top App Bar */}
      <View className="pt-12 pb-4 px-5 flex-row items-center justify-between border-b border-surface-light bg-surface/80">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface-light/60 items-center justify-center border border-slate-700"
        >
          <Icon name="ChevronLeftIcon" variant="outline" size={20} color="#f8fafc" />
        </TouchableOpacity>
        <Text className="text-text font-black text-lg">Informasi Pribadi</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Avatar Selection Card */}
        <View className="bg-surface border border-surface-light rounded-3xl p-5 mb-6 items-center shadow-md">
          <View className="w-24 h-24 rounded-3xl bg-blue-500/20 border-2 border-primary items-center justify-center mb-3">
            <Icon
              name={
                avatar === "mage"
                  ? "SparklesIcon"
                  : avatar === "archer"
                  ? "BoltIcon"
                  : "ShieldCheckIcon"
              }
              variant="solid"
              size={48}
              color={
                avatar === "mage" ? "#06b6d4" : avatar === "archer" ? "#10b981" : "#3b82f6"
              }
            />
          </View>

          <View className="bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/40 mb-3">
            <Text className="text-amber-400 font-extrabold text-xs">
              LEVEL {userProfile?.level || 1}
            </Text>
          </View>

          <Text className="text-subtext font-semibold text-xs mb-3">Pilih Karakter Avatar</Text>

          <View className="flex-row justify-center space-x-3">
            {avatarOptions.map((opt) => {
              const isSelected = avatar === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setAvatar(opt.id)}
                  className={`px-3.5 py-2 rounded-xl flex-row items-center border ${
                    isSelected
                      ? "bg-primary/20 border-primary"
                      : "bg-surface-light/40 border-slate-700"
                  }`}
                >
                  <Icon name={opt.icon} variant="solid" size={16} color={opt.color} />
                  <Text
                    className={`font-bold text-xs ml-1.5 ${
                      isSelected ? "text-blue-400" : "text-slate-400"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Input Form Fields */}
        <View className="space-y-4 mb-8">
          {/* Read-Only: Username */}
          <View>
            <Text className="text-subtext font-bold text-xs mb-1.5 uppercase tracking-wider">
              Username (ID Unik)
            </Text>
            <View className="bg-surface-light/40 border border-slate-700 rounded-2xl px-4 py-3 flex-row items-center justify-between opacity-70">
              <Text className="text-slate-300 font-semibold text-sm">
                @{userProfile?.username || "pahlawan"}
              </Text>
              <Icon name="LockClosedIcon" variant="solid" size={16} color="#64748b" />
            </View>
          </View>

          {/* Read-Only: Email */}
          <View className="mt-3">
            <Text className="text-subtext font-bold text-xs mb-1.5 uppercase tracking-wider">
              Alamat Email Terdaftar
            </Text>
            <View className="bg-surface-light/40 border border-slate-700 rounded-2xl px-4 py-3 flex-row items-center justify-between opacity-70">
              <Text className="text-slate-300 font-semibold text-sm">
                {userProfile?.email || "siswa@edungeon.com"}
              </Text>
              <Icon name="LockClosedIcon" variant="solid" size={16} color="#64748b" />
            </View>
          </View>

          {/* Editable: Nama Lengkap */}
          <View className="mt-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-text font-bold text-xs uppercase tracking-wider">
                Nama Lengkap
              </Text>
              {!nama.trim() && (
                <View className="flex-row items-center">
                  <Icon name="ExclamationTriangleIcon" variant="solid" size={12} color="#f59e0b" />
                  <Text className="text-amber-400 font-semibold text-[11px] ml-1">Wajib diisi</Text>
                </View>
              )}
            </View>
            <TextInput
              value={nama}
              onChangeText={setNama}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor="#64748b"
              className="bg-surface border border-surface-light rounded-2xl px-4 py-3 text-text font-semibold text-sm focus:border-primary"
            />
          </View>

          {/* Editable: Nama Panggilan */}
          <View className="mt-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-text font-bold text-xs uppercase tracking-wider">
                Nama Panggilan
              </Text>
              {!namaPanggilan.trim() && (
                <Text className="text-amber-400 font-semibold text-[11px]">Belum diatur</Text>
              )}
            </View>
            <TextInput
              value={namaPanggilan}
              onChangeText={setNamaPanggilan}
              placeholder="Contoh: John"
              placeholderTextColor="#64748b"
              className="bg-surface border border-surface-light rounded-2xl px-4 py-3 text-text font-semibold text-sm focus:border-primary"
            />
          </View>

          {/* Editable: Kelas */}
          <View className="mt-3">
            <Text className="text-text font-bold text-xs mb-1.5 uppercase tracking-wider">
              Kelas / Rombel
            </Text>
            <TextInput
              value={kelas}
              onChangeText={setKelas}
              placeholder="Contoh: X-PPLG 1"
              placeholderTextColor="#64748b"
              className="bg-surface border border-surface-light rounded-2xl px-4 py-3 text-text font-semibold text-sm focus:border-primary"
            />
          </View>

          {/* Editable: No HP */}
          <View className="mt-3">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-text font-bold text-xs uppercase tracking-wider">
                Nomor WhatsApp / HP
              </Text>
              {!noHp.trim() && (
                <Text className="text-amber-400 font-semibold text-[11px]">Belum diatur</Text>
              )}
            </View>
            <TextInput
              value={noHp}
              onChangeText={setNoHp}
              placeholder="Contoh: 081234567890"
              keyboardType="phone-pad"
              placeholderTextColor="#64748b"
              className="bg-surface border border-surface-light rounded-2xl px-4 py-3 text-text font-semibold text-sm focus:border-primary"
            />
          </View>
        </View>

        {/* Action Button: Simpan Perubahan */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="bg-primary p-4 rounded-2xl items-center justify-center mb-12 shadow-lg shadow-blue-500/30 active:opacity-90"
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-black text-base tracking-wide">
              Simpan Perubahan
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
