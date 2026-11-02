// mobile/app/(auth)/register.tsx
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
import { useRouter } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState<"email" | "password" | "confirm" | null>(null);
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
    if (password.length < 6) {
      Alert.alert("Perhatian", "Password minimal harus 6 karakter");
      return;
    }
    setIsSubmitting(true);
    try {
      await registerEmail(email.trim(), password);
    } catch (err: any) {
      Alert.alert("Gagal Pendaftaran", err.message || "Terjadi kesalahan saat membuat akun");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative SVG Background Curves matching mockup */}
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
          {/* Header Title: Create Account */}
          <View className="items-center mb-9 mt-12">
            <Text
              style={{ fontFamily: "Poppins_700Bold", color: "#1F41BB" }}
              className="text-3xl text-center"
            >
              Create Account
            </Text>
          </View>

          {/* Form Input: Email */}
          <View className="mb-5">
            <TextInput
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: "#000000",
                backgroundColor: focusedField === "email" ? "#FFFFFF" : "#F1F4FF",
                borderColor: focusedField === "email" ? "#1F41BB" : "#F1F4FF",
                borderWidth: 2,
                borderRadius: 10,
                height: 58,
                paddingHorizontal: 16,
              }}
              placeholder="Email"
              placeholderTextColor="#626262"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Form Input: Password */}
          <View className="mb-5">
            <TextInput
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: "#000000",
                backgroundColor: focusedField === "password" ? "#FFFFFF" : "#F1F4FF",
                borderColor: focusedField === "password" ? "#1F41BB" : "#F1F4FF",
                borderWidth: 2,
                borderRadius: 10,
                height: 58,
                paddingHorizontal: 16,
              }}
              placeholder="Password"
              placeholderTextColor="#626262"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Form Input: Confirm Password */}
          <View className="mb-7">
            <TextInput
              style={{
                fontFamily: "Poppins_500Medium",
                fontSize: 14,
                color: "#000000",
                backgroundColor: focusedField === "confirm" ? "#FFFFFF" : "#F1F4FF",
                borderColor: focusedField === "confirm" ? "#1F41BB" : "#F1F4FF",
                borderWidth: 2,
                borderRadius: 10,
                height: 58,
                paddingHorizontal: 16,
              }}
              placeholder="Confirm Password"
              placeholderTextColor="#626262"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Primary Button: Sign up */}
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
            className="items-center justify-center mb-6"
            onPress={handleRegister}
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
                Sign up
              </Text>
            )}
          </TouchableOpacity>

          {/* Already have an account link */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="items-center py-2"
            activeOpacity={0.7}
          >
            <Text
              style={{ fontFamily: "Poppins_600SemiBold", color: "#494949" }}
              className="text-sm text-center"
            >
              Already have an account
            </Text>
          </TouchableOpacity>

          {/* Or continue with */}
          <View className="items-center mt-12 mb-4">
            <Text
              style={{ fontFamily: "Poppins_600SemiBold", color: "#1F41BB" }}
              className="text-sm"
            >
              Or continue with
            </Text>
          </View>

          {/* Social Google Icon Button */}
          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Google Sign-In",
                  "Fitur Google Sign-In sedang disiapkan untuk akun sekolah."
                )
              }
              activeOpacity={0.8}
              style={{
                width: 60,
                height: 44,
                backgroundColor: "#ECECEC",
                borderRadius: 10,
              }}
              className="items-center justify-center shadow-2xs"
            >
              <Svg width={22} height={22} viewBox="0 0 24 24">
                <Path
                  fill="#000000"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <Path
                  fill="#000000"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <Path
                  fill="#000000"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <Path
                  fill="#000000"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}