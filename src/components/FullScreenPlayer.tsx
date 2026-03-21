"use client";

import React, { useState } from "react";
import { useAudioStore } from "@/store/useAudioStore";
import { useUserStore } from "@/store/useUserStore";
import { ChevronDown, Heart, ListPlus, Play, Pause, SkipBack, SkipForward, LayoutList, Text } from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function FullScreenPlayer() {
  const { currentSong, isPlaying, togglePlay, currentTime, duration, setProgress, isFullScreen, setFullScreen } = useAudioStore();
  const { user, isLiked, toggleLike, playlists, addToPlaylist } = useUserStore();
  const router = useRouter();

  const [showPlaylists, setShowPlaylists] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  if (!isFullScreen || !currentSong) return null;

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setProgress(newTime, duration);
    const audioEl = document.getElementById("audio-player") as HTMLAudioElement;
    if (audioEl) {
      audioEl.currentTime = newTime;
    }
  };

  const currentIsLiked = isLiked(currentSong.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setFullScreen(false);
      router.push("/login");
      return;
    }
    toggleLike(currentSong);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background text-white flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300">
      {/* Blurred Background Art */}
      <div 
        className="absolute inset-0 z-0 opacity-40 blur-[80px] scale-150 transform-gpu bg-cover bg-center transition-all duration-700" 
        style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-background/80 to-background" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 pt-safe">
        <button 
          onClick={() => setFullScreen(false)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ChevronDown size={28} />
        </button>
        <span className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
          Now Playing
        </span>
        <button 
          onClick={() => setShowLyrics(!showLyrics)}
          className={clsx("p-2 transition-colors rounded-full", showLyrics ? "bg-white/20 text-white" : "text-text-secondary hover:text-white")}
        >
          <Text size={24} />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-8 pb-10">
        
        {showLyrics ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-4 overflow-y-auto w-full h-full max-h-[50vh]">
            <h2 className="text-3xl font-bold mb-6 text-love-soft">Lyrics</h2>
            <p className="text-lg leading-relaxed text-text-secondary">
              Lyrics are currently not available for this track.<br/><br/>
              Enjoy the music! 🎵
            </p>
          </div>
        ) : (
          /* Album Art */
          <div className="flex-1 flex items-center justify-center min-h-0 mb-8 mt-4">
            <div className="w-full max-w-[380px] aspect-square rounded-xl overflow-hidden shadow-2xl relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={currentSong.coverUrl} 
                alt={currentSong.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Song Info & Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col flex-1 min-w-0 pr-4">
            <h1 className="text-2xl md:text-3xl font-bold truncate">{currentSong.title}</h1>
            <p className="text-lg text-text-secondary truncate mt-1">{currentSong.artist}</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <button 
                onClick={() => user ? setShowPlaylists(!showPlaylists) : (setFullScreen(false), router.push('/login'))}
                className="p-2 text-text-secondary hover:text-white transition-colors"
              >
                <ListPlus size={28} />
              </button>

              {/* Add to Playlist Dropdown */}
              {showPlaylists && (
                <div className="absolute bottom-full right-0 mb-4 w-56 bg-[#282828] rounded-lg shadow-xl border border-white/5 overflow-hidden z-50 p-2">
                  <div className="text-xs font-bold text-text-secondary mb-2 px-2 pt-2 uppercase tracking-wider">Add to Playlist</div>
                  {playlists.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto">
                      {playlists.map(pl => (
                        <button
                          key={pl._id}
                          onClick={() => { addToPlaylist(pl._id, currentSong); setShowPlaylists(false); }}
                          className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-md truncate transition-colors"
                        >
                          {pl.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-4 text-sm text-text-secondary text-center">
                      No playlists found. Create one in your Library.
                    </div>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={handleLike}
              className="p-2 transition-colors"
            >
              <Heart 
                size={28} 
                className={clsx(currentIsLiked ? "text-love-soft fill-love-soft" : "text-text-secondary hover:text-white")} 
              />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2 mb-6">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[#4d4d4d] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
          />
          <div className="flex justify-between text-xs text-text-secondary font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between max-w-sm w-full mx-auto pb-4">
          <button className="text-text-secondary hover:text-white transition-colors">
            <LayoutList size={24} />
          </button>
          <div className="flex items-center gap-6">
            <button className="text-white hover:text-love-soft transition-colors">
              <SkipBack size={36} className="fill-current" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-16 h-16 flex items-center justify-center bg-love-soft hover:bg-love-accent text-white rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
            </button>
            <button className="text-white hover:text-love-soft transition-colors">
              <SkipForward size={36} className="fill-current" />
            </button>
          </div>
          <button className="text-text-secondary hover:text-white transition-colors">
            <LayoutList size={24} className="opacity-0" /> {/* Spacer */}
          </button>
        </div>

      </div>
    </div>
  );
}