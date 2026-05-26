import { scoreToPercent } from "../services/api";

export default function MatchCard({ match, featured = false }) {
  const percent = scoreToPercent(match.score);
  const isLost = match.type === "lost";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
        featured
          ? "glass-strong ring-2 ring-accent-cyan/40 shadow-glow"
          : "glass hover:bg-white/[0.06] hover:shadow-glass"
      }`}
    >
      {featured && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue px-3 py-1 text-xs font-bold text-white shadow-glow">
          Best Match
        </div>
      )}

      <div className="aspect-[4/3] overflow-hidden bg-navy-800">
        {match.image_url ? (
          <img
            src={match.image_url}
            alt={match.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">
            No image
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white line-clamp-1">{match.title}</h3>
          <span className={isLost ? "badge-lost shrink-0" : "badge-found shrink-0"}>
            {isLost ? "Lost" : "Found"}
          </span>
        </div>

        {match.description && (
          <p className="mb-3 text-sm text-slate-400 line-clamp-2">{match.description}</p>
        )}

        {match.location && (
          <p className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {match.location}
          </p>
        )}

        <div
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold ${
            featured
              ? "bg-accent-cyan/15 text-accent-cyan"
              : "bg-white/5 text-slate-300"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          {percent}% Match
        </div>
      </div>
    </article>
  );
}
