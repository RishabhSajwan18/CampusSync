import { motion } from "framer-motion";

function HeroIllustration() {
  return (
    <div
      className="relative mx-auto hidden w-full max-w-[340px] items-center justify-center lg:flex"
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
      <div className="glass-panel relative flex aspect-square w-full max-w-[300px] items-center justify-center p-6">
        <svg viewBox="0 0 240 200" className="w-full text-content-faint/50" fill="none">
          <rect
            x="20"
            y="24"
            width="88"
            height="72"
            rx="10"
            stroke="currentColor"
            strokeWidth="1.75"
            className="text-primary/50"
          />
          <circle cx="48" cy="50" r="10" stroke="currentColor" strokeWidth="1.75" className="text-primary/70" />
          <path
            d="M32 84 L60 60 L78 76 L100 52"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="text-primary/40"
          />
          <rect x="132" y="44" width="88" height="72" rx="10" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="160" cy="70" r="10" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M144 104 L172 80 L190 96 L212 72"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d="M112 60 L128 60"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="text-primary"
          />
          <circle cx="120" cy="60" r="4" fill="currentColor" className="text-primary" />
          <text
            x="120"
            y="160"
            textAnchor="middle"
            fill="currentColor"
            className="fill-content-muted text-[12px]"
          >
            AI visual matching
          </text>
        </svg>
      </div>
    </div>
  );
}

export default function Hero({ onReport, onBrowse }) {
  return (
    <section id="home" className="relative overflow-hidden border-b border-white/[0.06]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 30% 40%, rgba(79,140,255,0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(143,179,255,0.1), transparent 55%)",
        }}
      />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[90px]" />

      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-content-muted backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              AI-powered campus lost &amp; found
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-content sm:text-5xl lg:text-6xl lg:leading-[1.08]">
              Find Lost Items
              <span className="block text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                Faster
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-content-muted sm:text-lg">
              Upload a photo and discover visually similar reports using AI image
              matching — built for campus life.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button type="button" onClick={onReport} className="btn-primary">
                Report Item
              </button>
              <button type="button" onClick={onBrowse} className="btn-secondary">
                Browse Items
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
