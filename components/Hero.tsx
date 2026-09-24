"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);
  const gliderY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 18,
  });

  const onMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const scrollToNext = () => {
    const next = document.getElementById("aero-pakistan");
    next?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative flex h-screen min-h-[620px] w-full items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ scale: contentScale, opacity: contentOpacity }}
        className="relative z-10 flex w-full flex-col items-center"
      >
        <motion.div
          style={{ rotateX, rotateY, y: gliderY }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute top-[6%] right-[4%] hidden w-[min(52vw,720px)] [transform-style:preserve-3d] lg:block"
        >
          <div className="animate-float-slow [transform:translateZ(40px)]">
            <Image
              src="/glider.svg"
              alt="ALTAIR glider"
              width={900}
              height={620}
              unoptimized
              draggable={false}
              className="w-full select-none drop-shadow-[0_0_60px_rgba(0,240,255,0.18)]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="px-6 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-accent-cyan/50 sm:w-16" />
            <p className="text-[11px] font-light uppercase tracking-widest2 text-accent-cyan/80 sm:text-xs">
              Team Altair · AeroPakistan 2027
            </p>
            <span className="h-px w-10 bg-accent-cyan/50 sm:w-16" />
          </div>

          <motion.h1
            initial={{ letterSpacing: "0.6em", opacity: 0 }}
            animate={{ letterSpacing: "0.2em", opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="font-display text-[clamp(4rem,16vw,13rem)] font-light leading-none text-platinum [text-shadow:0_0_80px_rgba(0,240,255,0.25)] sm:tracking-[0.2em]"
          >
            ALTAIR
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="mt-6 text-xs font-light uppercase tracking-widest2 text-slate-300/80 sm:text-sm"
          >
            Engineering the future of flight
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4 }}
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

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-space-deep to-transparent" />
    </section>
  );
}