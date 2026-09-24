"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Member = {
  name: string;
  role: string;
  institution: string;
  quote: string;
  image: string;
};

const MEMBERS: Member[] = [
  {
    name: "Huriya Irfan",
    role: "Captain",
    institution: "NEDUET",
    quote: "Changed the track. Kept the vibe.",
    image: "/team/huriya.png",
  },
  {
    name: "Shamikh Khilji",
    role: "Aerodynamics",
    institution: "NEDUET",
    quote: "Nah, I'd win",
    image: "/team/shamikh.png",
  },
  {
    name: "Musaab Junaid",
    role: "CAD",
    institution: "NEDUET",
    quote: "No somersaults intended, I guess..",
    image: "/team/musaab.png",
  },
  {
    name: "Yamaan Ali",
    role: "Structures & Manufacturing",
    institution: "NEDUET",
    quote: "Baggin that highest engineering score fs",
    image: "/team/yamaan.png",
  },
  {
    name: "Hamna Maryam",
    role: "Project Manager",
    institution: "CUST",
    quote: "Stand back, we got this",
    image: "/team/humna.png",
  },
  {
    name: "Syeda Shanza Fatima",
    role: "CAD",
    institution: "CUST",
    quote: "See you with a goated glider on my side",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: "easeOut" }}
      className="glass-card group flex flex-col overflow-hidden transition-colors duration-300 hover:border-accent-cyan/40"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[15px] border-b border-cyan-500/30">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-space to-space-deep">
          <span className="font-display text-5xl font-light tracking-widest text-accent-cyan/50">
            {getInitials(member.name)}
          </span>
        </div>

        {!error ? (
          <Image
            src={member.image}
            alt={`${member.name} - ${member.role}`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            onError={() => {
              setError(true);
              setLoading(false);
            }}
            onLoadingComplete={() => setLoading(false)}
            className={`object-cover transition-opacity duration-700 ${
              loading ? "opacity-0" : "opacity-100"
            }`}
          />
        ) : null}

        <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-space-deep/60 px-3 py-1 font-sans text-[10px] font-light uppercase tracking-widest text-slate-300 backdrop-blur-sm">
          {member.institution}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-space-deep/90 via-space-deep/50 to-transparent px-4 pb-4 pt-12">
          <p className="font-display text-base font-normal italic leading-snug text-platinum drop-shadow-md">
            &ldquo;{member.quote}&rdquo;
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 p-5">
        <h3 className="font-display text-2xl font-medium tracking-wider text-platinum transition-colors group-hover:text-accent-cyan">
          {member.name}
        </h3>
        <p className="font-sans text-xs font-medium uppercase tracking-widest text-accent-cyan">
          {member.role}
        </p>
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
            <MemberCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}