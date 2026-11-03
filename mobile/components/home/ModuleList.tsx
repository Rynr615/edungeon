// mobile/components/home/ModuleList.tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import { ModuleCard } from "./ModuleCard";
import { ModuleLockedModal } from "./ModuleLockedModal";
import { Modul } from "../../types/module";
import { COPY } from "../../constants/copy";
import { Icon } from "../ui/Icon";

interface ModuleListProps {
  modules: Modul[];
  onSelectModule: (modulId: string) => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  onSelectModule,
}) => {
  const [lockedModalVisible, setLockedModalVisible] = useState(false);
  const [selectedLockedModule, setSelectedLockedModule] = useState<{
    title: string;
    prereqTitle: string;
  } | null>(null);

  const matematikaModules = modules.filter(
    (m) => m.mata_pelajaran === "Matematika"
  );
  const informatikaModules = modules.filter(
    (m) => m.mata_pelajaran === "Informatika"
  );

  const handleLockedPress = (modul: Modul, prevModulTitle?: string) => {
    setSelectedLockedModule({
      title: modul.nama_modul,
      prereqTitle: prevModulTitle || "Modul Sebelumnya",
    });
    setLockedModalVisible(true);
  };

  return (
    <View className="mb-10">
      <View className="mb-3">
        <Text className="text-text font-bold text-lg">
          {COPY.home.curriculumTitle}
        </Text>
        <Text className="text-text-muted text-xs">
          {COPY.home.curriculumSubtitle}
        </Text>
      </View>

      {/* Bagian Mata Pelajaran: Matematika Wajib Kelas X */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="bg-primary/20 p-1.5 rounded-lg mr-2 border border-primary/30">
            <Icon name="AcademicCapIcon" size={16} color="#38bdf8" />
          </View>
          <Text className="text-primary font-bold text-xs uppercase tracking-wider">
            Matematika Wajib • 5 Modul
          </Text>
        </View>

        {matematikaModules.map((modul, index) => {
          const subBabs = modul.sub_bab || [];
          const completedSubs = modul.sub_bab_selesai || [];
          const progressPercent =
            subBabs.length > 0
              ? Math.round((completedSubs.length / subBabs.length) * 100)
              : 0;

          const prevModule = index > 0 ? matematikaModules[index - 1] : undefined;
          const status = modul.status_progres || "mulai";

          return (
            <ModuleCard
              key={modul.id_modul || modul.id || index}
              index={index}
              title={modul.nama_modul}
              subject={modul.mata_pelajaran}
              subBabCount={subBabs.length}
              estimatedMinutes={modul.estimasi_menit || 30}
              status={status}
              progressPercent={progressPercent}
              prerequisiteTitle={prevModule?.nama_modul}
              onPress={() => onSelectModule(modul.id_modul || modul.id)}
              onLockedPress={() => handleLockedPress(modul, prevModule?.nama_modul)}
            />
          );
        })}
      </View>

      {/* Bagian Mata Pelajaran: Informatika (Slot "Segera Hadir") */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="bg-surface-alt p-1.5 rounded-lg mr-2 border border-border">
            <Icon name="ComputerDesktopIcon" size={16} color="#94a3b8" />
          </View>
          <Text className="text-text-muted font-bold text-xs uppercase tracking-wider">
            Informatika Kelas X
          </Text>
        </View>

        {informatikaModules.length > 0 ? (
          informatikaModules.map((modul, index) => (
            <ModuleCard
              key={modul.id_modul || modul.id || index}
              index={index}
              title={modul.nama_modul}
              subject={modul.mata_pelajaran}
              subBabCount={(modul.sub_bab || []).length}
              status="terkunci"
              progressPercent={0}
              onPress={() => {}}
              onLockedPress={() =>
                handleLockedPress(modul, "Semua Modul Matematika")
              }
            />
          ))
        ) : (
          <View className="p-4 rounded-2xl bg-surface/40 border border-border/60 border-dashed flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-text-muted font-bold text-sm">
                Berpikir Komputasional & Pemrograman
              </Text>
              <Text className="text-text-muted/60 text-xs mt-0.5">
                Akan terbuka setelah kurikulum matematika tuntas
              </Text>
            </View>
            <View className="bg-surface-alt px-3 py-1.5 rounded-lg border border-border">
              <Text className="text-text-muted text-xs font-bold">
                {COPY.home.status.comingSoon}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Modal Interaktif saat Modul Terkunci Diketuk */}
      <ModuleLockedModal
        visible={lockedModalVisible}
        onClose={() => setLockedModalVisible(false)}
        moduleTitle={selectedLockedModule?.title}
        prerequisiteTitle={selectedLockedModule?.prereqTitle}
      />
    </View>
  );
};
