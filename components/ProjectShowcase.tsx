"use client";

import { motion } from "framer-motion";
import Glider3DViewer from "./Glider3DViewer";

export default function ProjectShowcase() {
  return (
    <section
      id="project"
      className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32"
    >
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="glass-card overflow-hidden"
        >
          <div className="relative h-[320px] w-full sm:h-[420px]">
            <Glider3DViewer />
          </div>
          <div className="flex items-center justify-between border-t border-accent-blue/20 px-6 py-4">
            <span className="font-sans text-[11px] font-light uppercase tracking-widest text-slate-400">
              Interactive 3D Viewer
            </span>
            <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-widest text-accent-cyan">
              First prototype
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
          className="text-left"
        >
          <p className="eyebrow mb-6">03 — The Machine</p>
          <h2 className="section-heading text-left">Project Altair</h2>
          <p className="mt-3 font-display text-2xl font-light tracking-widest text-accent-cyan/90">
            Engineering the future of flight
          </p>
          <p className="section-body mt-8">
            We&apos;re a team building the next-generation glider from the ground
            up. From aerodynamics and advanced materials to hands-on testing and
            innovation, ALTAIR is designed to soar higher.
          </p>
        </motion.div>
      </div>
    </section>
  );
}