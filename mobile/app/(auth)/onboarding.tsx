// mobile/app/(auth)/onboarding.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { useAuth } from "../../context/AuthContext";

export default function OnboardingScreen() {
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [kelas, setKelas] = useState("X IPA 1");
  const [focusedField, setFocusedField] = useState<"nama" | "username" | "kelas" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitOnboardingData } = useAuth();

  const handleSubmit = async () => {
    if (!nama.trim() || !username.trim() || !kelas.trim()) {
      Alert.alert("Perhatian", "Semua kolom biodata wajib diisi");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitOnboardingData(nama.trim(), username.trim().toLowerCase(), kelas.trim());
    } catch (err: any) {
      Alert.alert("Gagal Onboarding", err.message || "Gagal menyimpan biodata");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative SVG Background Curves matching auth theme */}
      <View className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <Svg width="100%" height="100%" viewBox="0 0 400 800">
          <Circle cx="200" cy="-60" r="320" stroke="#E8ECF4" strokeWidth="2" fill="none" />
          <Circle cx="160" cy="-90" r="280" stroke="#F1F4FF" strokeWidth="1.5" fill="none" />
          <Path d="M-50 620 L150 780" stroke="#F1F4FF" strokeWidth="1.5" />
          <Path d="M60 580 L60 850" stroke="#F1F4FF" strokeWidth="1.5" />
          <Path d="M-20 700 L140 600" stroke="#F1F4FF" strokeWidth="1" />
        </Svg>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="flex-1 px-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Title: Lengkapi Biodata */}
          <View className="items-center mb-8 mt-12">
            <Text
              style={{ fontFamily: "Poppins_700Bold", color: "#1F41BB" }}
              className="text-3xl text-center mb-2"
            >
              Lengkapi Biodata
            </Text>
            <Text
              style={{ fontFamily: "Poppins_500Medium", color: "#494949" }}
              className="text-sm text-center px-4"
            >
              Lengkapi data diri kamu untuk memulai petualangan di Edungeon
            </Text>
          </View>

          {/* Form Input: Nama Lengkap */}
          <View className="mb-5">
            <TextInput
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: "#000000",
                backgroundColor: focusedField === "nama" ? "#FFFFFF" : "#F1F4FF",
                borderColor: focusedField === "nama" ? "#1F41BB" : "#F1F4FF",
                borderWidth: 2,
                borderRadius: 10,
                height: 58,
                paddingHorizontal: 16,
              }}
              placeholder="Nama Lengkap"
              placeholderTextColor="#626262"
              value={nama}
              onChangeText={setNama}
              onFocus={() => setFocusedField("nama")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Form Input: Username */}
          <View className="mb-5">
            <TextInput
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: "#000000",
                backgroundColor: focusedField === "username" ? "#FFFFFF" : "#F1F4FF",
                borderColor: focusedField === "username" ? "#1F41BB" : "#F1F4FF",
                borderWidth: 2,
                borderRadius: 10,
                height: 58,
                paddingHorizontal: 16,
              }}
              placeholder="Username"
              placeholderTextColor="#626262"
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="none"
            />
          </View>

          {/* Form Input: Kelas */}
          <View className="mb-8">
            <TextInput
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: "#000000",
                backgroundColor: focusedField === "kelas" ? "#FFFFFF" : "#F1F4FF",
                borderColor: focusedField === "kelas" ? "#1F41BB" : "#F1F4FF",
                borderWidth: 2,
                borderRadius: 10,
                height: 58,
                paddingHorizontal: 16,
              }}
              placeholder="Kelas (contoh: X IPA 1)"
              placeholderTextColor="#626262"
              value={kelas}
              onChangeText={setKelas}
              onFocus={() => setFocusedField("kelas")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Primary Button: Mulai Berpetualang */}
          <TouchableOpacity
            style={{
              backgroundColor: "#1F41BB",
              height: 58,
              borderRadius: 10,
              shadowColor: "#1F41BB",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 10,
              elevation: 8,
            }}
            className="items-center justify-center mb-10"
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text
                style={{ fontFamily: "Poppins_700Bold" }}
                className="text-white text-lg"
              >
                Mulai Berpetualang
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}