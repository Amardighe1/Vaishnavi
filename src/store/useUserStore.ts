import { create } from "zustand";
import { Song } from "./useAudioStore";

export interface UserProfile {
  email: string;
  phone?: string;
  name?: string;
  avatarUrl?: string;
}

export interface PlaylistType {
  _id: string;
  name: string;
  coverUrl: string;
  songs: Song[];
  createdAt: string;
}

interface UserState {
  user: UserProfile | null;
  likedSongs: Song[];
  playlists: PlaylistType[];
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  fetchLikedSongs: () => Promise<void>;
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (name: string) => Promise<void>;
  addToPlaylist: (playlistId: string, song: Song) => Promise<void>;
  removeFromPlaylist: (playlistId: string, song: Song) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  toggleLike: (song: Song) => Promise<void>;
  isLiked: (songId: string) => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  likedSongs: [],
  playlists: [],
  isLoading: false,

  fetchUser: async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const { user } = await res.json();
        set({ user });
      } else {
        set({ user: null });
      }
    } catch {
      set({ user: null });
    }
  },

  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null, likedSongs: [], playlists: [] });
  },

  fetchLikedSongs: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/liked");
      if (res.ok) {
        const data = await res.json();
        set({ likedSongs: data });
      }
    } catch (err) {
      console.error("Failed to fetch liked songs");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylists: async () => {
    try {
      const res = await fetch("/api/playlists");
      if (res.ok) {
        const data = await res.json();
        set({ playlists: data });
      }
    } catch (err) {
      console.error("Failed to fetch playlists");
    }
  },

  createPlaylist: async (name: string) => {
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        get().fetchPlaylists();
      }
    } catch (err) {
      console.error("Failed to create playlist");
    }
  },

  addToPlaylist: async (playlistId: string, song: Song) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song, action: "add" }),
      });
      if (res.ok) get().fetchPlaylists();
    } catch (err) {
      console.error("Failed to add to playlist");
    }
  },

  removeFromPlaylist: async (playlistId: string, song: Song) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song, action: "remove" }),
      });
      if (res.ok) get().fetchPlaylists();
    } catch (err) {
      console.error("Failed to remove from playlist");
    }
  },

  deletePlaylist: async (playlistId: string) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}`, { method: "DELETE" });
      if (res.ok) get().fetchPlaylists();
    } catch (err) {
      console.error("Failed to delete playlist");
    }
  },

  toggleLike: async (song: Song) => {
    // If not logged in, redirect handled in UI, or just fail silently/alert
    if (!get().user) return; 

    try {
      const current = get().likedSongs;
      const isAlreadyLiked = current.some(s => s.id === song.id);
      
      set({ 
        likedSongs: isAlreadyLiked 
          ? current.filter(s => s.id !== song.id)
          : [song, ...current]
      });

      const res = await fetch("/api/liked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(song),
      });

      if (!res.ok) {
        set({ likedSongs: current });
      }
    } catch (err) {
      console.error("Failed to toggle like");
    }
  },

  isLiked: (songId: string) => {
    return get().likedSongs.some(song => song.id === songId);
  }
}));

