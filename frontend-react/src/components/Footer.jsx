export default function Footer() {
  return (
    <footer id="about" className="border-t border-white/[0.06] bg-navy-900/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet text-sm font-bold text-white">
                CS
              </span>
              <span className="text-lg font-bold text-white">CampusSync</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              AI-powered campus lost & found. Upload items, get instant visual
              similarity matches, and help reunite belongings with their owners.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              About
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>Web Development PBL Project</li>
              <li>Made by TEAM RSP²</li>
              <li>CLIP-based image embeddings</li>
              <li>PostgreSQL + pgvector similarity search</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <a href="mailto:rishabhsajwan18@gmail.com" className="transition-colors hover:text-white">
                  rishabhsajwan18@gmail.com
                </a>
              </li>
              <li>Graphic Era Hill University</li>
              <li>Main building, CR 101</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} CampusSync. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Project: AI Campus Lost & Found System · FastAPI + React
          </p>
        </div>
      </div>
    </footer>
  );
}
