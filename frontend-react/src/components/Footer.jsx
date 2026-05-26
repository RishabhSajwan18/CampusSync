export default function Footer() {
  return (
    <footer id="about" className="mt-auto border-t border-white/[0.06]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 text-sm sm:grid-cols-3">
          <div>
            <p className="font-medium text-content">CampusSync</p>
            <p className="mt-1 text-xs leading-relaxed text-content-muted">
              Campus lost &amp; found with AI image matching for students.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-content-muted">About</p>
            <ul className="mt-2 space-y-1 text-xs text-content-faint">
              <li>Web Development PBL Project</li>
              <li>Made by TEAM RSP²</li>
              <li>CLIP embeddings · pgvector</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-content-muted">Contact</p>
            <ul className="mt-2 space-y-1 text-xs text-content-faint">
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
        <p className="mt-6 text-[11px] text-content-faint">
          © {new Date().getFullYear()} CampusSync
        </p>
      </div>
    </footer>
  );
}
