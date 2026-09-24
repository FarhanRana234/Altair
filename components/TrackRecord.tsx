"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Metric = {
  value: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  sublabel?: string;
};

const METRICS: Metric[] = [
  {
    value: "1",
    suffix: "st",
    label: "Runners-Up",
    sublabel: "Formula Pakistan 2026",
  },
  {
    value: "185.0",
    decimals: 1,
    label: "Top Score",
    sublabel: "Highest Engineering & Design score nationally",
  },
  {
    value: "1800",
    suffix: "+",
    label: "Attendees",
    sublabel: "Audience reach at Karachi Expo Centre",
  },
  {
    value: "6",
    label: "Engineers",
    sublabel: "Multidisciplinary team · NEDUET & CUST",
  },
  {
    value: "828000",
    prefix: "PKR ",
    label: "Project Budget",
    sublabel: "Manufacturing & execution",
  },
];

function formatNumber(raw: string): number {
  return Number(raw);
}

function Counter({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [text, setText] = useState(
    `${metric.prefix ?? ""}${metric.decimals ? "0.0" : "0"}`
  );

  useEffect(() => {
    if (!inView) return;
    const target = formatNumber(metric.value);
    const duration = 1800;
    const start = performance.now();

    let raf = 0;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const formatted =
        metric.decimals !== undefined
          ? current.toFixed(metric.decimals)
          : Math.round(current).toLocaleString("en-US");
      setText(`${metric.prefix ?? ""}${formatted}`);
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, metric]);

  return (
    <span ref={ref} className="tabular-nums">
      {text}
      {metric.suffix ? <span className="text-accent-cyan">{metric.suffix}</span> : null}
    </span>
  );
}

export default function TrackRecord() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="mb-14 flex flex-col items-center text-center"
      >
        <p className="eyebrow mb-4">02 — Track Record</p>
        <h2 className="section-heading">BUILT ON PROVEN WINGS</h2>
        <p className="section-body mt-4 max-w-2xl">
          ALTAIR is the direct successor to Team DriftX — 1st Runners-Up at
          Formula Pakistan 2026. Our numbers speak for themselves.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
            className="glass-card flex flex-col items-center gap-2 px-4 py-10 text-center"
          >
            <div className="font-display text-4xl font-light text-platinum sm:text-[2.75rem]">
              <Counter metric={metric} />
            </div>
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-accent-cyan">
              {metric.label}
            </p>
            {metric.sublabel ? (
              <p className="font-sans text-xs font-light tracking-wider text-slate-400/90">
                {metric.sublabel}
              </p>
            ) : null}
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-10 text-center text-sm font-light tracking-widest text-slate-400/90"
      >
        National media exposure — BBC Urdu · DAWN · ProPakistani
      </motion.p>
    </section>
  );
}