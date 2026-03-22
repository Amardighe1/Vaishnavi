import "./globals.css";
import React from "react";
import Sidebar from "@/components/Sidebar";
import BottomPlayer from "@/components/BottomPlayer";
import MobileNav from "@/components/MobileNav";
import DataInitializer from "@/components/DataInitializer";

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
      <body className="flex flex-col h-screen overflow-hidden bg-background">        <DataInitializer />        <div className="flex flex-1 overflow-hidden lg:pt-3 lg:px-3 gap-3 pb-[85px] lg:pb-[110px]">
          <Sidebar />
          <main className="flex-1 bg-surface/40 backdrop-blur-2xl lg:rounded-3xl border border-white/5 overflow-y-auto relative p-4 lg:p-8 mb-safe shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] relative z-0">
            {children}
          </main>
        </div>
        <MobileNav />
        <div className="h-[80px] sm:h-[100px] w-full flex-shrink-0 z-50 fixed bottom-0 left-0 right-0">
          <BottomPlayer />
        </div>
      </body>
    </html>
  );
}

