"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Member = {
  name: string;
  role: string;
  university: string;
  image: string;
};

const MEMBERS: Member[] = [
  {
    name: "Huriya Irfan",
    role: "Captain",
    university: "NEDUET",
    image: "/team/huriya.png",
  },
  {
    name: "Shamikh Khilji",
    role: "Aerodynamics",
    university: "NEDUET",
    image: "/team/shamikh.png",
  },
  {
    name: "Musaab Junaid",
    role: "CAD",
    university: "NEDUET",
    image: "/team/musaab.png",
  },
  {
    name: "Yamaan Ali",
    role: "Structures and Manufacturing",
    university: "NEDUET",
    image: "/team/yamaan.png",
  },
  {
    name: "Hamna Maryam",
    role: "Project Manager",
    university: "CUST",
    image: "/team/humna.png",
  },
  {
    name: "Syeda Shanza Fatima",
    role: "CAD",
    university: "CUST",
    image: "/team/shanza.png",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("");
}

function MemberCard({ member, index }: { member: Member; index: number }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: "easeOut" }}
      className="glass-card group flex flex-col overflow-hidden transition-colors duration-300 hover:border-accent-cyan/40"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {imgFailed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-space to-space-deep">
            <span className="font-display text-4xl font-light tracking-widest text-accent-cyan/60">
              {getInitials(member.name)}
            </span>
            <span className="font-sans text-[10px] font-light uppercase tracking-widest text-slate-400">
              Photo unavailable
            </span>
          </div>
        ) : (
          <Image
            src={member.image}
            alt={`${member.name} — ${member.role}`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
            onError={() => setImgFailed(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
      </div>

      <div className="mt-auto border-t border-accent-blue/20 bg-slate-950/40 px-5 py-4 text-center">
        <span className="font-display text-lg font-medium tracking-widest text-platinum">
          {member.university}
        </span>
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-2xl">
          <p className="eyebrow mb-6">04 — The Crew</p>
          <h2 className="section-heading text-left">TEAM ALTAIR</h2>
        </div>
        <div className="max-w-xl">
          <p className="section-body">
            ALTAIR is a team of 6 passionate individuals building a glider for
            the future of flight — pushing the boundaries of aerodynamics and
            design through hands-on innovation, from NEDUET and CUST.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-4 py-1.5 text-xs font-light uppercase tracking-widest text-slate-200/90">
              NEDUET · 4
            </span>
            <span className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-4 py-1.5 text-xs font-light uppercase tracking-widest text-slate-200/90">
              CUST · 2
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {MEMBERS.map((member, i) => (
          <MemberCard key={member.name} member={member} index={i} />
        ))}
      </div>
    </section>
  );
}