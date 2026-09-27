"use client";

import { motion } from "framer-motion";
import Glider3DViewer from "./Glider3DViewer";

export default function ProjectShowcase() {
  return (
    <section
      id="project"
      className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 sm:py-36"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left column: Text */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-left"
        >
              <h2 className="section-heading text-left mb-6">OUR PROJECT</h2>
          <p className="section-body text-base sm:text-lg leading-relaxed text-slate-200">
            We are aimimg to engineer a glider which will be able for flight
            withstanding all the potential forces acting on it. Moreover, our
            aerofoil choice and wing placement will make sure that the glider
            lands on the target maximizing our chances of acing the competition.
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-[#7DA7D9] mt-6">
            Engineered from ground up · Aerodynamics &amp; Composites
          </p>
        </motion.div>

        {/* Right column: 3D Viewport matching Mockup Page 5 */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="glass-card w-full overflow-hidden border border-[#446391]/35 bg-[#071834]/85 shadow-2xl">
            <div className="relative h-[340px] w-full sm:h-[440px]">
              <Glider3DViewer />
            </div>
            <div className="flex items-center justify-between border-t border-[#446391]/30 bg-[#071834]/90 px-6 py-4">
              <span className="font-mono text-xs font-normal uppercase tracking-widest text-slate-300">
                Our glider
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
