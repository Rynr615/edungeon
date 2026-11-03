// mobile/components/home/LessonContentView.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SubBab, ContohSoal, LatihanFormatif } from "../../types/module";
import { StepExampleCard } from "./StepExampleCard";
import { VideoPlayerCard } from "./VideoPlayerCard";
import { CalloutBox } from "./CalloutBox";
import { FormulaBlock } from "./FormulaBlock";
import { Icon } from "../ui/Icon";
import { COPY } from "../../constants/copy";

interface LessonContentViewProps {
  subBabList: SubBab[];
  ringkasanRumus?: string[];
  onCompleteSubBab: (subBabId: string) => void;
  subBabSelesai: string[];
}

export const LessonContentView: React.FC<LessonContentViewProps> = ({
  subBabList,
  ringkasanRumus = [],
  onCompleteSubBab,
  subBabSelesai,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const handleSelectOption = (latihanId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [latihanId]: option }));
  };

  const toggleExplanation = (latihanId: string) => {
    setShowExplanation((prev) => ({ ...prev, [latihanId]: !prev[latihanId] }));
  };

  return (
    <View className="mb-6">
      {/* 1. Ringkasan Rumus Kunci Bab (Jika Ada) */}
      {ringkasanRumus.length > 0 && (
        <View className="mb-4">
          {ringkasanRumus.map((rumus, rIdx) => (
            <FormulaBlock
              key={rIdx}
              formula={rumus}
              title={`Formula Inti #${rIdx + 1}`}
            />
          ))}
        </View>
      )}

      {/* 2. Render Sub-Bab Aktif */}
      {subBabList.map((sub, sIndex) => {
        const isDone = subBabSelesai.includes(sub.id_sub_bab);

        return (
          <View key={sub.id_sub_bab || sIndex} className="mb-4">
            {/* Tujuan Pembelajaran Khusus Sub-Bab */}
            {sub.tujuan_pembelajaran && (
              <CalloutBox
                type="info"
                title="Tujuan Pembelajaran"
                content={sub.tujuan_pembelajaran}
              />
            )}

            {/* Teks Penjelasan Materi (Tipografi Nyaman, Line-Height 1.6x) */}
            <View className="bg-surface border border-border p-5 rounded-2xl mb-4 shadow-sm">
              <Text className="text-text text-base leading-7 tracking-wide select-text">
                {sub.teks_penjelasan}
              </Text>
            </View>

            {/* Callout Tips Belajar Otomatis */}
            <CalloutBox
              type="tip"
              content="Pahami konsep dasar sebelum menghafal formula. Uraikan setiap perkalian bertahap untuk mencegah salah hitung!"
            />

            {/* Contoh Soal Berlangkah */}
            {sub.contoh_soal && sub.contoh_soal.length > 0 && (
              <View className="mb-2">
                <Text className="text-text font-bold text-base mb-3">
                  💡 {COPY.module.reader.stepExampleTitle}
                </Text>
                {sub.contoh_soal.map((cs: ContohSoal, cIdx: number) => (
                  <StepExampleCard
                    key={cIdx}
                    example={cs}
                    index={cIdx}
                  />
                ))}
              </View>
            )}

            {/* Video Edukasi Terintegrasi */}
            {(sub.video_id || sub.video_url) && (
              <VideoPlayerCard
                title={sub.judul}
                videoId={sub.video_id}
                videoUrl={sub.video_url}
              />
            )}

            {/* Latihan Formatif Mandiri (Bebas Stres, Tanpa Pengurangan HP) */}
            {sub.latihan_formatif && sub.latihan_formatif.length > 0 && (
              <View className="bg-surface border border-border p-5 rounded-2xl mb-5 shadow-sm">
                <View className="flex-row items-center mb-1">
                  <Icon name="PencilSquareIcon" size={18} color="#38bdf8" />
                  <Text className="text-text font-bold text-base ml-2">
                    {COPY.module.reader.practiceTitle}
                  </Text>
                </View>
                <Text className="text-text-muted text-xs mb-4">
                  {COPY.module.reader.practiceNote}
                </Text>

                {sub.latihan_formatif.map((lat: LatihanFormatif, lIdx: number) => {
                  const userAnswer = selectedAnswers[lat.id_latihan];
                  const isCorrect = userAnswer === lat.kunci;
                  const isShowExp = showExplanation[lat.id_latihan];

                  return (
                    <View
                      key={lat.id_latihan || lIdx}
                      className="bg-surface-alt/40 border border-border p-4 rounded-xl mb-4"
                    >
                      <Text className="text-text font-semibold text-sm leading-relaxed mb-3">
                        {lIdx + 1}. {lat.pertanyaan}
                      </Text>

                      {/* Tombol Opsi Jawaban (Tinggi Minimal 48dp) */}
                      <View className="space-y-2 mb-3">
                        {lat.opsi.map((opt, oIdx) => {
                          const isSelected = userAnswer === opt;
                          return (
                            <TouchableOpacity
                              key={oIdx}
                              activeOpacity={0.7}
                              onPress={() => handleSelectOption(lat.id_latihan, opt)}
                              className={`p-3.5 rounded-xl border flex-row items-center justify-between mb-2 ${
                                isSelected
                                  ? isCorrect
                                    ? "bg-success/20 border-success"
                                    : "bg-danger/20 border-danger"
                                  : "bg-surface border-border"
                              }`}
                            >
                              <Text
                                className={`text-sm ${
                                  isSelected
                                    ? "text-text font-bold"
                                    : "text-text-muted font-medium"
                                }`}
                              >
                                {opt}
                              </Text>
                              {isSelected && (
                                <Icon
                                  name={isCorrect ? "CheckCircleIcon" : "XMarkIcon"}
                                  variant="solid"
                                  size={18}
                                  color={isCorrect ? "#34d399" : "#f87171"}
                                />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {/* Umpan Balik Instan */}
                      {userAnswer && (
                        <View className="pt-2 border-t border-border/50">
                          <Text
                            className={`text-xs font-bold mb-2 ${
                              isCorrect ? "text-success" : "text-danger"
                            }`}
                          >
                            {isCorrect
                              ? `✔ ${COPY.module.reader.correctFeedback}`
                              : `✖ ${COPY.module.reader.incorrectFeedback}`}
                          </Text>

                          {/* Tombol Buka / Tutup Pembahasan */}
                          <TouchableOpacity
                            onPress={() => toggleExplanation(lat.id_latihan)}
                            className="bg-surface-alt px-3 py-2 rounded-lg flex-row items-center self-start"
                          >
                            <Text className="text-primary text-xs font-bold">
                              {isShowExp
                                ? COPY.module.reader.hideExplanation
                                : COPY.module.reader.showExplanation}
                            </Text>
                            <Icon
                              name={isShowExp ? "ChevronUpIcon" : "ChevronDownIcon"}
                              size={14}
                              color="#38bdf8"
                              className="ml-1"
                            />
                          </TouchableOpacity>

                          {/* Kotak Teks Pembahasan */}
                          {isShowExp && (
                            <View className="bg-surface p-3 rounded-xl border border-border mt-2">
                              <Text className="text-text/90 text-xs leading-relaxed">
                                {lat.pembahasan}
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Badge Konfirmasi Selesai jika Sudah Ditandai */}
            {isDone && (
              <View className="bg-success/15 border border-success/40 p-3.5 rounded-2xl flex-row items-center justify-center mb-4">
                <Icon name="CheckCircleIcon" variant="solid" size={18} color="#22c55e" />
                <Text className="text-success font-bold text-xs ml-2">
                  {COPY.module.reader.subBabDoneBadge}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};
