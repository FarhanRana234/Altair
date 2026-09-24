"use client";

import { motion } from "framer-motion";

type Member = {
  name: string;
  role: string;
  institution: string;
  quote: string;
};

const MEMBERS: Member[] = [
  {
    name: "Huriya Irfan",
    role: "Captain",
    institution: "NEDUET",
    quote: "Changed the track. Kept the vibe.",
  },
  {
    name: "Shamikh Khilji",
    role: "Aerodynamics",
    institution: "NEDUET",
    quote: "Nah, I'd win",
  },
  {
    name: "Musaab Junaid",
    role: "CAD",
    institution: "NEDUET",
    quote: "No somersaults intended, I guess..",
  },
  {
    name: "Yamaan Ali",
    role: "Structures & Manufacturing",
    institution: "NEDUET",
    quote: "Baggin that highest engineering score fs",
  },
  {
    name: "Hamna Maryam",
    role: "Project Manager",
    institution: "CUST",
    quote: "Stand back, we got this",
  },
  {
    name: "Syeda Shanza Fatima",
    role: "CAD",
    institution: "CUST",
    quote: "See you with a goated glider on my side",
  },
];

export default function Team() {
  return (
    <section
      id="team"
      className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32"
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="eyebrow mb-6">04 — The Crew</p>
          <h2 className="section-heading text-left">TEAM ALTAIR</h2>
          <p className="section-body mt-8">
            ALTAIR is a team of 6 passionate individuals building a glider for
            the future of flight. We are committed to pushing the boundaries of
            aerodynamics and design while learning through hands-on innovation.
            Our mission goes beyond just building a glider — we build to
            inspire, to create, and to prove what teamwork can achieve. Through
            engineering, testing, and dedication, ALTAIR continues to show that
            innovation can take flight.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-4 py-1.5 text-xs font-light uppercase tracking-widest text-slate-200/90">
              NEDUET · 4
            </span>
            <span className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-4 py-1.5 text-xs font-light uppercase tracking-widest text-slate-200/90">
              CUST · 2
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: "easeOut" }}
              className="glass-card group flex flex-col justify-between gap-6 p-6 transition-colors duration-300 hover:border-accent-cyan/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl font-light tracking-wider text-platinum">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-sans text-xs font-medium uppercase tracking-widest text-accent-cyan">
                    {member.role}
                  </p>
                </div>
                <span className="rounded-full border border-accent-blue/25 px-3 py-1 font-sans text-[10px] font-light uppercase tracking-widest text-slate-400">
                  {member.institution}
                </span>
              </div>
              <p className="font-display text-lg font-light italic tracking-wide text-slate-300/90">
                &ldquo;{member.quote}&rdquo;
              </p>
              <div className="h-px w-full bg-gradient-to-r from-accent-cyan/60 via-accent-blue/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}