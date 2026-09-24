"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToNext = () => {
    const next = document.getElementById("aero-pakistan");
    next?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      className="relative flex h-screen min-h-[620px] w-full items-center justify-center overflow-hidden px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-space-deep/60 via-transparent to-space-deep/60" />

      <motion.div
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 max-w-5xl text-center"
      >
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-accent-cyan/50 sm:w-16" />
          <p className="font-display text-xl font-light tracking-widest2 text-platinum sm:text-2xl">
            ALTAIR
          </p>
          <span className="h-px w-10 bg-accent-cyan/50 sm:w-16" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mb-6 text-[11px] font-light uppercase tracking-widest2 text-accent-cyan/80 sm:text-xs"
        >
          AeroPakistan 2027 · NEDUET × CUST
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.35, ease: "easeOut" }}
          className="font-display text-[clamp(2.4rem,6.5vw,5.5rem)] font-light leading-[1.08] text-platinum [text-shadow:0_0_80px_rgba(0,240,255,0.2)]"
        >
          TAKING FLIGHT WAS NEVER THE{" "}
          <span className="italic text-accent-cyan/90">DIFFICULT</span> PART
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="mx-auto mt-8 max-w-xl text-sm font-light tracking-wider text-slate-300/85 sm:text-base"
        >
          From particle dust to powered flight — scroll to watch ALTAIR
          reconfigure itself through the air.
        </motion.p>
      </motion.div>

      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-slate-300/80 transition-colors hover:text-accent-cyan"
      >
        <span className="text-[11px] font-light uppercase tracking-widest2">
          click to continue
        </span>
        <motion.span
          animate={{ y: [0, 8, 0], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.button>
    </section>
  );
}