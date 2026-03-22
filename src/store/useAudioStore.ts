import { create } from "zustand";

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  image?: { url: string }[];
}

interface AudioState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  isFullScreen: boolean;
  playSong: (song: Song, queue?: Song[]) => void;
  pauseSong: () => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (vol: number) => void;
  setProgress: (time: number, duration: number) => void;
  setFullScreen: (val: boolean) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  duration: 0,
  currentTime: 0,
  isFullScreen: false,

  playSong: (song, queue) => set((state) => ({ 
    currentSong: song, 
    isPlaying: true, 
    queue: queue || state.queue // Keep existing queue if none provided
  })),
  
  pauseSong: () => set({ isPlaying: false }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  playNext: () => {
    const { currentSong, queue } = get();
    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    if (currentIndex !== -1 && currentIndex + 1 < queue.length) {
      set({ currentSong: queue[currentIndex + 1], isPlaying: true });
    } else if (queue.length > 0) {
      // Loop back to start if at the end Option
      set({ currentSong: queue[0], isPlaying: true });
    }
  },
  
  playPrev: () => {
    const { currentSong, queue, currentTime } = get();
    if (!currentSong || queue.length === 0) return;
    
    // If we're more than 3 seconds in, just restart the current song
    if (currentTime > 3) {
      set({ currentTime: 0 }); // Will be handled by the UI updating time
      const player = document.getElementById("audio-player") as HTMLAudioElement;
      if (player) player.currentTime = 0;
      return;
    }
    
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    if (currentIndex > 0) {
      set({ currentSong: queue[currentIndex - 1], isPlaying: true });
    } else if (queue.length > 0) {
      // Loop to end if at the start
      set({ currentSong: queue[queue.length - 1], isPlaying: true });
    }
  },

  setVolume: (vol) => set({ volume: vol }),
  setProgress: (time, duration) => set({ currentTime: time, duration: duration }),
  setFullScreen: (val) => set({ isFullScreen: val }),
}));
