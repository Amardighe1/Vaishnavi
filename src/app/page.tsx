"use client";
import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { useAudioStore, Song } from "@/store/useAudioStore";

interface Section {
  title: string;
  songs: Song[];
}

export default function Home() {
  const { playSong, currentSong, isPlaying, togglePlay } = useAudioStore();
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState("Welcome back, my love");

  useEffect(() => {
    const hour = new Date().getHours();
    
    // Create a romantic, moody, time-based greeting logic
    if (hour >= 23 || hour < 4) { // 11 PM to 3:59 AM
      setGreeting("Late night vibes, my love");
    } else if (hour >= 4 && hour < 12) { // 4 AM to 11:59 AM
      setGreeting("Good morning, beautiful");
    } else if (hour >= 12 && hour < 17) { // 12 PM to 4:59 PM
      setGreeting("Good afternoon, gorgeous");
    } else if (hour >= 17 && hour < 21) { // 5 PM to 8:59 PM
      setGreeting("Good evening, my love");
    } else { // 9 PM to 10:59 PM
      setGreeting("Sweet dreams are made of our songs");
    }
  }, []);

  // Fetch curated sections from iTunes API
  useEffect(() => {
    const fetchMusic = async () => {
      const queries = [
        { query: "Drake", title: "Drake Essentials", type: "term" },
        { query: "Kanye West", title: "Kanye West Favorites", type: "term" },
        { query: "Kendrick Lamar", title: "Kendrick Lamar Hits", type: "term" },
        { query: "Billie Eilish", title: "Billie Eilish Showcase", type: "term" },
        { query: "Taylor Swift", title: "Taylor Swift", type: "term" },
        // Exact Track IDs for: Kitida Navyane, Ka Kalena, Hrudayat Vaje Something, Kaakan
        { query: "1529451172,1708547699,1529451161,1529546285", title: "Marathi Love Songs", type: "lookup" },
      ];

      try {
        const promises = queries.map(async (q) => {
          const response = await fetch(`/api/explore?query=${encodeURIComponent(q.query)}&type=${q.type}`);
          const data = await response.json();
          return { title: q.title, songs: data.songs || [] };
        });

        const results = await Promise.all(promises);
        setSections(results.filter((sec) => sec.songs.length > 0));
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusic();
  }, []);

  const handlePlay = (song: Song, sectionSongs?: Song[], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, sectionSongs);
    }
  };

  const heroSong = sections[0]?.songs[0];

  return (
    <div className="flex flex-col min-h-full pb-32 lg:pb-8 relative overflow-hidden">
      {/* Absolute Ambient Background Orbs */}
      <div className="absolute top-[-10%] md:top-[-20%] left-[-10%] w-[500px] h-[500px] bg-love-magenta rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-blob pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-love-accent rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animate-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-love-soft rounded-full mix-blend-screen filter blur-[180px] opacity-20 animate-blob animate-delay-4000 pointer-events-none" />
      
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-love opacity-40 lg:rounded-t-lg pointer-events-none -mt-4 -ml-4 -mr-4" />

      <div className="relative z-10 flex flex-col pt-8 sm:pt-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-10 tracking-tight drop-shadow-2xl pb-2 bg-clip-text text-transparent bg-gradient-to-r from-love-soft via-white to-love-soft animate-pulseSlow">
          {greeting} <span className="text-white drop-shadow-[0_0_15px_rgba(255,42,95,0.8)]">❤️</span>
        </h1>
        
        {!isLoading && heroSong && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-14">
            <div 
              onClick={() => handlePlay(heroSong, sections[0]?.songs)}
              className="group flex items-center bg-white/5 hover:bg-white/10 backdrop-blur-xl transition-all duration-500 rounded-xl overflow-hidden cursor-pointer shadow-[0_8px_32px_0_rgba(255,42,95,0.15)] hover:shadow-[0_8px_32px_0_rgba(255,42,95,0.3)] border border-white/10 hover:border-love-soft/50 hover:scale-[1.02]"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 relative overflow-hidden bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroSong.coverUrl} alt="Our Playlist" className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-5 flex-1 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">Our Special Playlist</span>
                  <span className="text-sm text-love-soft/90 mt-0.5 font-medium flex items-center gap-1">For you <span className="text-[10px]">✨</span></span>
                </div>
                <button className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-love-accent to-love-magenta text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,42,95,0.5)] group-hover:shadow-[0_0_30px_rgba(255,42,95,0.8)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 translate-y-0 sm:translate-y-4 sm:group-hover:translate-y-0 hover:scale-110">
                  <Play className="fill-current w-6 h-6 sm:w-7 sm:h-7 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="p-3 sm:p-4 rounded-lg bg-white/5 border border-white/5 animate-pulse">
                <div className="w-full aspect-square bg-white/10 rounded-md mb-4" />
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          sections.map((section, idx) => (
            <div key={idx} className="mb-14 relative z-20">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 tracking-tight text-white/90 hover:text-white transition-colors cursor-pointer drop-shadow-md flex items-center gap-2">
                <span className="w-2 h-7 rounded-full bg-gradient-to-b from-love-soft to-love-magenta mr-2" />
                {section.title}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-7">
                {section.songs.map((song) => {
                  const isThisPlaying = currentSong?.id === song.id && isPlaying;
                  return (
                    <div 
                      key={song.id}
                      onClick={() => handlePlay(song, section.songs)}
                      className="bg-white/5 sm:bg-surfaceHover/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl cursor-pointer group hover:bg-white/10 transition-all duration-500 border border-white/5 hover:border-love-soft/30 hover:shadow-[0_8px_30px_rgba(255,42,95,0.15)] hover:-translate-y-2 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-love-magenta/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="w-full aspect-square bg-neutral-900 rounded-xl mb-5 shadow-2xl overflow-hidden relative border border-white/5 group-hover:border-love-soft/20 transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={song.coverUrl} alt={song.title} className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-500" />
                        
                        <button 
                          onClick={(e) => handlePlay(song, section.songs, e)}
                          className={`absolute bottom-3 right-3 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-love-accent to-love-magenta text-white flex items-center justify-center shadow-[0_4px_20px_rgba(255,42,95,0.6)] group-hover:shadow-[0_4px_30px_rgba(255,42,95,0.8)] backdrop-blur-md transition-all duration-300 hover:scale-110
                          ${isThisPlaying ? "opacity-100 translate-y-0 shadow-[0_0_30px_rgba(255,255,255,0.3)] animate-pulseGlow" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-2 sm:translate-y-8 sm:group-hover:translate-y-0"}`}
                        >
                          {isThisPlaying ? <div className="w-4 h-4 bg-white rounded-sm animate-pulse shadow-[0_0_10px_white]" /> : <Play className="fill-current ml-1 w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" />}
                        </button>
                      </div>
                      <h3 className="font-bold truncate sm:mb-1 text-sm sm:text-[17px] text-white/95 group-hover:text-love-soft transition-colors tracking-tight drop-shadow-sm" title={song.title}>{song.title}</h3>
                      <p className="text-text-secondary text-[12px] sm:text-sm truncate font-medium group-hover:text-white/80 transition-colors" title={song.artist}>{song.artist}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


