// mobile/app/(auth)/register.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "../../components/ui/Icon";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerEmail } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Perhatian", "Semua kolom wajib diisi");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Perhatian", "Konfirmasi password tidak cocok");
      return;
    }
    setIsSubmitting(true);
    try {
      await registerEmail(email, password);
    } catch (err: any) {
      Alert.alert("Gagal Pendaftaran", err.message || "Terjadi kesalahan saat membuat akun");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center px-6">
      <View className="items-center mb-6">
        <Icon name="UserPlusIcon" variant="solid" size={56} color="#2563eb" />
        <Text className="text-2xl font-bold text-text mt-2">Buat Akun Baru</Text>
      </View>

      <View className="bg-surface p-6 rounded-2xl border border-surface-light">
        <Text className="text-subtext mb-1">Email</Text>
        <TextInput
          className="bg-background text-text p-3 rounded-lg border border-surface-light mb-4"
          placeholder="nama@siswa.belajar.id"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text className="text-subtext mb-1">Password</Text>
        <TextInput
          className="bg-background text-text p-3 rounded-lg border border-surface-light mb-4"
          placeholder="••••••••"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text className="text-subtext mb-1">Konfirmasi Password</Text>
        <TextInput
          className="bg-background text-text p-3 rounded-lg border border-surface-light mb-6"
          placeholder="••••••••"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          className="bg-primary p-4 rounded-xl items-center"
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-text font-bold text-base">Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 items-center"
          onPress={() => router.back()}
        >
          <Text className="text-subtext">
            Sudah punya akun? <Text className="text-primary font-bold">Masuk</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}