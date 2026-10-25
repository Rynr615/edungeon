// mobile/app/index.tsx
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center p-4">
      <View className="bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full max-w-sm items-center shadow-lg">
        <Text className="text-2xl font-bold text-blue-400 mb-2">
          Edungeon
        </Text>
        <Text className="text-slate-300 text-center mb-6">
          Aplikasi Mobile Gamifikasi Berbasis Roguelike
        </Text>
        <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-xl w-full items-center">
          <Text className="text-white font-semibold text-base">
            Tailwind & Expo Aktif
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}