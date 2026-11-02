// mobile/components/profile/EditProfileModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Icon } from "../ui/Icon";

interface EditProfileModalProps {
  visible: boolean;
  initialNama: string;
  initialNamaPanggilan?: string;
  initialKelas?: string;
  initialNoHp?: string;
  onClose: () => void;
  onSave: (data: {
    nama: string;
    nama_panggilan?: string;
    kelas?: string;
    no_hp?: string;
  }) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  initialNama,
  initialNamaPanggilan = "",
  initialKelas = "",
  initialNoHp = "",
  onClose,
  onSave,
}) => {
  const [nama, setNama] = useState(initialNama);
  const [namaPanggilan, setNamaPanggilan] = useState(initialNamaPanggilan);
  const [kelas, setKelas] = useState(initialKelas);
  const [noHp, setNoHp] = useState(initialNoHp);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNama(initialNama);
    setNamaPanggilan(initialNamaPanggilan);
    setKelas(initialKelas);
    setNoHp(initialNoHp);
  }, [initialNama, initialNamaPanggilan, initialKelas, initialNoHp, visible]);

  const handleSave = async () => {
    if (!nama.trim() || nama.trim().length < 2) {
      Alert.alert("Gagal", "Nama minimal terdiri dari 2 karakter.");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        nama: nama.trim(),
        nama_panggilan: namaPanggilan.trim(),
        kelas: kelas.trim(),
        no_hp: noHp.trim(),
      });
      onClose();
    } catch (err: any) {
      Alert.alert("Gagal", err.message || "Gagal menyimpan perubahan biodata");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 shadow-2xl">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-mono font-bold text-lg text-gray-900">
              Ubah Informasi Pribadi
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="XMarkIcon" variant="outline" size={22} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Input Nama Lengkap */}
          <Text className="font-mono text-gray-700 text-xs font-semibold mb-1">Nama Lengkap</Text>
          <TextInput
            value={nama}
            onChangeText={setNama}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor="#9ca3af"
            className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm mb-3 text-gray-900"
          />

          {/* Input Nama Panggilan */}
          <Text className="font-mono text-gray-700 text-xs font-semibold mb-1">Nama Panggilan</Text>
          <TextInput
            value={namaPanggilan}
            onChangeText={setNamaPanggilan}
            placeholder="Masukkan nama panggilan"
            placeholderTextColor="#9ca3af"
            className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm mb-3 text-gray-900"
          />

          {/* Input Kelas */}
          <Text className="font-mono text-gray-700 text-xs font-semibold mb-1">Kelas</Text>
          <TextInput
            value={kelas}
            onChangeText={setKelas}
            placeholder="Contoh: X IPA 1"
            placeholderTextColor="#9ca3af"
            className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm mb-3 text-gray-900"
          />

          {/* Input No HP */}
          <Text className="font-mono text-gray-700 text-xs font-semibold mb-1">No. HP / WhatsApp</Text>
          <TextInput
            value={noHp}
            onChangeText={setNoHp}
            placeholder="08xxxxxxxxxx"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm mb-6 text-gray-900"
          />

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="bg-gray-900 py-3.5 rounded-xl items-center mb-4"
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="font-mono text-white font-bold text-base">Simpan Perubahan</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
