"use client";

import { motion } from "framer-motion";
import { Plane, Ruler, Beaker, Cpu, Layers, Wind } from "lucide-react";

const PILLARS = [
  {
    icon: Wind,
    title: "Aerodynamics & CFD",
    body: "Swept-wing layout engineered for lift over drag, with airflow pressure paths simulated to validate every contour.",
  },
  {
    icon: Layers,
    title: "Structures & Materials",
    body: "Lightweight composite airframes and advanced materials pushing stiffness while shedding every unnecessary gram.",
  },
  {
    icon: Cpu,
    title: "CAD & Simulation",
    body: "Design authority lives in full 3D CAD, feeding CFD and structural checks long before anything is cut.",
  },
  {
    icon: Beaker,
    title: "Hands-on Testing",
    body: "Iterative build-test-fly cycles, refining the prototype against real-world data instead of assumptions.",
  },
  {
    icon: Ruler,
    title: "Precision Manufacturing",
    body: "Tight tolerances on every rib and spar through CNC and composite layup — engineering with intent.",
  },
  {
    icon: Plane,
    title: "Flight Performance",
    body: "A glider tuned to stay aloft longer, fly truer, and carry momentum through every phase of the race.",
  },
];

export default function Specifications() {
  return (
    <section
      id="engineering"
      className="relative z-10 mx-auto flex min-h-[120vh] w-full max-w-6xl flex-col items-center justify-center px-6 py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full text-center"
      >
        <p className="eyebrow mb-6">03 — SPECIFICATIONS / ENGINEERING</p>
        <h2 className="section-heading mb-14 max-w-4xl">
          THE IMPOSSIBLE WAS SIMPLY SOMETHING WE HAD NOT{" "}
          <span className="italic text-accent-cyan/90">ENGINEERED</span> YET
        </h2>
      </motion.div>

      <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: "easeOut" }}
              className="glass-card group p-6 transition-colors duration-300 hover:border-accent-cyan/40"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent-cyan/25 bg-accent-cyan/10">
                <Icon className="h-5 w-5 text-accent-cyan" />
              </div>
              <h3 className="font-display text-xl font-light tracking-wider text-platinum">
                {pillar.title}
              </h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed tracking-wider text-slate-300/85">
                {pillar.body}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}