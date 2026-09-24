"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Member = {
  name: string;
  image: string;
};

const MEMBERS: Member[] = [
  { name: "Huriya Irfan", image: "/team/huriya.png" },
  { name: "Shamikh Khilji", image: "/team/shamikh.png" },
  { name: "Musaab Junaid", image: "/team/musaab.png" },
  { name: "Yamaan Ali", image: "/team/yamaan.png" },
  { name: "Hamna Maryam", image: "/team/humna.png" },
  { name: "Syeda Shanza Fatima", image: "/team/shanza.png" },
];

function MemberCard({ member, index }: { member: Member; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: "easeOut" }}
      className="glass-card group relative aspect-[4/5] w-full overflow-hidden transition-colors duration-300 hover:border-accent-cyan/40"
    >
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-space to-space-deep" />
      <Image
        src={member.image}
        alt={`${member.name} — ALTAIR team member`}
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
        className="relative object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    </motion.div>
  );
}

export default function Team() {
  return (
    <section
      id="team"
      className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32"
    >
      <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <p className="eyebrow mb-6">04 — The Crew</p>
          <h2 className="section-heading text-left">TEAM ALTAIR</h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="section-body max-w-xl lg:mb-1"
        >
          ALTAIR is a team of 6 passionate individuals building a glider for
          the future of flight — NEDUET × CUST.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {MEMBERS.map((member, i) => (
          <MemberCard key={member.name} member={member} index={i} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <span className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-4 py-1.5 text-xs font-light uppercase tracking-widest text-slate-200/90">
          NEDUET · 4
        </span>
        <span className="rounded-full border border-accent-blue/30 bg-accent-blue/10 px-4 py-1.5 text-xs font-light uppercase tracking-widest text-slate-200/90">
          CUST · 2
        </span>
      </div>
    </section>
  );
}