"use client";

import { motion } from "framer-motion";
import { Flag, Mic } from "lucide-react";

const EVENTS = [
  {
    icon: Flag,
    title: "Karachi Community Race Event",
    body: "A public race in Karachi expecting an audience across various age ranges, creating sponsor visibility and an engaging community gathering.",
    tag: "On Ground",
  },
  {
    icon: Mic,
    title: "Engineering Podcasts",
    body: "Industry interviews with aerospace professionals and pilots targeting STEM learners while showcasing sponsor marketing materials.",
    tag: "Digital",
  },
];

export default function EventsSection() {
  return (
    <section
      id="events"
      className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="mb-14 flex flex-col items-center text-center"
      >
        <p className="eyebrow mb-6">05 — Beyond the Track</p>
        <h2 className="section-heading">EVENTS</h2>
        <p className="section-body mt-4 max-w-2xl">
          We are planning to do two social events to maximize our reach and
          provide a wider range of values to our sponsors.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {EVENTS.map((event, i) => {
          const Icon = event.icon;
          return (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              className="glass-card group relative overflow-hidden p-8 sm:p-10"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-cyan/10 blur-3xl transition-opacity duration-500 group-hover:bg-accent-cyan/20" />
              <div className="relative">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent-cyan/30 bg-accent-cyan/10">
                  <Icon className="h-5 w-5 text-accent-cyan" />
                </div>
                <span className="mb-4 inline-block rounded-full border border-accent-blue/30 px-3 py-1 text-[10px] font-light uppercase tracking-widest2 text-slate-400">
                  {event.tag}
                </span>
                <h3 className="mb-4 font-display text-3xl font-light tracking-wider text-platinum">
                  {event.title}
                </h3>
                <p className="section-body">{event.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.a
        href="https://www.instagram.com/teamaltair__"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-10 flex items-center justify-center gap-3 rounded-2xl border border-accent-blue/25 bg-slate-900/40 px-6 py-4 font-sans text-sm font-light tracking-widest text-slate-200/90 backdrop-blur-md transition-colors hover:border-accent-cyan/40 hover:text-accent-cyan"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-cyan" />
        Follow us on instagram for further updates!
      </motion.a>
    </section>
  );
}