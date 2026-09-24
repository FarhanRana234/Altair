"use client";

import { motion } from "framer-motion";
import { AtSign, Linkedin, Mail, Phone } from "lucide-react";
import OrganizedByCard from "./OrganizedByCard";

const CONTACTS = [
  {
    icon: AtSign,
    label: "Instagram",
    value: "@teamaltair__",
    href: "https://www.instagram.com/teamaltair__",
  },
  {
    icon: Mail,
    label: "Email",
    value: "altair.aeropak@gmail.com",
    href: "mailto:altair.aeropak@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/company/teamaltair",
    href: "https://www.linkedin.com/company/teamaltair",
  },
];

const PHONES = [
  { name: "Huriya Irfan", role: "Captain", number: "0310-1078428" },
  { name: "Yamaan Ali", role: "Structures", number: "0303-2390577" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-accent-blue/10 bg-space/30 backdrop-blur-sm"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <p className="eyebrow mb-6">07 — Reach Out</p>
          <h2 className="section-heading">CONTACT</h2>
          <p className="section-body mt-4 max-w-xl">
            Interested in collaborating, sponsoring, or just want to follow the
            journey? Find us anywhere below — we reply fast.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CONTACTS.map((contact, i) => {
            const Icon = contact.icon;
            return (
              <motion.a
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                className="glass-card group flex flex-col gap-3 p-7 transition-colors hover:border-accent-cyan/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-cyan/25 bg-accent-cyan/10">
                  <Icon className="h-5 w-5 text-accent-cyan" />
                </span>
                <p className="font-sans text-[11px] font-light uppercase tracking-widest2 text-slate-400">
                  {contact.label}
                </p>
                <p className="break-all font-display text-lg font-light tracking-wider text-platinum transition-colors group-hover:text-accent-cyan">
                  {contact.value}
                </p>
              </motion.a>
            );
          })}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {PHONES.map((phone, i) => (
            <motion.a
              key={phone.name}
              href={`tel:${phone.number.replace(/-/g, "")}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: "easeOut" }}
              className="glass-card group flex items-center gap-4 p-6 transition-colors hover:border-accent-cyan/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent-blue/25 bg-accent-blue/10">
                <Phone className="h-4 w-4 text-slate-300" />
              </span>
              <span>
                <span className="block font-display text-lg font-light tracking-wider text-platinum">
                  {phone.name}
                </span>
                <span className="text-xs font-light tracking-widest text-slate-400">
                  {phone.role} · {phone.number}
                </span>
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-24">
          <OrganizedByCard />
        </div>
      </div>

      <div className="border-t border-accent-blue/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <a
            href="#top"
            className="font-display text-2xl font-light tracking-widest2 text-platinum hover:text-accent-cyan transition-colors"
          >
            altair
          </a>
          <p className="font-sans text-[11px] font-light uppercase tracking-widest2 text-slate-500">
            AeroPakistan 2027 · NEDUET × CUST
          </p>
        </div>
      </div>
    </footer>
  );
}