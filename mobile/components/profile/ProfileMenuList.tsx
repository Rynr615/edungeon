// mobile/components/profile/ProfileMenuList.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "../ui/Icon";

interface ProfileMenuListProps {
  onEditProfilePress: () => void;
  onSettingsPress: () => void;
  onLogoutPress: () => void;
}

export const ProfileMenuList: React.FC<ProfileMenuListProps> = ({
  onEditProfilePress,
  onSettingsPress,
  onLogoutPress,
}) => {
  return (
    <View className="space-y-3 mb-10">
      {/* 1. Edit Profile */}
      <TouchableOpacity
        onPress={onEditProfilePress}
        activeOpacity={0.7}
        className="flex-row items-center justify-between py-2.5 mb-2.5"
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-11 h-11 rounded-full bg-[#EBF0FA] items-center justify-center mr-3.5">
            <Icon name="UserIcon" variant="outline" size={22} color="#4f46e5" />
          </View>
          <View className="flex-1">
            <Text className="text-[#0f172a] text-base font-bold">Edit Profile</Text>
            <Text className="text-gray-500 text-xs mt-0.5">
              Make changes to your account
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <View className="mr-2">
            <Icon name="ExclamationTriangleIcon" variant="solid" size={18} color="#ef4444" />
          </View>
          <Icon name="ChevronRightIcon" variant="outline" size={18} color="#94a3b8" />
        </View>
      </TouchableOpacity>

      {/* 2. Settings */}
      <TouchableOpacity
        onPress={onSettingsPress}
        activeOpacity={0.7}
        className="flex-row items-center justify-between py-2.5 mb-2.5"
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-11 h-11 rounded-full bg-[#EBF0FA] items-center justify-center mr-3.5">
            <Icon name="UserIcon" variant="outline" size={22} color="#4f46e5" />
          </View>
          <View className="flex-1">
            <Text className="text-[#0f172a] text-base font-bold">Settings</Text>
            <Text className="text-gray-500 text-xs mt-0.5">
              Manage your account
            </Text>
          </View>
        </View>

        <Icon name="ChevronRightIcon" variant="outline" size={18} color="#94a3b8" />
      </TouchableOpacity>

      {/* 3. Log out */}
      <TouchableOpacity
        onPress={onLogoutPress}
        activeOpacity={0.7}
        className="flex-row items-center justify-between py-2.5"
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="w-11 h-11 rounded-full bg-[#F1F5F9] items-center justify-center mr-3.5">
            <Icon name="ArrowRightOnRectangleIcon" variant="outline" size={20} color="#64748b" />
          </View>
          <View className="flex-1">
            <Text className="text-[#0f172a] text-base font-bold">Log out</Text>
            <Text className="text-gray-500 text-xs mt-0.5">
              Further secure your account for safety
            </Text>
          </View>
        </View>

        <Icon name="ChevronRightIcon" variant="outline" size={18} color="#94a3b8" />
      </TouchableOpacity>
    </View>
  );
};
