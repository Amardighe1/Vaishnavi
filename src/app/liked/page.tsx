"use client";

import { Heart, Play } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useAudioStore } from "@/store/useAudioStore";
import clsx from "clsx";

export default function LikedSongsPage() {
  const { likedSongs, isLoading, isLiked, toggleLike } = useUserStore();
  const { playSong, currentSong, isPlaying, togglePlay } = useAudioStore();

  const handlePlayFirst = () => {
    if (likedSongs.length > 0) {
      if (currentSong?.id === likedSongs[0].id) {
        togglePlay();
      } else {
        playSong(likedSongs[0], likedSongs);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-32 p-4 sm:p-6 lg:pt-8 bg-gradient-to-b from-[#2a131a] to-[#121212]">
      <div className="flex flex-col md:flex-row items-end gap-6 mb-8 mt-10 md:mt-20 px-2 lg:px-4">
        <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-love-magenta to-love-accent shadow-[0_10px_40px_rgba(229,9,20,0.5)] flex items-center justify-center flex-shrink-0">
          <Heart className="w-24 h-24 text-white fill-current shadow-lg" />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <span className="text-white text-sm font-semibold hidden md:block">Playlist</span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tighter w-full truncate py-2">Liked Songs</h1>
          <div className="flex items-center gap-2 text-sm text-text-secondary mt-2">
            <span className="text-white font-medium hover:underline cursor-pointer">Your Name</span>
            <span>•</span>
            <span>{likedSongs.length} songs</span>
          </div>
        </div>
      </div>

      <div className="px-2 lg:px-4 mb-8">
        <button 
          onClick={handlePlayFirst}
          className="w-14 h-14 bg-love-accent rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          disabled={likedSongs.length === 0}
        >
          {isPlaying && currentSong && likedSongs.length > 0 && currentSong.id === likedSongs[0].id ? (
            <div className="w-4 h-4 bg-white rounded-sm animate-pulse" />
          ) : (
            <Play fill="currentColor" strokeWidth={0} className="w-7 h-7 ml-1" />
          )}
        </button>
      </div>

      <div className="w-full border-b border-white/10 mb-4 px-2 lg:px-4"></div>

      {isLoading ? (
        <div className="flex justify-center mt-20">
          <div className="w-12 h-12 border-4 border-love-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : likedSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <Heart className="w-16 h-16 text-text-secondary mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Songs you love will appear here</h2>
          <p className="text-text-secondary max-w-sm">Save songs by tapping the heart icon.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 px-2 lg:px-4">
          {likedSongs.map((song, index) => {
            const isThisPlaying = currentSong?.id === song.id && isPlaying;
            return (
              <div 
                key={song.id}
                onClick={() => playSong(song, likedSongs)}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-white/10 group cursor-pointer transition-colors"
              >
                <div className="w-4 text-center text-text-secondary group-hover:hidden">
                  {isThisPlaying ? (
                     <div className="w-full h-full flex justify-center items-center"><div className="w-2 h-2 bg-love-accent rounded-full animate-pulse" /></div>
                  ) : index + 1}
                </div>
                <div className="w-4 hidden group-hover:flex items-center justify-center">
                   <Play className="w-4 h-4 text-white fill-current" />
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={song.coverUrl} className="w-10 h-10 object-cover rounded shadow" alt="cover" loading="lazy" />
                
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className={clsx("font-medium truncate", isThisPlaying ? "text-love-soft" : "text-white")}>{song.title}</span>
                  <span className="text-sm text-text-secondary truncate">{song.artist}</span>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
                  className="p-3 text-love-accent opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


