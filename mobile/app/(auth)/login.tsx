// mobile/app/(auth)/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "../../components/ui/Icon";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginEmail } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Perhatian", "Email dan Password wajib diisi");
      return;
    }
    setIsSubmitting(true);
    try {
      await loginEmail(email, password);
    } catch (err: any) {
      Alert.alert("Gagal Login", err.message || "Email atau password salah");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center px-6">
      <View className="items-center mb-8">
        <Icon name="ShieldCheckIcon" variant="solid" size={64} color="#2563eb" />
        <Text className="text-3xl font-bold text-text mt-2">EDUNGEON</Text>
        <Text className="text-subtext mt-1 text-center">
          Petualangan Belajar Matematika & Informatika
        </Text>
      </View>

      <View className="bg-surface p-6 rounded-2xl border border-surface-light shadow-lg">
        <Text className="text-xl font-bold text-text mb-4">Masuk ke Akun</Text>

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
          className="bg-background text-text p-3 rounded-lg border border-surface-light mb-6"
          placeholder="••••••••"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className="bg-primary p-4 rounded-xl items-center"
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-text font-bold text-base">Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 items-center"
          onPress={() => router.push("/(auth)/register")}
        >
          <Text className="text-subtext">
            Belum punya akun? <Text className="text-primary font-bold">Daftar sekarang</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}