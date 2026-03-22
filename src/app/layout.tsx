import "./globals.css";
import React from "react";
import Sidebar from "@/components/Sidebar";
import BottomPlayer from "@/components/BottomPlayer";
import MobileNav from "@/components/MobileNav";
import DataInitializer from "@/components/DataInitializer";
import WelcomeSplash from "@/components/WelcomeSplash";

export const metadata = {
  title: "Songs for You",
  description: "A specially curated music experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-[100dvh] overflow-hidden bg-background">       <WelcomeSplash />        <DataInitializer />        <div className="flex flex-1 overflow-hidden lg:pt-3 lg:px-3 gap-3 pb-0">
          <Sidebar />
          <main className="flex-1 bg-surface/40 backdrop-blur-2xl lg:rounded-3xl border border-white/5 overflow-y-auto overflow-x-hidden relative p-4 lg:p-8 pb-[160px] md:pb-[140px] lg:pb-[120px] mb-safe shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] z-0">
            {children}
          </main>
        </div>
        <div className="w-full flex-shrink-0 z-[60] fixed bottom-0 left-0 right-0 flex flex-col items-stretch pb-safe bg-[#0A0306]/40 backdrop-blur-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">`n
          <BottomPlayer />
          <MobileNav />
        </div>
      </body>
    </html>
  );
}












