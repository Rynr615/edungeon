// mobile/components/home/TableOfContentsSheet.tsx
import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "../ui/Icon";
import { SubBab } from "../../types/module";
import { SubBabStatusIcon } from "./SubBabStatusIcon";
import { ModuleProgressBar } from "./ModuleProgressBar";

interface TableOfContentsSheetProps {
  visible: boolean;
  onClose: () => void;
  moduleTitle: string;
  subBabs: SubBab[];
  activeSubBabId: string;
  completedSubBabIds: string[];
  onSelectSubBab: (subBabId: string) => void;
  onOpenFormulaCheatSheet?: () => void;
}

export const TableOfContentsSheet: React.FC<TableOfContentsSheetProps> = ({
  visible,
  onClose,
  moduleTitle,
  subBabs,
  activeSubBabId,
  completedSubBabIds,
  onSelectSubBab,
  onOpenFormulaCheatSheet,
}) => {
  const totalSub = subBabs.length;
  const completedCount = completedSubBabIds.length;
  const progressPercent =
    totalSub > 0 ? Math.round((completedCount / totalSub) * 100) : 0;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/70 justify-end">
          <TouchableWithoutFeedback>
            <View className="bg-surface border-t-2 border-border rounded-t-3xl max-h-[80%] p-5 pb-8 shadow-2xl">
              {/* Drag Handle Bar */}
              <View className="items-center mb-4">
                <View className="w-12 h-1.5 bg-surface-alt rounded-full" />
              </View>

              {/* Header Sheet */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1 mr-3">
                  <Text className="text-primary font-bold text-xs uppercase tracking-wider">
                    Daftar Isi Modul
                  </Text>
                  <Text className="text-text font-bold text-lg" numberOfLines={1}>
                    {moduleTitle}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-8 h-8 rounded-full bg-surface-alt items-center justify-center border border-border"
                >
                  <Icon name="XMarkIcon" size={18} color="#9cb0c9" />
                </TouchableOpacity>
              </View>

              {/* Progress Ringkas */}
              <View className="bg-surface-alt/70 p-3 rounded-xl border border-border mb-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-text-muted text-xs">
                    {completedCount} dari {totalSub} Sub-Bab Tuntas
                  </Text>
                  <Text className="text-primary font-bold text-xs">
                    {progressPercent}%
                  </Text>
                </View>
                <ModuleProgressBar
                  progress={progressPercent}
                  showPercentText={false}
                  height={5}
                />
              </View>

              {/* List Sub-Bab Scrollable */}
              <ScrollView
                className="space-y-2 mb-4"
                showsVerticalScrollIndicator={false}
              >
                {subBabs.map((sub, idx) => {
                  const isDone = completedSubBabIds.includes(sub.id_sub_bab);
                  const isActive = sub.id_sub_bab === activeSubBabId;
                  const status = isDone
                    ? "selesai"
                    : isActive
                    ? "aktif"
                    : "belum_dibaca";

                  return (
                    <TouchableOpacity
                      key={sub.id_sub_bab || idx}
                      onPress={() => {
                        onSelectSubBab(sub.id_sub_bab);
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl flex-row items-center justify-between border ${
                        isActive
                          ? "bg-primary/10 border-primary shadow-sm"
                          : isDone
                          ? "bg-surface-alt/40 border-success/30"
                          : "bg-surface-alt/30 border-border"
                      }`}
                    >
                      <View className="flex-row items-center flex-1 mr-3">
                        <SubBabStatusIcon
                          status={status}
                          indexNumber={idx + 1}
                        />
                        <View className="ml-3 flex-1">
                          <Text
                            className={`text-sm font-bold ${
                              isActive
                                ? "text-primary"
                                : isDone
                                ? "text-text"
                                : "text-text-muted"
                            }`}
                            numberOfLines={1}
                          >
                            {sub.judul}
                          </Text>
                          <Text className="text-text-muted text-xs mt-0.5">
                            ~{sub.estimasi_menit || 8} Menit Membaca
                          </Text>
                        </View>
                      </View>

                      {isDone && (
                        <View className="bg-success/20 px-2 py-0.5 rounded-md">
                          <Text className="text-success font-bold text-xs">
                            Selesai
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Tombol Akses Kartu Rumus Cepat */}
              {onOpenFormulaCheatSheet && (
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onOpenFormulaCheatSheet();
                  }}
                  className="bg-surface-alt border border-primary/40 py-3 rounded-xl flex-row items-center justify-center active:opacity-80"
                >
                  <Icon name="DocumentTextIcon" size={18} color="#38bdf8" />
                  <Text className="text-primary font-bold text-xs ml-2">
                    Buka Kartu Rumus Kunci
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
