"use client";

import { motion } from "framer-motion";
import OrganizedByCard from "./OrganizedByCard";

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

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {["NUVEX Pvt. Ltd.", "NUST Formula Student Team"].map((org) => (
            <span
              key={org}
              className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-5 py-2 font-sans text-xs font-light uppercase tracking-[0.25em] text-slate-200/90"
            >
              {org}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
        className="mt-10 w-full"
      >
        <OrganizedByCard />
      </motion.div>
    </section>
  );
}