"use client";

import Link from "next/link";
import { Home, Search, Library, User, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import clsx from "clsx";

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useUserStore();

  return (
    <div className="lg:hidden fixed bottom-[90px] w-full bg-[#121212]/90 backdrop-blur-md border-t border-t-[#282828] z-40 px-6 py-2 pb-safe flex justify-between items-center text-text-secondary">
      <Link 
        href="/" 
        className={clsx(
          "flex flex-col items-center gap-1 transition-colors flex-1",
          pathname === "/" ? "text-love-soft" : "text-text-secondary hover:text-white"
        )}
      >
        <Home className={clsx("w-6 h-6 stroke-2", pathname === "/" && "fill-love-soft/20")} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      <Link 
        href="/search" 
        className={clsx(
          "flex flex-col items-center gap-1 transition-colors flex-1",
          pathname === "/search" ? "text-love-soft" : "text-text-secondary hover:text-white"
        )}
      >
        <Search className={clsx("w-6 h-6 stroke-2", pathname === "/search" && "stroke-[3px]")} />
        <span className="text-[10px] font-medium">Search</span>
      </Link>
      
      <Link 
        href="/library" 
        className={clsx(
          "flex flex-col items-center gap-1 transition-colors flex-1",
          pathname === "/library" ? "text-love-soft" : "text-text-secondary hover:text-white"
        )}
      >
        <Library className={clsx("w-6 h-6 stroke-2", pathname === "/library" && "fill-love-soft/20")} />
        <span className="text-[10px] font-medium">Library</span>
      </Link>

      <Link 
        href="/liked" 
        className={clsx(
          "flex flex-col items-center gap-1 transition-colors flex-1",
          pathname === "/liked" ? "text-love-soft" : "text-text-secondary hover:text-white"
        )}
      >
        <Heart className={clsx("w-6 h-6 stroke-2", pathname === "/liked" && "fill-love-soft/20")} />
        <span className="text-[10px] font-medium">Liked</span>
      </Link>

      <Link 
        href={user ? "/profile" : "/login"} 
        className={clsx(
          "flex flex-col items-center gap-1 transition-colors cursor-pointer flex-1",
          (user && pathname === "/profile") || (!user && pathname === "/login") ? "text-love-soft" : "text-text-secondary hover:text-white"
        )}
      >
        <User className={clsx("w-6 h-6 stroke-2", ((user && pathname === "/profile") || (!user && pathname === "/login")) && "fill-love-soft/20")} />
        <span className="text-[10px] font-medium">{user ? "Profile" : "Log in"}</span>
      </Link>
    </div>
  );
}

