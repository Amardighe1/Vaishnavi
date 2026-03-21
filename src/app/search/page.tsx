"use client";

import React, { useState, useEffect } from "react";
import { Search as SearchIcon, Play } from "lucide-react";
import { useAudioStore, Song } from "@/store/useAudioStore";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { playSong, currentSong, isPlaying, togglePlay } = useAudioStore();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch(query);
      } else {
        setResults([]);
        setIsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=24`);
      const data = await res.json();
      const fetchedSongs = data.results
        .filter((track: any) => track.previewUrl)
        .map((track: any) => ({
          id: track.trackId.toString(),
          title: track.trackName,
          artist: track.artistName,
          coverUrl: track.artworkUrl100.replace("100x100bb", "600x600bb"),
          audioUrl: track.previewUrl,
        }));
      setResults(fetchedSongs);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (song: Song, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-32 lg:pb-8 relative p-4 sm:p-6 lg:pt-8">
      <div className="relative mb-8 max-w-xl w-full sticky top-0 z-20 pt-4 pb-4 bg-surface">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          value={query} 
          onChange={(e) => { setQuery(e.target.value); setIsLoading(true); }}
          placeholder="What do you want to listen to?" 
          className="w-full bg-white/10 border border-white/20 shadow-inner rounded-full py-3 sm:py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all text-sm sm:text-base" 
        />
      </div>

      {isLoading && (
         <div className="w-12 h-12 border-4 border-love-accent border-t-transparent rounded-full animate-spin mx-auto mt-10"></div>
      )}

      {!isLoading && results.length === 0 && query.length > 0 && (
        <div className="text-center text-text-secondary mt-10">No results found for &quot;{query}&quot;</div>
      )}

      {!isLoading && results.length === 0 && query.length === 0 && (
        <div className="text-center text-text-secondary mt-10 flex flex-col items-center">
           <SearchIcon size={48} className="mb-4 text-white/20" />
           <p className="text-lg font-medium text-white mb-2">Play what you love</p>
           <p className="text-sm text-text-secondary">Search for artists, songs, or playlists.</p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {results.map((song) => {
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
                    className={`absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-love-accent text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 ${isThisPlaying ? "opacity-100 translate-y-0" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 -translate-y-2 sm:translate-y-4 sm:group-hover:translate-y-0"}`}
                  >
                    {isThisPlaying ? <div className="w-3 h-3 bg-white rounded-sm animate-pulse" /> : <Play className="fill-current ml-1 w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                </div>
                <h3 className="font-semibold truncate sm:mb-1 text-sm sm:text-base" title={song.title}>{song.title}</h3>
                <p className="text-text-secondary text-xs sm:text-sm truncate" title={song.artist}>{song.artist}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
