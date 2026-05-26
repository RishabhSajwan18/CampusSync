function HeroIllustration() {
  return (
    <div
      className="hidden lg:flex h-full min-h-[140px] w-full max-w-[280px] items-center justify-center rounded-lg border border-white/[0.06] bg-surface-card p-6"
      aria-hidden
    >
      <svg viewBox="0 0 200 160" className="w-full max-w-[200px] text-content-faint/40" fill="none">
        <rect x="24" y="20" width="72" height="56" rx="6" stroke="currentColor" strokeWidth="1.5" className="text-primary/40" />
        <circle cx="48" cy="40" r="8" stroke="currentColor" strokeWidth="1.5" className="text-primary/60" />
        <path d="M32 68 L56 52 L72 64 L88 48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/30" />
        <rect x="104" y="36" width="72" height="56" rx="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="128" cy="56" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M112 84 L136 68 L152 80 L168 64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M96 48 L104 48"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="text-primary"
        />
        <circle cx="100" cy="48" r="3" fill="currentColor" className="text-primary" />
        <text x="100" y="120" textAnchor="middle" fill="currentColor" className="text-[10px] fill-content-muted">
          visual match
        </text>
      </svg>
    </div>
  );
}

export default function Hero({ onReport, onBrowse }) {
  return (
    <section id="home" className="border-b border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-content sm:text-3xl">
              Find Lost Items Faster
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-content-muted">
              Upload a photo and discover visually similar reports using AI.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={onReport} className="btn-primary">
                Report Item
              </button>
              <button type="button" onClick={onBrowse} className="btn-secondary">
                Browse Items
              </button>
            </div>
          </div>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
