import Image from "next/image";

const AP_LOGO_WIDTH = 121;
const AP_LOGO_HEIGHT = 48;
const NUVEX_WIDTH = 150;
const NUVEX_HEIGHT = 32;

export default function OrganizedByCard() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[#446391]/30 bg-[#071834]/80 px-6 py-10 text-center shadow-[0_0_50px_rgba(7,24,52,0.8)] backdrop-blur-md sm:px-10">
      <p className="eyebrow mb-8">Organized &amp; Supported By</p>

      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        <Image
          src="/assets/ap-logo-footer.webp"
          alt="Aero Pakistan Logo"
          width={AP_LOGO_WIDTH}
          height={AP_LOGO_HEIGHT}
          className="h-12 w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.12)]"
        />
        <span className="hidden h-10 w-px bg-gradient-to-b from-transparent via-[#446391]/40 to-transparent sm:block" />
        <Image
          src="/assets/nuvex-wordmark.svg"
          alt="NUVEX wordmark"
          width={NUVEX_WIDTH}
          height={NUVEX_HEIGHT}
          className="h-8 w-auto drop-shadow-[0_0_20px_rgba(125,167,217,0.2)]"
        />
      </div>

      <p className="mx-auto mt-8 max-w-md font-mono text-xs font-normal leading-relaxed tracking-wider text-slate-300/80">
        Aero Pakistan is a national-level STEM initiative jointly developed by
        NUVEX Pvt. Ltd. and NUST Formula Student Team (NFST).
      </p>
    </div>
  );
}