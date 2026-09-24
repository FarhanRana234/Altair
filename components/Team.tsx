"use client";

import { motion } from "framer-motion";

type Member = {
  name: string;
  role: string;
  university: string;
  bio: string;
};

const MEMBERS: Member[] = [
  {
    name: "Huriya Irfan",
    role: "Captain",
    university: "NED University of Engineering & Technology (NEDUET)",
    bio: "Changed the track. Kept the vibe.",
  },
  {
    name: "Shamikh Khilji",
    role: "Aerodynamics",
    university: "NED University of Engineering & Technology (NEDUET)",
    bio: "Nah, I'd win",
  },
  {
    name: "Musaab Junaid",
    role: "CAD",
    university: "NED University of Engineering & Technology (NEDUET)",
    bio: "No somersaults intended, I guess..",
  },
  {
    name: "Yamaan Ali",
    role: "Structures and Manufacturing",
    university: "NED University of Engineering & Technology (NEDUET)",
    bio: "Baggin that highest engineering score fs",
  },
  {
    name: "Hamna Maryam",
    role: "Project Manager",
    university: "Capital University of Science & Technology (CUST)",
    bio: "Stand back, we got this",
  },
  {
    name: "Syeda Shanza Fatima",
    role: "CAD",
    university: "Capital University of Science & Technology (CUST)",
    bio: "See you with a goated glider on my side",
  },
];

function MemberCard({ member, index }: { member: Member; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
      className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 transition-colors hover:border-accent-cyan/40"
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-platinum">{member.name}</h3>
            <span className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-widest text-accent-cyan">
              {member.role}
            </span>
          </div>
          <p className="mt-2 text-xs font-light leading-relaxed tracking-wide text-slate-300">
            {member.bio}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            University
          </span>
          <span className="text-sm font-light tracking-wide text-slate-200">
            {member.university}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Team() {
  return (
    <section
      id="team"
      className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32"
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
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
            aerodynamics and design while learning through hands-on innovation
            — proving what teamwork can achieve.
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

        <div className="flex w-full justify-end pr-8 md:pr-16">
          <div className="flex w-full max-w-md flex-col space-y-6 lg:max-w-lg">
            {MEMBERS.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}