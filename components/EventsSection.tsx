"use client";

import { motion } from "framer-motion";
import { Flag, Mic, Instagram } from "lucide-react";

export default function EventsSection() {
  return (
    <section
      id="events"
      className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28 sm:py-36 overflow-hidden rounded-3xl my-10"
    >
      {/* Decorative Crane Pattern Tile subtle background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] bg-repeat"
        style={{ backgroundImage: `url('/brand/crane-pattern-tile.svg')`, backgroundSize: "240px 240px" }}
      />
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mb-14 flex flex-col items-center text-center"
        >
              <h2 className="section-heading mb-6">EVENTS</h2>
          <p className="section-body max-w-3xl text-base sm:text-lg text-slate-200">
            We are planning to do two social events to maximize our reach and
            provide a wider range of values to our sponsors.
          </p>
        </motion.div>

        {/* Two-column layout matching Mockup Page 6 */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Event 1: Karachi Run */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="glass-card group relative p-8 sm:p-10 border border-[#446391]/35 bg-[#071834]/85 hover:border-[#7DA7D9]/50 transition-colors"
          >
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#7DA7D9]/30 bg-[#7DA7D9]/10">
              <Flag className="h-5 w-5 text-[#7DA7D9]" />
            </div>
            <span className="mb-4 inline-block font-mono text-[10px] font-normal uppercase tracking-widest text-[#7DA7D9] bg-[#071834] px-3 py-1 rounded-full border border-[#446391]/30">
              On Ground · Karachi
            </span>
            <p className="section-body text-slate-200 leading-relaxed text-sm sm:text-base">
              We will hold a run in Karachi, expecting audience from various age
              ranges. Moreover, based on our previous such experience we will be
              able to provide visibility to our collaborating partners and create
              a fun, memorable gathering for the participants.
            </p>
          </motion.div>

          {/* Event 2: Engineering Podcasts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="glass-card group relative p-8 sm:p-10 border border-[#446391]/35 bg-[#071834]/85 hover:border-[#7DA7D9]/50 transition-colors"
          >
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#7DA7D9]/30 bg-[#7DA7D9]/10">
              <Mic className="h-5 w-5 text-[#7DA7D9]" />
            </div>
            <span className="mb-4 inline-block font-mono text-[10px] font-normal uppercase tracking-widest text-[#7DA7D9] bg-[#071834] px-3 py-1 rounded-full border border-[#446391]/30">
              Digital Broadcast · STEM
            </span>
            <p className="section-body text-slate-200 leading-relaxed text-sm sm:text-base">
              We are also planning to hold various podcasts with the industry
              people related to our field. They will help us narrow down our
              audience to enthusiast STEM learners. Furthermore, we will display
              our sponsors&apos; marketing materials as well as honoring the
              venue sponsor.
            </p>
          </motion.div>
        </div>

        {/* Footer callout matching Mockup Page 6 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <a
            href="https://www.instagram.com/teamaltair__"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-[#446391]/40 bg-[#071834]/80 px-8 py-3.5 font-mono text-xs font-normal tracking-[0.2em] text-slate-200 hover:border-[#7DA7D9] hover:text-[#7DA7D9] transition-all shadow-lg"
          >
            <Instagram className="h-4 w-4 text-[#7DA7D9]" />
            Follow us on instagram for further updates!
          </a>
        </motion.div>
      </div>
    </section>
  );
}
