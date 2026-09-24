"use client";

import { motion } from "framer-motion";
import Glider3DViewer from "./Glider3DViewer";

export default function ProjectShowcase() {
  return (
    <section
      id="project"
      className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="mb-14 text-center sm:text-right"
      >
        <p className="eyebrow mb-6">03 — The Machine</p>
        <h2 className="section-heading">Project Altair</h2>
        <p className="mt-3 font-display text-2xl font-light tracking-widest text-accent-cyan/90">
          Engineering the future of flight
        </p>
      </motion.div>

      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="order-2 lg:order-1"
        >
          <Glider3DViewer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="order-1 lg:order-2"
        >
          <div className="glass-card p-8 sm:p-12">
            <p className="section-body">
              We&apos;re a team building the next-generation glider from the
              ground up. From aerodynamics and advanced materials to hands-on
              testing and innovation, ALTAIR is designed to soar higher.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Aerodynamics",
                "Advanced Materials",
                "Hands-on Testing",
                "Innovation",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-accent-cyan/25 bg-accent-cyan/5 px-4 py-1.5 font-sans text-xs font-light uppercase tracking-widest text-slate-200/90"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}