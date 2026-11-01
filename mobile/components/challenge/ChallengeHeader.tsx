import React,{useCallback} from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useRouter,useFocusEffect } from "expo-router";
import { SvgUri } from "react-native-svg";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "../ui/Icon";
import { s } from "./styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
export function ChallengeHeader({ back = false }: { back?: boolean }) {
  const { userProfile, fetchProfile } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
      void fetchProfile();
      return () => StatusBar.setStyle("auto");
    }, [fetchProfile])
  );
  return (
    <View
      style={[
        s.row,
        {
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: 16,
        },
      ]}
    >
      {back ? (
        <Pressable
          accessibilityLabel="Kembali ke peta"
          onPress={() => router.replace("/(tabs)/challenge")}
          style={{ padding: 8 }}
        >
          <Icon name="ChevronLeftIcon" color="#1b1410" />
        </Pressable>
      ) : (
        <View>
          <Text style={s.text}>
            Hello, {userProfile?.nama?.split(" ")[0] || "Petualang"}
          </Text>
          <Text style={s.label}>{userProfile?.kelas || "Edungeon"}</Text>
        </View>
      )}
      <View style={s.row}>
        <Text style={s.label}>
          Lvl {Math.floor((userProfile?.total_exp || 0) / 100) + 1}
        </Text>
        <Pressable
          accessibilityLabel="Buka profil pengguna"
          onPress={() => router.push("/(tabs)/profile" as any)}
          style={{ marginLeft: 8 }}
        >
          {userProfile?.avatar &&
          (userProfile.avatar.startsWith("http") ||
            userProfile.avatar.startsWith("data:") ||
            userProfile.avatar.startsWith("file:")) ? (
            <Image
              source={{ uri: userProfile.avatar }}
              style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: "#ca8a04" }}
            />
          ) : (
            <SvgUri
              uri={
                Image.resolveAssetSource(
                  require("../../assets/challenge/avatar.svg"),
                ).uri
              }
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
