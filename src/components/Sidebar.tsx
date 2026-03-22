"use client";

import React from "react";
import { Home, Search, Library, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import clsx from "clsx";

export default function Sidebar() {
  const pathname = usePathname();
  const { likedSongs, user, logout } = useUserStore();

  return (
    <aside className="w-64 max-lg:hidden flex flex-col gap-3 relative z-40 shadow-2xl pl-2 pt-2 pb-[120px]">
      <nav className="bg-surface/60 backdrop-blur-2xl border border-white/5 rounded-2xl p-6 flex flex-col gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <Link
          href="/" 
          className={clsx(
            "flex gap-4 items-center transition-colors group",
            pathname === "/" ? "text-love-soft" : "text-text-secondary hover:text-white"
          )}
        >
          <Home className={clsx("w-6 h-6 stroke-2 group-hover:scale-105 transition-transform", pathname === "/" && "fill-love-soft/20")} />
          <span className="font-semibold text-[15px]">Home</span>
        </Link>
        <Link 
          href="/search" 
          className={clsx(
            "flex gap-4 items-center transition-colors group",
            pathname === "/search" ? "text-love-soft" : "text-text-secondary hover:text-white"
          )}
        >
          <Search className={clsx("w-6 h-6 stroke-2 group-hover:scale-105 transition-transform", pathname === "/search" && "stroke-[3px]")} />
          <span className="font-semibold text-[15px]">Search</span>
        </Link>
      </nav>

      <div className="bg-surface/60 backdrop-blur-2xl border border-white/5 rounded-2xl flex-1 overflow-y-auto p-4 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <Link 
          href="/library"
          className={clsx(
            "flex gap-4 items-center px-2 mb-6 cursor-pointer transition-colors",
            pathname === "/library" ? "text-love-soft" : "text-text-secondary hover:text-white"
          )}
        >
          <Library className={clsx("w-6 h-6 stroke-2", pathname === "/library" && "fill-love-soft/20")} />
          <span className="font-semibold text-[15px]">Your Library</span>
        </Link>

        {/* Playlists */}
        <Link 
          href="/liked"
          className={clsx(
            "flex gap-3 px-2 py-3 rounded-md cursor-pointer transition-colors group",
            pathname === "/liked" ? "bg-surfaceHover" : "hover:bg-surfaceHover"
          )}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-love-magenta to-love-accent flex items-center justify-center rounded-sm flex-shrink-0 shadow-md">
            <Heart className="text-white fill-current" size={20} />
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <span className={clsx(
              "font-medium truncate",
              pathname === "/liked" ? "text-love-soft font-semibold" : "text-white"
            )}>Liked Songs</span>
            <span className="text-xs text-text-secondary truncate">Playlist • {likedSongs.length} songs</span>
          </div>
        </Link>
      </div>

      <div className="bg-surface rounded-lg p-4 mt-auto">
        {user ? (
          <Link
            href="/profile"
            className="flex items-center gap-3 p-2 rounded-md hover:bg-surfaceHover transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-love-soft to-love-accent flex items-center justify-center flex-shrink-0 overflow-hidden text-black font-bold">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                (user.name || user.email).charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex flex-col overflow-hidden w-full">
              <span className="text-sm font-semibold text-white truncate group-hover:text-love-soft transition-colors">
                {user.name && user.name.trim() !== "" ? user.name : "Your Profile"}
              </span>
              <span className="text-[11px] text-text-secondary truncate">
                {user.email}
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex flex-col gap-3 text-center w-full">
            <p className="text-xs text-text-secondary mb-1">Sign in to save your favorite songs.</p>
            <Link 
              href="/login" 
              className="w-full text-sm font-bold bg-white text-black py-2.5 rounded-full hover:scale-105 transition-transform inline-block"
            >
              Log in
            </Link>
            <Link 
              href="/login?mode=signup" 
              className="w-full text-sm font-bold bg-transparent border-[1.5px] border-text-secondary text-white py-2.5 rounded-full hover:border-white hover:text-white transition-colors inline-block"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

