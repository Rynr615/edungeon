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
  const { userProfile } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  useFocusEffect(useCallback(()=>{StatusBar.setStyle('dark');return()=>StatusBar.setStyle('auto');},[]));
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
        <SvgUri
          uri={
            Image.resolveAssetSource(
              require("../../assets/challenge/avatar.svg"),
            ).uri
          }
        />
      </View>
    </View>
  );
}
