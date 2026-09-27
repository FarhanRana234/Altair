"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Metric = {
  value: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  sublabel: string;
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
    const duration = 1600;
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
    <span ref={ref} className="tabular-nums font-display font-normal text-white">
      {text}
      {metric.suffix ? <span className="text-[#7DA7D9]">{metric.suffix}</span> : null}
    </span>
  );
}

export default function TeamAltairSection() {
  return (
    <section id="team" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28 sm:py-36">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-center"
      >
          <h2 className="section-heading mb-8">TEAM ALTAIR</h2>
        <p className="section-body mx-auto max-w-3xl text-base sm:text-lg text-slate-200">
          ALTAIR is a team of 6 passionate individuals building a glider for
          the future of flight. We are committed to pushing the boundaries of
          aerodynamics and design while learning through hands-on innovation.
        </p>
      </motion.div>

      {/* Teach64-style Track Record Grid replacing {TRACK RECORD HERE} placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        className="mt-14"
      >
        <div className="mb-4 flex items-center justify-between px-2">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#7DA7D9]">
            Proven Track Record
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#6484B5]">
            Formula Pakistan 2026 Lineage
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              className="glass-card flex flex-col justify-between p-6 sm:p-7 border border-[#446391]/35 bg-[#071834]/85 hover:border-[#7DA7D9]/50 transition-colors"
            >
              <div>
                <div className="text-4xl sm:text-5xl font-display mb-2 text-white">
                  <Counter metric={metric} />
                </div>
                <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-[#7DA7D9] font-normal mb-2">
                  {metric.label}
                </h3>
              </div>
              <p className="font-mono text-xs text-slate-300/80 leading-relaxed">
                {metric.sublabel}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Media Coverage Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-[#446391]/30 bg-[#071834]/60 px-6 py-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-slate-300">
            <span className="inline-block h-2 w-2 rounded-full bg-[#7DA7D9]" />
            <span className="text-[#7DA7D9] font-normal">National Media Coverage:</span>
            <span>BBC Urdu · DAWN · ProPakistani</span>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#6484B5]">
            Top Engineering &amp; Design Score Nationally
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
