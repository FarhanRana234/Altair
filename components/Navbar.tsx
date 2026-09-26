"use client";

import { useState } from "react";
import Image from "next/image";
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
            <Image
              src="/brand/crane-icon.svg"
              alt="Altair crane logo"
              width={40}
              height={40}
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain drop-shadow-[0_0_12px_rgba(125,167,217,0.35)]"
              priority
            />
            <Image
              src="/brand/wordmark.svg"
              alt="altair"
              width={96}
              height={26}
              className="h-5 sm:h-6 w-auto object-contain"
              priority
            />
          </a>
        </motion.div>

        {/* Desktop Nav */}
        <motion.nav variants={item} className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[12px] font-normal tracking-[0.2em] text-slate-300 uppercase transition-colors hover:text-[#7DA7D9]"
            >
              {link.label}
            </a>
          ))}
        </motion.nav>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <motion.button
            variants={item}
            onClick={onSponsorClick}
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-[#7DA7D9]/50 bg-[#7DA7D9]/10 px-5 py-2 font-mono text-[12px] font-normal tracking-widest text-[#7DA7D9] uppercase transition-all hover:bg-[#7DA7D9] hover:text-[#071834] hover:shadow-[0_0_20px_rgba(125,167,217,0.4)]"
          >
            Sponsor Us
          </motion.button>

          {/* Mobile hamburger button (min 44x44px touch target) */}
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