"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

type TeamMember = {
  name: string;
  role: string;
  institution: string;
  quote: string;
  image: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Huriya Irfan",
    role: "Captain",
    institution: "NEDUET",
    quote: "Changed the track. Kept the vibe.",
    image: "/team/huriya.png",
  },
  {
    name: "Shamikh Khilji",
    role: "Aerodynamics",
    institution: "NEDUET",
    quote: "Nah, I'd win",
    image: "/team/shamikh.png",
  },
  {
    name: "Musaab Junaid",
    role: "CAD",
    institution: "NEDUET",
    quote: "No somersaults intended, I guess..",
    image: "/team/musaab.png",
  },
  {
    name: "Yamaan Ali",
    role: "Structures and Manufacturing",
    institution: "CUST",
    quote: "Baggin that highest engineering score fs",
    image: "/team/yamaan.png",
  },
  {
    name: "Hamna Maryam",
    role: "Project Manager",
    institution: "NEDUET",
    quote: "Stand back, we got this",
    image: "/team/humna.png",
  },
  {
    name: "Syeda Shanza Fatima",
    role: "CAD",
    institution: "NEDUET",
    quote: "See you with a goated glider on my side",
    image: "/team/shanza.png",
  },
];

export default function MeetTheTeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const prevMember = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? TEAM_MEMBERS.length - 1 : prev - 1));
  };

  const nextMember = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === TEAM_MEMBERS.length - 1 ? 0 : prev + 1));
  };

  const goToMember = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -40 || info.velocity.x < -300) {
      nextMember();
    } else if (info.offset.x > 40 || info.velocity.x > 300) {
      prevMember();
    }
  };

  const current = TEAM_MEMBERS[currentIndex];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <section id="meet-the-team" className="relative z-10 mx-auto w-full max-w-5xl px-6 py-28 sm:py-36">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-center mb-12 sm:mb-16"
      >
        <p className="eyebrow mb-6">03 — The People</p>
        <h2 className="section-heading">MEET THE TEAM</h2>
      </motion.div>

      {/* Swipeable Carousel Card */}
      <div className="relative mx-auto max-w-4xl">
        <div className="relative min-h-[460px] sm:min-h-[400px] overflow-hidden rounded-3xl border border-[#446391]/35 bg-[#071834]/85 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-md">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12 cursor-grab active:cursor-grabbing select-none"
            >
              {/* Text Side */}
              <div className="flex-1 text-left w-full">
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-white tracking-[0.2em] font-normal uppercase mb-4">
                  {current.name}
                </p>

                <blockquote className="font-display italic text-lg sm:text-2xl text-slate-200 tracking-wide mb-8 leading-snug">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                <div className="space-y-2.5 font-mono text-xs sm:text-sm tracking-widest pt-4 border-t border-[#446391]/30">
                  <div className="flex items-center gap-2">
                    <span className="text-[#7DA7D9] uppercase font-normal">Role:</span>
                    <span className="text-white">{current.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#7DA7D9] uppercase font-normal">Institution:</span>
                    <span className="text-white">{current.institution}</span>
                  </div>
                </div>
              </div>

              {/* Photo Side - Rounded rectangle matching mockup */}
              <div className="relative h-60 w-52 sm:h-72 sm:w-60 md:h-80 md:w-68 shrink-0 overflow-hidden rounded-2xl border border-[#446391]/40 bg-[#071834]/90 shadow-lg">
                <Image
                  src={current.image}
                  alt={`${current.name} — ${current.role}`}
                  fill
                  sizes="(min-width: 768px) 300px, 240px"
                  priority
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071834]/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-[#7DA7D9] bg-[#071834]/80 px-2 py-0.5 rounded-full border border-[#446391]/30">
                  {current.institution}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation Controls matching Mockup Page 4 */}
        <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
          {/* Left Arrow Button (min 44x44px touch target) */}
          <button
            onClick={prevMember}
            aria-label="Previous team member"
            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#446391]/40 bg-[#071834]/80 text-white transition-all hover:border-[#7DA7D9] hover:bg-[#7DA7D9]/20 hover:text-[#7DA7D9] active:scale-95 shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Pagination Capsule with 6 Dots (1 dot per member) */}
          <div className="flex items-center gap-2.5 rounded-full border border-[#446391]/40 bg-[#071834]/80 px-5 py-3 shadow-md backdrop-blur-md">
            {TEAM_MEMBERS.map((member, i) => (
              <button
                key={member.name}
                onClick={() => goToMember(i)}
                aria-label={`Go to slide ${i + 1}: ${member.name}`}
                className={`transition-all ${
                  i === currentIndex
                    ? "h-2.5 w-6 rounded-full bg-[#7DA7D9]"
                    : "h-2.5 w-2.5 rounded-full bg-slate-500/60 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          {/* Right Arrow Button (min 44x44px touch target) */}
          <button
            onClick={nextMember}
            aria-label="Next team member"
            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#446391]/40 bg-[#071834]/80 text-white transition-all hover:border-[#7DA7D9] hover:bg-[#7DA7D9]/20 hover:text-[#7DA7D9] active:scale-95 shadow-md"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
