export default function Navbar({ onReportClick }) {
  const links = [
    { href: "#home", label: "Home" },
    { href: "#lost-found", label: "Report Item", onClick: onReportClick },
    { href: "#browse", label: "Browse" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a href="#home" className="text-sm font-semibold text-content">
          CampusSync
        </a>

        <div className="hidden items-center gap-6 sm:flex">
          {links.map((link) =>
            link.onClick ? (
              <button
                key={link.label}
                type="button"
                onClick={link.onClick}
                className="text-sm text-content-muted transition-colors duration-200 hover:text-content"
              >
                {link.label}
              </button>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-content-muted transition-colors duration-200 hover:text-content"
              >
                {link.label}
              </a>
            )
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          AI Matching Active
        </span>
      </nav>
    </header>
  );
}
