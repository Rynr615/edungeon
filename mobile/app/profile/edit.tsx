// mobile/app/profile/edit.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import { Icon } from "../../components/ui/Icon";
import { EditProfileModal } from "../../components/profile/EditProfileModal";

export default function EditProfileScreen() {
  const router = useRouter();
  const { userProfile, fetchProfile } = useAuth();

  const [nama, setNama] = useState(userProfile?.nama || "");
  const [namaPanggilan, setNamaPanggilan] = useState(
    userProfile?.nama_panggilan || ""
  );
  const [kelas, setKelas] = useState(userProfile?.kelas || "");
  const [noHp, setNoHp] = useState(userProfile?.no_hp || "");
  const [avatar, setAvatar] = useState(userProfile?.avatar || "");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.nama) setNama(userProfile.nama);
      if (userProfile.nama_panggilan) setNamaPanggilan(userProfile.nama_panggilan);
      if (userProfile.kelas) setKelas(userProfile.kelas);
      if (userProfile.no_hp) setNoHp(userProfile.no_hp);
      if (userProfile.avatar) setAvatar(userProfile.avatar);
    }
  }, [userProfile]);

  const level = userProfile?.level ?? 1;
  const username = userProfile?.username || "pahlawan";
  const email = userProfile?.email || "siswa@edungeon.com";

  const hasCustomPhoto =
    avatar &&
    (avatar.startsWith("http") ||
      avatar.startsWith("data:") ||
      avatar.startsWith("file:"));

  // 1. Pilih Foto dari Galeri HP
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Izin Ditolak",
          "Aplikasi memerlukan izin galeri untuk memilih foto profil."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const photoData = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;

        setAvatar(photoData);
        await saveAvatarToDb(photoData);
      }
    } catch (err: any) {
      console.error("[pickImage] Error:", err);
      Alert.alert("Gagal", err.message || "Gagal membuka galeri foto");
    }
  };

  // 2. Ambil Foto Baru Menggunakan Kamera
  const takePhoto = async () => {
    try {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPerm.granted) {
        Alert.alert(
          "Izin Ditolak",
          "Aplikasi memerlukan izin kamera untuk mengambil foto profil baru."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const photoData = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;

        setAvatar(photoData);
        await saveAvatarToDb(photoData);
      }
    } catch (err: any) {
      console.error("[takePhoto] Error:", err);
      Alert.alert("Gagal", err.message || "Gagal membuka kamera");
    }
  };

  // 3. Simpan Foto Langsung ke Cloud Firestore Database
  const saveAvatarToDb = async (photoData: string) => {
    try {
      setSaving(true);
      await profileService.updateProfile({
        nama: (nama || userProfile?.nama || "Pahlawan").trim(),
        avatar: photoData,
      });
      await fetchProfile();
      Alert.alert("Berhasil", "Foto profil berhasil diperbarui dan tersimpan di database!");
    } catch (err: any) {
      Alert.alert("Gagal Menyimpan Foto", err.message || "Terjadi kesalahan pada server");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoOptions = () => {
    Alert.alert(
      "Ganti Foto Profil",
      "Pilih sumber foto profil kamu:",
      [
        { text: "Batal", style: "cancel" },
        { text: "Pilih dari Galeri", onPress: pickImage },
        { text: "Ambil Foto (Kamera)", onPress: takePhoto },
      ]
    );
  };

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
        avatar,
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

        {/* Centered Identity: Avatar dengan Tombol Ganti Foto, Name, Level */}
        <View className="items-center my-3">
          <TouchableOpacity
            onPress={handlePhotoOptions}
            activeOpacity={0.8}
            className="relative mb-2"
          >
            <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center overflow-hidden border-2 border-gray-200 shadow-sm">
              {hasCustomPhoto ? (
                <Image
                  source={{ uri: avatar }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Icon name="UserIcon" variant="solid" size={42} color="#1e293b" />
              )}
            </View>

            {/* Badge Kamera Kecil di Pojok Kanan Bawah Avatar */}
            <View className="w-7 h-7 rounded-full bg-gray-900 items-center justify-center absolute bottom-0 right-0 border-2 border-white shadow-xs">
              <Icon name="CameraIcon" variant="solid" size={14} color="#ffffff" />
            </View>
          </TouchableOpacity>

          {/* Tombol Teks Ganti Foto */}
          <TouchableOpacity onPress={handlePhotoOptions} className="mb-1">
            <Text className="text-xs font-bold text-sky-600">Ganti Foto Profil</Text>
          </TouchableOpacity>

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
      <EditProfileModal
        visible={isEditing}
        initialNama={nama}
        initialNamaPanggilan={namaPanggilan}
        initialKelas={kelas}
        initialNoHp={noHp}
        onClose={() => setIsEditing(false)}
        onSave={async (updated) => {
          await profileService.updateProfile({
            ...updated,
            avatar,
          });
          setNama(updated.nama);
          if (updated.nama_panggilan) setNamaPanggilan(updated.nama_panggilan);
          if (updated.kelas) setKelas(updated.kelas);
          if (updated.no_hp) setNoHp(updated.no_hp);
          await fetchProfile();
          Alert.alert("Berhasil", "Informasi pribadi berhasil diperbarui!");
        }}
      />
    </View>
  );
}
