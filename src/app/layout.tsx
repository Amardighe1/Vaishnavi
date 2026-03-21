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
      <body className="flex flex-col h-screen overflow-hidden bg-background">        <DataInitializer />        <div className="flex flex-1 overflow-hidden lg:pt-2 lg:px-2 gap-2 pb-[90px] lg:pb-[98px]">
          <Sidebar />
          <main className="flex-1 bg-surface lg:rounded-lg overflow-y-auto relative p-4 mb-safe relative z-0">
            {children}
          </main>
        </div>
        <MobileNav />
        <div className="h-[90px] w-full flex-shrink-0 z-50 fixed bottom-0 left-0 right-0">
          <BottomPlayer />
        </div>
      </body>
    </html>
  );
}