"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Gem } from "lucide-react";

type TierId = "bronze" | "silver" | "gold" | "platinum";

type Tier = {
  id: TierId;
  name: string;
  range: string;
  min: number;
  stroke: string;
  text: string;
  glow: string;
  perks: string[];
};

const TIERS: Tier[] = [
  {
    id: "bronze",
    name: "Bronze",
    range: "PKR 30,000 – 50,000",
    min: 30000,
    stroke: "#446391",
    text: "text-[#446391]",
    glow: "shadow-[0_0_24px_rgba(68,99,145,0.35)]",
    perks: [
      "Logo on standard team merchandise",
      "Promotional brochures at AeroPakistan stall",
      "Logo in 10-page Enterprise Portfolio",
      "Dedicated Instagram story",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    range: "PKR 60,000 – 90,000",
    min: 60000,
    stroke: "#6484B5",
    text: "text-[#6484B5]",
    glow: "shadow-[0_0_24px_rgba(100,132,181,0.35)]",
    perks: [
      "Logo on standard team merchandise",
      "Promotional brochures at AeroPakistan stall",
      "Logo in 10-page Enterprise Portfolio",
      "Dedicated Instagram story",
      "Logo on the glider",
      "Dedicated slide in official presentation",
      "3 Instagram reels",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    range: "PKR 250,000 – 500,000",
    min: 250000,
    stroke: "#7DA7D9",
    text: "text-[#7DA7D9]",
    glow: "shadow-[0_0_24px_rgba(125,167,217,0.35)]",
    perks: [
      "Everything in Silver",
      "Prominent glider logo",
      "Prime stall demonstration centerpiece",
      "5 dedicated Instagram reels",
      "Verbal presentation shout-out",
    ],
  },
  {
    id: "platinum",
    name: "Platinum · Title Sponsor",
    range: "PKR 500,000+",
    min: 500000,
    stroke: "#FFFFFF",
    text: "text-white",
    glow: "shadow-[0_0_28px_rgba(255,255,255,0.4)]",
    perks: [
      "Title naming rights — “Altair, powered by [Brand]”",
      "Dominant full glider livery design",
      "Industry category exclusivity",
    ],
  },
];

const MIN = 30000;
const MAX = 500000;
const STEP = 10000;

function resolveTier(budget: number): Tier {
  if (budget >= 500000) return TIERS[3];
  if (budget >= 250000) return TIERS[2];
  if (budget >= 60000) return TIERS[1];
  return TIERS[0];
}

function formatPKR(value: number): string {
  return `PKR ${value.toLocaleString("en-PK")}`;
}

export default function TierExplorer() {
  const [budget, setBudget] = useState(500000);
  const tier = useMemo(() => resolveTier(budget), [budget]);
  const atCap = budget >= MAX;

  return (
    <div className="glass-card p-6 sm:p-10">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Investment Explorer</p>
          <h3 className="font-display text-2xl sm:text-3xl font-normal tracking-wider text-white">
            Allocate your budget
          </h3>
        </div>
        <div className="font-display text-2xl sm:text-3xl font-normal tabular-nums text-[#7DA7D9]">
          {atCap ? "PKR 500,000+" : formatPKR(budget)}
        </div>
      </div>

      <input
        type="range"
        name="budget"
        min={MIN}
        max={MAX}
        step={STEP}
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        aria-label="Sponsorship budget"
        className="w-full"
      />

      <div className="mt-3 flex justify-between font-mono text-[11px] font-normal uppercase tracking-widest text-slate-400">
        <span>30,000</span>
        <span>500,000+</span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TIERS.map((t) => {
          const active = t.id === tier.id;
          return (
            <div
              key={t.id}
              onClick={() => setBudget(t.min)}
              className={`cursor-pointer rounded-xl border px-4 py-4 text-center backdrop-blur-sm transition-all duration-300 ${
                active
                  ? `${t.glow} border-[#7DA7D9] bg-[#071834]`
                  : "border-[#446391]/30 bg-[#071834]/80 hover:border-[#6484B5]"
              }`}
            >
              <p
                className={`font-display text-lg font-normal tracking-wider ${active ? "text-white" : "text-slate-400"}`}
              >
                {t.name.split(" · ")[0]}
              </p>
              <p className="mt-1 font-mono text-[10px] font-normal uppercase tracking-widest text-[#7DA7D9]/80">
                {t.range}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#446391]/30 bg-[#071834]/80 px-4 py-3 font-mono text-xs font-normal tracking-wider text-slate-300">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: tier.stroke, boxShadow: `0 0 10px ${tier.stroke}` }}
        />
        Selected tier:{" "}
        <span className="font-normal tracking-widest uppercase text-[#7DA7D9]">
          {tier.name}
        </span>
        <span className="ml-auto hidden text-slate-400 sm:inline">
          {tier.range}
        </span>
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.ul
            key={tier.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid gap-2 sm:grid-cols-2"
          >
            {tier.perks.map((perk) => (
              <motion.li
                key={perk}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 rounded-lg border border-[#446391]/25 bg-[#071834]/70 px-4 py-3"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7DA7D9]" />
                <span className="font-mono text-xs font-normal tracking-wide text-slate-200">
                  {perk}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div className="mt-8 rounded-lg border border-[#446391]/30 bg-[#071834]/80 px-4 py-4">
        <div className="mb-2 flex items-center gap-2">
          <Gem className="h-4 w-4 text-[#7DA7D9]" />
          <p className="font-mono text-xs font-normal uppercase tracking-widest text-[#7DA7D9]">
            In-Kind Partnerships
          </p>
        </div>
        <p className="font-mono text-xs font-normal leading-relaxed tracking-wider text-slate-300">
          Round-trip airfare (2) · 1-week Karachi hotel accommodation (2 people)
          · merchandise manufacturing · printing services · social reach
          support
        </p>
      </div>

      <p className="mt-6 text-center font-mono text-[11px] font-normal tracking-wider text-slate-400">
        Ranges are indicative — custom collaboration packages are always open.
      </p>
    </div>
  );
}