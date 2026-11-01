// mobile/context/AudioContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Vibration, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { profileService } from "../services/profileService";

export type SfxType =
  | "click"
  | "correct"
  | "wrong"
  | "slash"
  | "boss_hit"
  | "victory"
  | "defeat"
  | "buff_draft"
  | "badge_unlock";

export type BgmTrack = "menu" | "dungeon" | "boss";

interface AudioContextType {
  audioEnabled: boolean;
  volume: number;
  currentBgm: BgmTrack | null;
  toggleAudio: (enabled?: boolean) => Promise<void>;
  setVolumeLevel: (volume: number) => Promise<void>;
  playSfx: (sfx: SfxType) => void;
  playBgm: (track: BgmTrack) => void;
  stopBgm: () => void;
}

const AudioContext = createContext<AudioContextType>({} as AudioContextType);

const STORAGE_KEY_AUDIO_ENABLED = "@edungeon_audio_enabled";
const STORAGE_KEY_AUDIO_VOLUME = "@edungeon_audio_volume";

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useAuth();
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(1.0);
  const [currentBgm, setCurrentBgm] = useState<BgmTrack | null>("menu");

  // Load initial settings from userProfile or AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (userProfile) {
          if (typeof userProfile.audio_aktif === "boolean") {
            setAudioEnabled(userProfile.audio_aktif);
          }
          if (typeof userProfile.volume_audio === "number") {
            setVolume(userProfile.volume_audio);
          }
        } else {
          const storedAudio = await AsyncStorage.getItem(STORAGE_KEY_AUDIO_ENABLED);
          const storedVol = await AsyncStorage.getItem(STORAGE_KEY_AUDIO_VOLUME);

          if (storedAudio !== null) {
            setAudioEnabled(storedAudio === "true");
          }
          if (storedVol !== null) {
            setVolume(parseFloat(storedVol));
          }
        }
      } catch (e) {
        console.warn("[AudioContext] Error loading cached audio settings:", e);
      }
    };

    loadSettings();
  }, [userProfile]);

  const toggleAudio = async (enabled?: boolean) => {
    const nextVal = typeof enabled === "boolean" ? enabled : !audioEnabled;
    setAudioEnabled(nextVal);

    try {
      await AsyncStorage.setItem(STORAGE_KEY_AUDIO_ENABLED, String(nextVal));
      if (userProfile) {
        await profileService.updateSettings({ audio_aktif: nextVal });
      }
    } catch (e) {
      console.warn("[AudioContext] Gagal sync audio toggle:", e);
    }
  };

  const setVolumeLevel = async (newVol: number) => {
    const clamped = Math.max(0, Math.min(1.0, newVol));
    setVolume(clamped);

    try {
      await AsyncStorage.setItem(STORAGE_KEY_AUDIO_VOLUME, String(clamped));
      if (userProfile) {
        await profileService.updateSettings({ volume_audio: clamped });
      }
    } catch (e) {
      console.warn("[AudioContext] Gagal sync volume:", e);
    }
  };

  const playSfx = (sfx: SfxType) => {
    if (!audioEnabled || volume <= 0) return;

    // Haptic feedback feedback pairing
    try {
      switch (sfx) {
        case "correct":
        case "badge_unlock":
        case "victory":
          Vibration.vibrate(Platform.OS === "android" ? [0, 40, 60, 40] : 80);
          break;
        case "wrong":
        case "defeat":
          Vibration.vibrate(Platform.OS === "android" ? [0, 80, 50, 100] : 150);
          break;
        case "boss_hit":
        case "slash":
          Vibration.vibrate(60);
          break;
        case "click":
        case "buff_draft":
        default:
          Vibration.vibrate(25);
          break;
      }
    } catch (e) {
      // Ignored on web/unsupported
    }

    if (__DEV__) {
      console.log(`[SFX PLAYED] ${sfx} (Vol: ${Math.round(volume * 100)}%)`);
    }
  };

  const playBgm = (track: BgmTrack) => {
    if (!audioEnabled) {
      setCurrentBgm(null);
      return;
    }
    setCurrentBgm(track);
    if (__DEV__) {
      console.log(`[BGM PLAYING] Track: ${track} (Vol: ${Math.round(volume * 100)}%)`);
    }
  };

  const stopBgm = () => {
    setCurrentBgm(null);
    if (__DEV__) {
      console.log("[BGM STOPPED]");
    }
  };

  return (
    <AudioContext.Provider
      value={{
        audioEnabled,
        volume,
        currentBgm,
        toggleAudio,
        setVolumeLevel,
        playSfx,
        playBgm,
        stopBgm,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
