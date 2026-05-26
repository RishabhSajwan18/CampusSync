export default function Hero({ onReportLost, onBrowse }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-hero-mesh" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-0 h-[300px] w-[400px] rounded-full bg-accent-violet/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
            </span>
            AI image similarity matching
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="gradient-text">AI Powered</span>
            <br />
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Campus Lost & Found
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            Upload lost or found items and instantly discover matching reports
            using AI image similarity.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button type="button" onClick={onReportLost} className="btn-primary w-full sm:w-auto">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Report Lost Item
            </button>
            <button type="button" onClick={onBrowse} className="btn-secondary w-full sm:w-auto">
              Browse Items
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl animate-float">
          <div className="glass-strong overflow-hidden rounded-2xl p-1 shadow-glass">
            <div className="grid gap-px rounded-xl bg-white/5 sm:grid-cols-3">
              {[
                { label: "Upload", desc: "Photo + details" },
                { label: "AI Scan", desc: "Embedding match" },
                { label: "Discover", desc: "Similar items" },
              ].map((step, i) => (
                <div
                  key={step.label}
                  className="flex flex-col items-center gap-2 bg-navy-900/80 px-6 py-8 text-center"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-violet/20 text-sm font-bold text-accent-cyan ring-1 ring-white/10">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-white">{step.label}</span>
                  <span className="text-xs text-slate-500">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
