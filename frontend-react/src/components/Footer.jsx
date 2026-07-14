export default function Footer() {
  return (
    <footer id="about" className="mt-auto border-t border-white/[0.06] bg-surface-card/30">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div>
            <p className="text-base font-semibold text-content">CampusSync</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-content-muted">
              Campus lost &amp; found with AI image matching for students.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-content-muted transition-all hover:border-primary/30 hover:text-content"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
              </a>
              <a
                href="mailto:rishabhsajwan18@gmail.com"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-content-muted transition-all hover:border-primary/30 hover:text-content"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-content-muted">
              About
            </p>
            <ul className="mt-3 space-y-2 text-sm text-content-faint">
              <li>Web Development PBL Project</li>
              <li>Made by TEAM RSP²</li>
              <li>CLIP embeddings · pgvector</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-content-muted">
              Contact
            </p>
            <ul className="mt-3 space-y-2 text-sm text-content-faint">
              <li>
                <a
                  href="mailto:rishabhsajwan18@gmail.com"
                  className="transition-colors hover:text-content"
                >
                  rishabhsajwan18@gmail.com
                </a>
              </li>
              <li>Graphic Era Hill University</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-content-faint">
            © {new Date().getFullYear()} CampusSync
          </p>
          <p className="text-xs text-content-faint">AI Campus Lost &amp; Found</p>
        </div>
      </div>
    </footer>
  );
}
