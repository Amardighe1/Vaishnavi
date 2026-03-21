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
  const [greeting, setGreeting] = useState("Good evening");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
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

  const handlePlay = (song: Song, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const heroSong = sections[0]?.songs[0];

  return (
    <div className="flex flex-col min-h-full pb-32 lg:pb-8 relative">
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-love opacity-20 lg:rounded-t-lg pointer-events-none -mt-4 -ml-4 -mr-4" />

      <div className="relative z-10 flex flex-col pt-8 sm:pt-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
          {greeting}, <span className="text-love-soft drop-shadow-md">My Love</span>
        </h1>
        
        {!isLoading && heroSong && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-10">
            <div 
              onClick={() => handlePlay(heroSong)}
              className="group flex items-center bg-white/5 hover:bg-white/20 backdrop-blur-sm transition-all rounded-md overflow-hidden cursor-pointer shadow-black/10 shadow-lg border border-white/5"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 relative overflow-hidden bg-neutral-800">
                  <img src={heroSong.coverUrl} alt="Our Playlist" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="p-4 flex-1 flex justify-between items-center">
                <span className="font-bold sm:text-lg">Our Playlist</span>
                <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-love-accent text-white flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
                  <Play className="fill-current w-5 h-5 sm:w-6 sm:h-6" />
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
            <div key={idx} className="mb-10">
              <h2 className="text-2xl font-bold mb-6 tracking-tight text-white hover:text-love-soft transition-colors cursor-pointer">{section.title}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {section.songs.map((song) => {
                  const isThisPlaying = currentSong?.id === song.id && isPlaying;
                  return (
                    <div 
                      key={song.id}
                      onClick={() => handlePlay(song)}
                      className="bg-white/5 sm:bg-surfaceHover p-3 sm:p-4 rounded-lg cursor-pointer group hover:bg-white/10 transition-all border border-white/5 hover:border-white/10 shadow-lg"
                    >
                      <div className="w-full aspect-square bg-neutral-800 rounded-md mb-4 shadow-lg overflow-hidden relative">
                        <img src={song.coverUrl} alt={song.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <button 
                          onClick={(e) => handlePlay(song, e)}
                          className={`absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-love-accent text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 
                          ${isThisPlaying ? "opacity-100 translate-y-0" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 -translate-y-2 sm:translate-y-4 sm:group-hover:translate-y-0"}`}
                        >
                          {isThisPlaying ? <div className="w-3 h-3 bg-white rounded-sm animate-pulse" /> : <Play className="fill-current ml-1 w-5 h-5 sm:w-6 sm:h-6" />}
                        </button>
                      </div>
                      <h3 className="font-semibold truncate sm:mb-1 text-[14px] sm:text-base" title={song.title}>{song.title}</h3>
                      <p className="text-text-secondary text-[12px] sm:text-sm truncate" title={song.artist}>{song.artist}</p>
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

