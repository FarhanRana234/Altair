"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Aero Pakistan", href: "#aero-pakistan" },
  { label: "Team", href: "#team" },
  { label: "Project", href: "#project" },
  { label: "Events", href: "#events" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Contact", href: "#contact" },
];

const container: Variants = {
  hidden: { opacity: 0, y: -24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Navbar({ onSponsorClick }: { onSponsorClick: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#top");

  useEffect(() => {
    const sections = LINKS.map((link) => document.querySelector(link.href)).filter(
      (section): section is Element => Boolean(section),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleSection?.target.id) setActiveSection(`#${visibleSection.target.id}`);
      },
      { rootMargin: "-25% 0px -60%", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        variants={container}
        initial="hidden"
        animate="show"
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#446391]/25 bg-[#071834]/80 px-6 py-4 backdrop-blur-md sm:px-10"
      >
        <motion.div variants={item} className="flex items-center">
          <a
            href="#top"
            className="flex items-center gap-3 transition-opacity hover:opacity-85"
            aria-label="Altair home"
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260927-121040-7LkxshNfTORsVLqSgfhV5oXCV2U0Vc.png"
              alt="altair"
              width={224}
              height={94}
              className="h-8 w-auto object-contain sm:h-10"
            />
          </a>
        </motion.div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  isActive ? "text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-1 h-px bg-white transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </a>
            );
          })}
          <button
            onClick={onSponsorClick}
            className="ml-3 rounded-full border border-[#7DA7D9]/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#DCEBFF] transition-all hover:border-white hover:bg-white hover:text-[#071834]"
          >
            Sponsor Us
          </button>
        </nav>

        {/* Menu toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#446391]/30 bg-[#071834]/80 text-white lg:hidden transition-colors hover:border-[#7DA7D9]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[65px] z-40 border-b border-[#446391]/30 bg-[#071834]/95 px-6 py-6 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-mono text-sm tracking-[0.2em] text-slate-200 uppercase py-2 transition-colors hover:text-[#7DA7D9]"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-[#446391]/25">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSponsorClick();
                  }}
                  className="w-full flex items-center justify-center rounded-full border border-[#7DA7D9] bg-[#7DA7D9]/15 py-3 font-mono text-xs uppercase tracking-widest text-[#7DA7D9] hover:bg-[#7DA7D9] hover:text-[#071834] transition-all"
                >
                  Sponsor Us
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
