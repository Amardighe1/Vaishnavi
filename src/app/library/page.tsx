"use client";

import { Heart, Library, Plus } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export default function LibraryPage() {
  const { likedSongs, user, playlists, createPlaylist } = useUserStore();

  const handleCreatePlaylist = async () => {
    if (!user) return;
    const name = prompt("Enter playlist name:");
    if (name) {
      await createPlaylist(name);
    }
  };

  return (
    <div className="flex flex-col min-h-full px-6 py-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
        {user && (
          <button 
            onClick={handleCreatePlaylist}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-semibold transition-colors"
          >
            <Plus size={20} />
            Create Playlist
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        
        {/* Liked Songs Playlist Card */}
        <Link
          href="/liked"
          className="bg-surface p-4 rounded-xl hover:bg-surfaceHover transition-all group flex flex-col cursor-pointer isolation-auto shrink-0"
        >
          <div className="w-full aspect-square bg-gradient-to-br from-love-magenta to-love-accent rounded-lg flex flex-col justify-end p-4 shadow-lg mb-4 relative overflow-hidden">
            <Heart className="w-12 h-12 text-white fill-white absolute -bottom-2 -right-2 opacity-50 blur-sm" />
            <div className="relative z-10">
              <span className="text-white font-bold text-lg md:text-2xl group-hover:drop-shadow-md pb-2 block">
                Liked Songs
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-base truncate mb-1">Liked Songs</h3>
            <p className="text-sm text-text-secondary truncate">
              {user ? `${likedSongs.length} songs` : "Playlist • Auto"}
            </p>
          </div>
        </Link>

        {/* User Playlists */}
        {user && playlists.map((pl) => (
          <div
            key={pl._id}
            className="bg-surface p-4 rounded-xl hover:bg-surfaceHover transition-all group flex flex-col cursor-pointer shrink-0"
          >
            <div className="w-full aspect-square bg-[#282828] rounded-lg flex items-center justify-center p-4 shadow-lg mb-4 relative overflow-hidden group-hover:shadow-2xl transition-shadow">
              {pl.coverUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={pl.coverUrl} alt={pl.name} className="w-full h-full object-cover rounded-md" />
              ) : (
                <Library className="w-16 h-16 text-text-secondary opacity-30 group-hover:opacity-50 transition-opacity" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-white text-base truncate mb-1">{pl.name}</h3>
              <p className="text-sm text-text-secondary truncate">
                Playlist • {pl.songs?.length || 0} songs
              </p>
            </div>
          </div>
        ))}
      </div>

      {!user && (
        <div className="mt-12 bg-surface p-6 rounded-xl text-center flex flex-col items-center max-w-md mx-auto">
          <Library className="w-12 h-12 text-text-secondary mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Build your library</h2>
          <p className="text-sm text-text-secondary mb-6">
            Log in to create playlists and save songs to your library.
          </p>
          <Link href="/login" className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
            Log in
          </Link>
        </div>
      )}
    </div>
  );
}
