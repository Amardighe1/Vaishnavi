"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function DataInitializer() {
  const fetchLikedSongs = useUserStore((state) => state.fetchLikedSongs);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser().then(() => {
      fetchLikedSongs();
    });
  }, [fetchLikedSongs, fetchUser]);

  return null;
}

