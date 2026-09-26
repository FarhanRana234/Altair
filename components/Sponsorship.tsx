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
      className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 sm:py-36"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="eyebrow mb-6">Partnership</p>
          <h2 className="section-heading text-left mb-6">SPONSOR US!</h2>
          <p className="section-body text-base sm:text-lg leading-relaxed text-slate-200">
            ALTAIR presents an opportunity to collaborate and support the young
            talent in Engineering and Aerospace. Following is the Sponsorship
            Proposal. If you want to collaborate, do let us know and
            we&apos;ll find a way to work things out!
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onSponsorClick}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#7DA7D9]/50 bg-[#7DA7D9]/15 px-6 py-3.5 font-mono text-xs font-normal uppercase tracking-widest text-[#7DA7D9] transition-all hover:bg-[#7DA7D9] hover:text-[#071834] hover:shadow-[0_0_24px_rgba(125,167,217,0.4)]"
            >
              <Handshake className="h-4 w-4" />
              Sponsor Us
            </button>
            <a
              href="/ALTAIR_SPONSORSHIP_PROPOSAL.pdf"
              download
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#446391]/40 bg-[#071834]/80 px-6 py-3.5 font-mono text-xs font-normal uppercase tracking-widest text-slate-200 transition-all hover:border-[#7DA7D9] hover:text-white"
            >
              <FileDown className="h-4 w-4" />
              Download Proposal
            </a>
          </div>

          <div className="mt-12">
            <p className="eyebrow mb-4">Aligned with UN SDGs</p>
            <div className="grid grid-cols-2 gap-3">
              {SDGS.map((sdg) => (
                <div
                  key={sdg.number}
                  className="flex items-center gap-3 rounded-xl border border-[#446391]/30 bg-[#071834]/80 px-4 py-3 backdrop-blur-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#7DA7D9]/40 bg-[#7DA7D9]/15 font-display text-base font-normal text-[#7DA7D9]">
                    {sdg.number}
                  </span>
                  <span className="font-mono text-[11px] font-normal tracking-wider text-slate-300">
                    {sdg.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <TierExplorer />
        </motion.div>
      </div>
    </section>
  );
}
