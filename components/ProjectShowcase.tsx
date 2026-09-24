"use client";

import { motion } from "framer-motion";

export default function ProjectShowcase() {
  return (
    <section
      id="project"
      className="relative z-10 mx-auto flex min-h-[120vh] w-full max-w-5xl flex-col items-center justify-center px-6 py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full text-center sm:text-right"
      >
        <p className="eyebrow mb-6">02 — PROJECT ALTAIR</p>
        <h2 className="section-heading mb-6">
          WHAT IF WE COULD FLY{" "}
          <span className="italic text-accent-cyan/90">FURTHER</span>?
        </h2>
        <p className="mt-3 font-display text-2xl font-light tracking-widest text-accent-cyan/90">
          Project Altair — Engineering the future of flight
        </p>
        <p className="section-body mt-8 max-w-2xl text-center sm:ml-auto sm:text-right">
          We&apos;re a team building the next-generation glider from the ground
          up. From aerodynamics and advanced materials to hands-on testing and
          innovation, ALTAIR is designed to soar higher.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-end">
          {["Aerodynamics", "Advanced Materials", "Hands-on Testing", "Innovation"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-full border border-accent-cyan/25 bg-accent-cyan/5 px-4 py-1.5 font-sans text-xs font-light uppercase tracking-widest text-slate-200/90"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </motion.div>
    </section>
  );
}