// mobile/components/profile/ProfileMenuActions.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";

interface ProfileMenuActionsProps {
  hasIncompleteProfile?: boolean;
  onPressEditProfile: () => void;
  onPressLeaderboard: () => void;
  onPressSettings: () => void;
  onPressLogout: () => void;
}

export const ProfileMenuActions: React.FC<ProfileMenuActionsProps> = ({
  hasIncompleteProfile = false,
  onPressEditProfile,
  onPressLeaderboard,
  onPressSettings,
  onPressLogout,
}) => {
  return (
    <View className="bg-surface border border-surface-light rounded-3xl p-2 mb-8">
      {/* 1. Edit Profile */}
      <TouchableOpacity
        onPress={onPressEditProfile}
        activeOpacity={0.7}
        className="flex-row items-center justify-between p-3.5 border-b border-surface-light/60"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl bg-blue-500/10 items-center justify-center mr-3 border border-blue-500/20">
            <Icon name="PencilSquareIcon" variant="outline" size={20} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-text font-bold text-sm">Edit Profil</Text>
              {hasIncompleteProfile && (
                <View className="flex-row items-center bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 ml-2">
                  <Icon name="ExclamationTriangleIcon" variant="solid" size={11} color="#f59e0b" />
                  <Text className="text-amber-400 font-extrabold text-[10px] ml-1">
                    Lengkapi
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-subtext text-xs mt-0.5">
              Biodata, nama panggilan, nomor HP
            </Text>
          </View>
        </View>
        <Icon name="ChevronRightIcon" variant="outline" size={18} color="#64748b" />
      </TouchableOpacity>

      {/* 2. Leaderboard */}
      <TouchableOpacity
        onPress={onPressLeaderboard}
        activeOpacity={0.7}
        className="flex-row items-center justify-between p-3.5 border-b border-surface-light/60"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl bg-purple-500/10 items-center justify-center mr-3 border border-purple-500/20">
            <Icon name="TrophyIcon" variant="outline" size={20} color="#a855f7" />
          </View>
          <View className="flex-1">
            <Text className="text-text font-bold text-sm">Papan Peringkat</Text>
            <Text className="text-subtext text-xs mt-0.5">
              Peringkat 10 besar pahlawan Edungeon
            </Text>
          </View>
        </View>
        <Icon name="ChevronRightIcon" variant="outline" size={18} color="#64748b" />
      </TouchableOpacity>

      {/* 3. Settings */}
      <TouchableOpacity
        onPress={onPressSettings}
        activeOpacity={0.7}
        className="flex-row items-center justify-between p-3.5 border-b border-surface-light/60"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl bg-slate-500/10 items-center justify-center mr-3 border border-slate-500/20">
            <Icon name="Cog6ToothIcon" variant="outline" size={20} color="#94a3b8" />
          </View>
          <View className="flex-1">
            <Text className="text-text font-bold text-sm">Pengaturan & Audio</Text>
            <Text className="text-subtext text-xs mt-0.5">
              Musik, efek suara, preferensi aplikasi
            </Text>
          </View>
        </View>
        <Icon name="ChevronRightIcon" variant="outline" size={18} color="#64748b" />
      </TouchableOpacity>

      {/* 4. Logout */}
      <TouchableOpacity
        onPress={onPressLogout}
        activeOpacity={0.7}
        className="flex-row items-center justify-between p-3.5"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl bg-red-500/10 items-center justify-center mr-3 border border-red-500/20">
            <Icon name="ArrowRightOnRectangleIcon" variant="outline" size={20} color="#ef4444" />
          </View>
          <View className="flex-1">
            <Text className="text-danger font-bold text-sm">Keluar Akun</Text>
            <Text className="text-subtext text-xs mt-0.5">
              Keluar dari sesi login saat ini
            </Text>
          </View>
        </View>
        <Icon name="ChevronRightIcon" variant="outline" size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};
