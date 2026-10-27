// mobile/app/(auth)/onboarding.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "../../components/ui/Icon";

export default function OnboardingScreen() {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [kelas, setKelas] = useState("X IPA 1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitOnboardingData } = useAuth();

  const handleSubmit = async () => {
    if (!nama || !username || !kelas) {
      Alert.alert("Perhatian", "Semua kolom biodata wajib diisi");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitOnboardingData(nama, username, kelas);
    } catch (err: any) {
      Alert.alert("Gagal Onboarding", err.message || "Gagal menyimpan biodata");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center px-6">
      <View className="items-center mb-6">
        <Icon name="AcademicCapIcon" variant="solid" size={60} color="#eab308" />
        <Text className="text-2xl font-bold text-text mt-2">Lengkapi Biodata</Text>
        <Text className="text-subtext text-center mt-1">
          Selamat datang, Pahlawan! Lengkapi data diri untuk memulai petualangan.
        </Text>
      </View>

      <View className="bg-surface p-6 rounded-2xl border border-surface-light">
        <Text className="text-subtext mb-1">Nama Lengkap</Text>
        <TextInput
          className="bg-background text-text p-3 rounded-lg border border-surface-light mb-4"
          placeholder="Ryan Yanuar"
          placeholderTextColor="#94a3b8"
          value={nama}
          onChangeText={setNama}
        />

        <Text className="text-subtext mb-1">Username (Nama Pahlawan)</Text>
        <TextInput
          className="bg-background text-text p-3 rounded-lg border border-surface-light mb-4"
          placeholder="ryan_knight"
          placeholderTextColor="#94a3b8"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text className="text-subtext mb-1">Kelas</Text>
        <TextInput
          className="bg-background text-text p-3 rounded-lg border border-surface-light mb-6"
          placeholder="X IPA 1"
          placeholderTextColor="#94a3b8"
          value={kelas}
          onChangeText={setKelas}
        />

        <TouchableOpacity
          className="bg-success p-4 rounded-xl items-center"
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-text font-bold text-base">Mulai Berpetualang</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}