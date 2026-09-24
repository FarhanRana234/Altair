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
    stroke: "#c08552",
    text: "text-amber-700/90",
    glow: "shadow-[0_0_30px_rgba(192,133,82,0.25)]",
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
    stroke: "#cbd5e1",
    text: "text-slate-300",
    glow: "shadow-[0_0_30px_rgba(203,213,225,0.25)]",
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
    stroke: "#f59e0b",
    text: "text-gold",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
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
    stroke: "#00f0ff",
    text: "text-accent-cyan",
    glow: "shadow-[0_0_30px_rgba(0,240,255,0.3)]",
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
          <h3 className="font-display text-3xl font-light tracking-wider text-platinum">
            Allocate your budget
          </h3>
        </div>
        <div className="font-display text-3xl font-light tabular-nums text-accent-cyan">
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

      <div className="mt-3 flex justify-between font-sans text-[11px] font-light uppercase tracking-widest text-slate-500">
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
                  ? `${t.glow} border-transparent bg-slate-800/50`
                  : "border-accent-blue/15 bg-slate-900/30 hover:border-accent-blue/30"
              }`}
            >
              <p
                className={`font-display text-lg font-light tracking-widest ${active ? t.text : "text-slate-400"}`}
              >
                {t.name.split(" · ")[0]}
              </p>
              <p className="mt-1 font-sans text-[10px] font-light uppercase tracking-widest text-slate-500">
                {t.range}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-accent-blue/15 bg-slate-900/40 px-4 py-3 font-sans text-xs font-light tracking-wider text-slate-400">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: tier.stroke, boxShadow: `0 0 10px ${tier.stroke}` }}
        />
        Selected tier:{" "}
        <span className={`font-medium tracking-widest uppercase ${tier.text}`}>
          {tier.name}
        </span>
        <span className="ml-auto hidden text-slate-500 sm:inline">
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
                className="flex items-start gap-3 rounded-lg border border-accent-blue/10 bg-slate-900/30 px-4 py-3"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
                <span className="font-sans text-sm font-light tracking-wider text-slate-200/90">
                  {perk}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div className="mt-8 rounded-lg border border-accent-blue/15 bg-space/30 px-4 py-4">
        <div className="mb-2 flex items-center gap-2">
          <Gem className="h-4 w-4 text-gold" />
          <p className="font-sans text-xs font-medium uppercase tracking-widest text-gold">
            In-Kind Partnerships
          </p>
        </div>
        <p className="font-sans text-xs font-light leading-relaxed tracking-wider text-slate-400">
          Round-trip airfare (2) · 1-week Karachi hotel accommodation (2 people)
          · merchandise manufacturing · printing services · social reach
          support
        </p>
      </div>

      <p className="mt-6 text-center font-sans text-[11px] font-light tracking-wider text-slate-500">
        Ranges are indicative — custom collaboration packages are always open.
      </p>
    </div>
  );
}