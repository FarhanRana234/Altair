"use client";

import { motion } from "framer-motion";

export default function AeroPakistanIntro() {
  return (
    <section
      id="aero-pakistan"
      className="relative z-10 mx-auto w-full max-w-5xl px-6 py-28 sm:py-36"
    >
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        <p className="eyebrow mb-6">01 — The Arena</p>
        <h2 className="section-heading mb-10 text-center">
          WHAT IS AERO PAKISTAN?
        </h2>
        <div className="glass-card p-8 sm:p-12 lg:p-14 text-center max-w-4xl border border-[#446391]/30 bg-[#071834]/80">
          <p className="section-body text-base sm:text-lg leading-relaxed text-slate-200">
            Aero Pakistan is a national-level STEM and education competition
            where student teams design, build, and race scaled-down gliders, and
            showcase their work through portfolios, presentations, and marketing.
            Jointly developed by NUVEX Pvt. Ltd. The initiative aims to build
            Pakistan&apos;s STEM ecosystem by promoting engineering, teamwork,
            innovation, and entrepreneurship among students aged approximately
            15&ndash;19.
          </p>
        </div>
      </motion.div>
    </section>
  );
}