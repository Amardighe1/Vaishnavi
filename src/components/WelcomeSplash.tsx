"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export default function WelcomeSplash() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Keep it on screen just long enough to feel the animation
    const timer = setTimeout(() => {
      setShow(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0A0306] overflow-hidden"
        >
          {/* Animated Background Ambient Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-love-magenta/30 rounded-full blur-[100px] pointer-events-none" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-love-accent/30 rounded-full blur-[120px] pointer-events-none" 
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center justify-center w-full px-4"
          >
            {/* Glowing Beating Heart SVG (Replaces the broken text emoji) */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="relative flex items-center justify-center mb-8"
            >
              <div className="absolute bg-love-accent blur-[60px] w-32 h-32 rounded-full opacity-60" />
              <Heart className="w-24 h-24 sm:w-32 sm:h-32 text-love-accent fill-love-accent relative z-10 drop-shadow-[0_0_25px_rgba(255,42,95,0.8)]" />
            </motion.div>

            {/* Elegant Typography Presentation */}
            <div className="flex flex-col items-center overflow-hidden text-center">
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                className="text-love-soft/70 tracking-[0.4em] text-xs sm:text-sm font-medium uppercase mb-4 drop-shadow-md"
              >
                Curated With Love
              </motion.p>
              
              <motion.div
                 initial={{ y: 30, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
                 className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
              >
                <span className="text-3xl sm:text-5xl font-light text-white/90 tracking-wider">Specially For</span>
                <span className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-love-soft via-white to-love-soft drop-shadow-[0_0_15px_rgba(255,42,95,0.5)] pb-2">
                  You
                </span>
              </motion.div>
            </div>

            {/* Subtle animated loading line */}
            <motion.div 
               initial={{ width: 0, opacity: 0 }}
               animate={{ width: "250px", opacity: 1 }}
               transition={{ delay: 1.4, duration: 1.8, ease: "easeInOut" }}
               className="h-[1px] bg-gradient-to-r from-transparent via-love-accent to-transparent mt-12 opacity-80"
            />

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
