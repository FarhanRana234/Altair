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
      <div className="pointer-events-none absolute inset-0 z-[8] bg-gradient-to-b from-space-deep/60 via-transparent to-space-deep/60" />

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
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mb-6 text-[11px] font-light uppercase tracking-widest2 text-accent-cyan/80 sm:text-xs"
        >
          Team Altair · AeroPakistan 2027
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.35, ease: "easeOut" }}
          className="font-display text-5xl font-thin leading-none tracking-[0.04em] text-platinum sm:text-7xl md:text-8xl [text-shadow:0_0_90px_rgba(0,240,255,0.18)]"
        >
          ALTAIR
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="mx-auto mt-8 max-w-xl font-display text-xl font-light tracking-widest text-slate-300/90 sm:text-2xl"
        >
          Engineering the future of flight
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