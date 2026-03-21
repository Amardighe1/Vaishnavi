import { create } from "zustand";

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

interface AudioState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  isFullScreen: boolean;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  setProgress: (time: number, duration: number) => void;
  setFullScreen: (val: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  duration: 0,
  currentTime: 0,
  isFullScreen: false,

  playSong: (song) => set({ currentSong: song, isPlaying: true }),
  pauseSong: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (vol) => set({ volume: vol }),
  setProgress: (time, duration) => set({ currentTime: time, duration: duration }),
  setFullScreen: (val) => set({ isFullScreen: val }),
}));
