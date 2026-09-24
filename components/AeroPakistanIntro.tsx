"use client";

import { motion } from "framer-motion";

export default function AeroPakistanIntro() {
  return (
    <section
      id="aero-pakistan"
      className="relative z-10 mx-auto w-full max-w-5xl px-6 py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="glass-card p-8 sm:p-12 lg:p-16"
      >
        <p className="eyebrow mb-6">01 — The Arena</p>
        <h2 className="section-heading mb-10">WHAT IS AERO PAKISTAN?</h2>
        <p className="section-body max-w-4xl">
          Aero Pakistan is a national-level STEM and education competition where
          student teams design, build, and race scaled-down gliders, and
          showcase their work through portfolios, presentations, and marketing.
          Jointly developed by NUVEX Pvt. Ltd. and the NUST Formula Student
          Team (NFST), the initiative aims to build Pakistan&apos;s STEM
          ecosystem by promoting engineering, teamwork, innovation, and
          entrepreneurship among students aged approximately 15&ndash;19.
        </p>
      </motion.div>
    </section>
  );
}