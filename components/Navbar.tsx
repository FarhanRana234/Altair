"use client";

import { motion, type Variants } from "framer-motion";

const LINKS = [
  { label: "Aero Pakistan", href: "#aero-pakistan" },
  { label: "Project", href: "#project" },
  { label: "Team", href: "#team" },
  { label: "Events", href: "#events" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Contact", href: "#contact" },
];

const container: Variants = {
  hidden: { opacity: 0, y: -24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Navbar({ onSponsorClick }: { onSponsorClick: () => void }) {
  return (
    <motion.header
      variants={container}
      initial="hidden"
      animate="show"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-accent-blue/10 bg-space-deep/50 px-6 py-4 backdrop-blur-md sm:px-10"
    >
      <motion.div variants={item} className="flex items-center gap-3">
        <a
          href="#top"
          className="font-display text-2xl font-light tracking-widest2 text-platinum transition-colors hover:text-accent-cyan"
        >
          altair
        </a>
      </motion.div>

      <motion.nav variants={item} className="hidden items-center gap-8 lg:flex">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="font-sans text-[13px] font-light tracking-[0.2em] text-slate-300/80 uppercase transition-colors hover:text-accent-cyan"
          >
            {link.label}
          </a>
        ))}
      </motion.nav>

      <motion.button
        variants={item}
        onClick={onSponsorClick}
        className="rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-5 py-2 font-sans text-[13px] font-medium tracking-widest text-accent-cyan uppercase transition-all hover:bg-accent-cyan hover:text-space-deep hover:shadow-[0_0_28px_rgba(0,240,255,0.45)]"
      >
        Sponsor Us
      </motion.button>
    </motion.header>
  );
}