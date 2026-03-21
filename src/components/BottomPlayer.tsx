"use client";
import React, { useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Maximize2 } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";
import { useUserStore } from "@/store/useUserStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import FullScreenPlayer from "./FullScreenPlayer";

export default function BottomPlayer() {
  const { currentSong, isPlaying, volume, togglePlay, setProgress, currentTime, duration, setFullScreen, isFullScreen } = useAudioStore();
  const { isLiked, toggleLike, user } = useUserStore();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const liked = currentSong ? isLiked(currentSong.id) : false;

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => console.error("Autoplay prevented"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime, audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <FullScreenPlayer />
      
      {/* ALWAYS RENDER AUDIO SO IT DOESN'T STOP WHEN FULL SCREEN TOGGLES */}
      {currentSong && <audio ref={audioRef} src={currentSong.audioUrl} onTimeUpdate={handleTimeUpdate} onEnded={togglePlay} id="audio-player" />}
      
      {/* Hide bottom player when full screen mode is active */}
      {!isFullScreen && (
        <div className="bg-[#181818]/95 backdrop-blur-xl border-t border-[#282828] h-[70px] sm:h-[90px] w-full px-2 sm:px-4 flex items-center justify-between z-40 relative">
          
          {/* Left side: Track Info - Click to expand */}
          <div className="w-[30%] min-w-[180px] hidden sm:flex items-center gap-4">
            {currentSong ? (
              <>
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setFullScreen(true)}
                >
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={currentSong.coverUrl} className="w-14 h-14 rounded shadow-lg object-cover group-hover:opacity-80 transition-opacity" alt="Cover" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded">
                      <Maximize2 size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-white text-[14px] hover:underline cursor-pointer truncate font-medium">{currentSong.title}</span>
                    <span className="text-text-secondary text-[12px] hover:underline cursor-pointer truncate">{currentSong.artist}</span>
                  </div>
                </div>
                
                <motion.button 
                  onClick={() => { if (!user) router.push("/login"); else currentSong && toggleLike(currentSong); }}
                  className="ml-4 flex-shrink-0 focus:outline-none"
                  whileTap={{ scale: 0.8 }}
                >
                  <Heart 
                    size={20} 
                    className={`transition-colors duration-300 ${liked ? "text-love-accent fill-love-accent" : "text-text-secondary hover:text-white"}`} 
                  />
                </motion.button>
              </>
            ) : (
              <div className="text-text-secondary text-xs italic">Play a song...</div>
            )}
          </div>

          {/* Middle: Controls */}
          <div className="flex-1 max-w-[722px] flex flex-col items-center justify-center gap-2">
            
            {/* Mobile View Track Info & Play Button */}
            <div className="w-full flex sm:hidden items-center justify-between mb-1 px-4 cursor-pointer" onClick={() => { if(currentSong) setFullScreen(true) }}>
              <div className="flex items-center gap-3 w-[70%] overflow-hidden mr-2">
                 {currentSong && (
                   /* eslint-disable-next-line @next/next/no-img-element */
                   <img src={currentSong.coverUrl} className="w-10 h-10 rounded shadow-lg object-cover flex-shrink-0" alt="Cover" />
                 )}
                 <div className="flex flex-col truncate">
                   <span className="text-white text-[14px] truncate pb-[2px]">{currentSong?.title || 'No song playing'}</span>
                   {currentSong && <span className="text-text-secondary text-[12px] truncate">{currentSong.artist}</span>}
                 </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  disabled={!currentSong}
                  className={`w-9 h-9 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-transform ${!currentSong && "opacity-50 cursor-not-allowed"}`}
                >
                  {isPlaying ? <Pause className="fill-current stroke-0" size={18} /> : <Play className="fill-current stroke-0 ml-1" size={18} />}
                </button>
              </div>
            </div>

            {/* Desktop Playback Controls */}
            <div className="hidden sm:flex items-center gap-6">
              <SkipBack className="text-text-secondary hover:text-white cursor-pointer fill-current" size={20} />
              
              <button 
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                disabled={!currentSong}
                className={`w-8 h-8 rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-transform ${!currentSong && "opacity-50 cursor-not-allowed"}`}
              >
                {isPlaying ? <Pause className="fill-current stroke-0" size={18} /> : <Play className="fill-current stroke-0 ml-1" size={18} />}
              </button>
              
              <SkipForward className="text-text-secondary hover:text-white cursor-pointer fill-current" size={20} />
            </div>
            
            {/* Progress bar Desktop */}
            <div className="w-full hidden sm:flex items-center gap-2 text-[11px] text-text-secondary">
              <span>{formatTime(currentTime)}</span>
              <div className="group relative w-full h-1 bg-surfaceHover rounded-full cursor-pointer overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-white group-hover:bg-love-accent transition-colors"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
                <input 
                  type="range" 
                  min={0} 
                  max={duration || 100} 
                  value={currentTime} 
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  disabled={!currentSong}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right side: Volume */}
          <div className="w-[30%] min-w-[180px] hidden sm:flex items-center justify-end gap-3">
            <Volume2 className="text-text-secondary hover:text-white cursor-pointer" size={20} />
            <div className="group relative w-24 h-1 bg-surfaceHover rounded-full cursor-pointer overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-white group-hover:bg-love-accent transition-colors"
                  style={{ width: `${volume * 100}%` }}
                />
                <input 
                  type="range" 
                  min={0} 
                  max={1} 
                  step={0.01}
                  value={volume} 
                  onChange={(e) => useAudioStore.getState().setVolume(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
            </div>
          </div>

          {/* Mobile Mini Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-black sm:hidden">
            <div 
              className="h-full bg-love-accent" 
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} 
            />
          </div>
        </div>
      )}
    </>
  );
}