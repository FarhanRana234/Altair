"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  const scrollToNext = () => {
    const next = document.getElementById("aero-pakistan");
    next?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden px-6"
    >
      <div className="pointer-events-none absolute inset-0 z-[8] bg-gradient-to-b from-[#071834]/60 via-transparent to-[#071834]/80" />

      <motion.div
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ scale: contentScale, opacity: contentOpacity }}
        className="relative z-10 max-w-6xl text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.25 }}
          className="mb-5 font-mono text-[11px] font-normal uppercase tracking-[0.32em] text-[#7DA7D9] sm:text-xs"
        >
          AeroPakistan 2027
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.35, ease: "easeOut" }}
          className="font-display text-[clamp(3.5rem,14vw,9.5rem)] font-normal leading-none tracking-[0.28em] text-white [text-shadow:0_0_80px_rgba(125,167,217,0.25)] select-none pl-[0.28em]"
        >
          ALTAIR
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mx-auto mt-6 max-w-xl font-display text-xl font-normal tracking-[0.22em] text-slate-200/90 sm:text-2xl"
        >
          wingspans beyond the stars.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mt-3 font-mono text-xs font-normal tracking-[0.2em] text-[#6484B5] uppercase"
        >
          Engineering the future of flight
        </motion.p>
      </motion.div>

      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-slate-300 transition-colors hover:text-[#7DA7D9]"
        aria-label="Scroll down to content"
      >
        <span className="font-display text-sm sm:text-base font-normal tracking-[0.25em] text-slate-300 hover:text-[#7DA7D9] transition-colors">
          click to continue
        </span>
        <motion.span
          animate={{ y: [0, 8, 0], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-[#7DA7D9]" />
        </motion.span>
      </motion.button>
    </section>
  );
}