import { getMatchConfidenceStyle, scoreToPercent } from "../services/api";

export default function MatchCard({ match, featured = false }) {
  const percent = scoreToPercent(match.score);
  const isLost = match.type === "lost";
  const confidenceClass = getMatchConfidenceStyle(percent);

  return (
    <article
      className={`flex gap-3 rounded-md border p-3 transition-all duration-200 hover:scale-[1.01] ${
        featured
          ? "border-primary/30 bg-primary/[0.04]"
          : "border-white/[0.06] bg-surface-card hover:border-white/[0.1]"
      }`}
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface-elevated">
        {match.image_url ? (
          <img
            src={match.image_url}
            alt={match.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-content-faint">
            —
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-medium text-content">{match.title}</h3>
          <span className={isLost ? "badge-lost shrink-0" : "badge-found shrink-0"}>
            {isLost ? "Lost" : "Found"}
          </span>
        </div>

        {match.location && (
          <p className="mt-0.5 truncate text-xs text-content-muted">{match.location}</p>
        )}

        <span
          className={`mt-2 inline-block rounded px-1.5 py-0.5 text-xs font-medium tabular-nums ${confidenceClass}`}
        >
          {percent}% match
        </span>
      </div>
    </article>
  );
}
