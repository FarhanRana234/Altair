"use client";

import { motion } from "framer-motion";
import { FileDown, Handshake } from "lucide-react";
import TierExplorer from "./TierExplorer";

const SDGS = [
  { number: "4", label: "Quality Education" },
  { number: "8", label: "Decent Work & Economic Growth" },
  { number: "9", label: "Industry, Innovation & Infrastructure" },
  { number: "17", label: "Partnerships for the Goals" },
];

export default function Sponsorship({ onSponsorClick }: { onSponsorClick: () => void }) {
  return (
    <section
      id="sponsors"
      className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32"
    >
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="eyebrow mb-6">06 — Partnership</p>
          <h2 className="section-heading text-left">SPONSOR US!</h2>
          <p className="section-body mt-8">
            ALTAIR presents an opportunity to collaborate and support the young
            talent in Engineering and Aerospace. Following is the Sponsorship
            Proposal. If you want to collaborate, do let us know and
            we&apos;ll find a way to work things out!
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onSponsorClick}
              className="flex items-center justify-center gap-2 rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-widest text-accent-cyan transition-all hover:bg-accent-cyan hover:text-space-deep hover:shadow-[0_0_28px_rgba(0,240,255,0.45)]"
            >
              <Handshake className="h-4 w-4" />
              Sponsor Us
            </button>
            <a
              href="/ALTAIR_SPONSORSHIP_PROPOSAL.pdf"
              download
              className="flex items-center justify-center gap-2 rounded-full border border-accent-blue/30 bg-accent-blue/10 px-6 py-3.5 font-sans text-sm font-light uppercase tracking-widest text-slate-200 transition-all hover:border-accent-cyan/50 hover:text-accent-cyan"
            >
              <FileDown className="h-4 w-4" />
              Download Proposal
            </a>
          </div>

          <div className="mt-10">
            <p className="eyebrow mb-4">Aligned with UN SDGs</p>
            <div className="grid grid-cols-2 gap-3">
              {SDGS.map((sdg) => (
                <div
                  key={sdg.number}
                  className="flex items-center gap-3 rounded-xl border border-accent-blue/15 bg-slate-900/40 px-4 py-3 backdrop-blur-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/40 bg-gold/10 font-display text-lg font-medium text-gold">
                    {sdg.number}
                  </span>
                  <span className="font-sans text-[11px] font-light tracking-wider text-slate-300/90">
                    {sdg.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <TierExplorer />
        </motion.div>
      </div>
    </section>
  );
}