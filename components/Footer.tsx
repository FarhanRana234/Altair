"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail, Phone } from "lucide-react";
import OrganizedByCard from "./OrganizedByCard";

const CONTACT_ITEMS = [
  {
    icon: Instagram,
    label: "Instagram",
    value: "teamaltair__",
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
    value: "Altair",
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
      className="relative z-10 border-t border-[#446391]/25 bg-[#071834]/80 backdrop-blur-sm"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-28 sm:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mb-14 flex flex-col items-center text-center"
        >
            <h2 className="section-heading mb-4">CONTACT</h2>
          <p className="section-body max-w-xl text-slate-300">
            Interested in collaborating, sponsoring, or tracking our flight?
            Connect with us directly below.
          </p>
        </motion.div>

        {/* Contact List matching Mockup Page 8 */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#446391]/35 bg-[#071834]/85 p-6 sm:p-10 backdrop-blur-md shadow-xl">
          <div className="space-y-4">
            {CONTACT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 py-2 font-mono text-base sm:text-lg text-slate-200 hover:text-[#7DA7D9] transition-colors group"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#446391]/35 bg-[#071834] group-hover:border-[#7DA7D9]/50">
                    <Icon className="h-5 w-5 text-[#7DA7D9]" />
                  </span>
                  <span className="tracking-wider">{item.value}</span>
                </a>
              );
            })}

            {PHONES.map((phone) => (
              <a
                key={phone.name}
                href={`tel:${phone.number.replace(/-/g, "")}`}
                className="flex items-center gap-4 py-2 font-mono text-base sm:text-lg text-slate-200 hover:text-[#7DA7D9] transition-colors group"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#446391]/35 bg-[#071834] group-hover:border-[#7DA7D9]/50">
                  <Phone className="h-5 w-5 text-[#7DA7D9]" />
                </span>
                <span className="tracking-wider">
                  {phone.name} ({phone.number})
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <OrganizedByCard />
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://www.instagram.com/pixify_web"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#7DA7D9] transition-colors hover:text-white"
          >
            <Instagram className="h-4 w-4" />
            Made by @pixify_web
          </a>
        </div>
      </div>

      {/* Bottom Footer Bar with Tagline */}
      <div className="border-t border-[#446391]/20 bg-[#071834]/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row text-center sm:text-left">
          <div className="flex items-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260927-121040-7LkxshNfTORsVLqSgfhV5oXCV2U0Vc.png"
              alt="altair"
              width={224}
              height={94}
              className="h-8 w-auto object-contain sm:h-10"
            />
          </div>

          {/* Official Tagline */}
          <p className="font-display italic text-sm tracking-[0.2em] text-[#7DA7D9]">
            &ldquo;wingspans beyond the stars.&rdquo;
          </p>

          <p className="font-mono text-[11px] font-normal uppercase tracking-widest text-slate-400">
            AeroPakistan 2027 · NEDUET × CUST
          </p>
        </div>
      </div>
    </footer>
  );
}
