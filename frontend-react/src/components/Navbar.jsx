export default function Navbar({ onReportClick }) {
  const links = [
    { href: "#home", label: "Home" },
    { href: "#lost-found", label: "Lost & Found" },
    { href: "#browse", label: "Browse Items" },
    { href: "#about", label: "About" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-navy-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet text-sm font-bold text-white shadow-glow">
            CS
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Campus<span className="gradient-accent">Sync</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button type="button" onClick={onReportClick} className="btn-primary !py-2.5 !px-4 text-xs sm:text-sm">
          Report Item
        </button>
      </nav>
    </header>
  );
}
