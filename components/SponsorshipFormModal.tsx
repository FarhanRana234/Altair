"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileDown, Loader2, Send, X } from "lucide-react";

type FormStatus = "idle" | "sending" | "success" | "error";

const TIER_OPTIONS = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum · Title Sponsor",
  "In-Kind Partnership",
];

const PROPOSAL_URL = "/ALTAIR_SPONSORSHIP_PROPOSAL.pdf";

function triggerProposalDownload() {
  const link = document.createElement("a");
  link.href = PROPOSAL_URL;
  link.download = "ALTAIR_SPONSORSHIP_PROPOSAL.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SponsorshipFormModal({ open, onClose }: Props) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    tier: "",
    note: "",
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const resetAndClose = () => {
    setStatus("idle");
    setForm({ name: "", email: "", company: "", tier: "", note: "" });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const payload = {
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
      name: form.name,
      email: form.email,
      company: form.company,
      tier: form.tier,
      note: form.note,
      subject: `New sponsorship lead — ${form.company || form.name} (${form.tier})`,
      from_name: "ALTAIR Website",
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Web3Forms error");

      triggerProposalDownload();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const fieldClass =
    "w-full rounded-xl border border-accent-blue/20 bg-space-deep/70 px-4 py-3 font-sans text-sm font-light tracking-wider text-platinum placeholder:text-slate-500 focus:border-accent-cyan/60";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-space-deep/80 p-4 backdrop-blur-md"
          onClick={resetAndClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card max-h-[90vh] w-full max-w-lg overflow-y-auto border-accent-cyan/20 p-8"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="eyebrow mb-2">Become a Partner</p>
                <h3 className="font-display text-3xl font-light tracking-wider text-platinum">
                  SPONSOR US
                </h3>
              </div>
              <button
                onClick={resetAndClose}
                aria-label="Close"
                className="rounded-full border border-accent-blue/20 p-2 text-slate-400 transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-8 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent-cyan/40 bg-accent-cyan/10">
                  <FileDown className="h-7 w-7 text-accent-cyan" />
                </div>
                <p className="font-display text-2xl font-light text-platinum">
                  Proposal on its way
                </p>
                <p className="section-body max-w-sm">
                  Thank you, {form.name.split(" ")[0]}. Your proposal has been
                  downloaded and our team at{" "}
                  <span className="text-accent-cyan">altair.aeropak@gmail.com</span>{" "}
                  will reach out shortly.
                </p>
                <button
                  onClick={resetAndClose}
                  className="mt-2 rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-accent-cyan transition-all hover:bg-accent-cyan hover:text-space-deep"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block font-sans text-[11px] font-light uppercase tracking-widest text-slate-400">
                      Full Name
                    </span>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="John Doe"
                      className={fieldClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-sans text-[11px] font-light uppercase tracking-widest text-slate-400">
                      Corporate Email
                    </span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@company.com"
                      className={fieldClass}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1.5 block font-sans text-[11px] font-light uppercase tracking-widest text-slate-400">
                    Company / Organization
                  </span>
                  <input
                    required
                    type="text"
                    value={form.company}
                    onChange={set("company")}
                    placeholder="Acme Corp"
                    className={fieldClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block font-sans text-[11px] font-light uppercase tracking-widest text-slate-400">
                    Selected Sponsorship Tier
                  </span>
                  <select required value={form.tier} onChange={set("tier")} className={fieldClass}>
                    <option value="" disabled className="bg-space-deep">
                      Select a tier
                    </option>
                    {TIER_OPTIONS.map((tier) => (
                      <option key={tier} value={tier} className="bg-space-deep">
                        {tier}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block font-sans text-[11px] font-light uppercase tracking-widest text-slate-400">
                    Note
                  </span>
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={set("note")}
                    placeholder="Tell us briefly what you'd like to collaborate on..."
                    className={`${fieldClass} resize-none`}
                  />
                </label>

                {status === "error" ? (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-light tracking-wider text-red-300">
                    Something went wrong sending the form. Please try again or
                    email us directly at altair.aeropak@gmail.com.
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-accent-cyan/40 bg-accent-cyan/10 px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-widest text-accent-cyan transition-all hover:bg-accent-cyan hover:text-space-deep hover:shadow-[0_0_28px_rgba(0,240,255,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Request Sponsorship Proposal
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}