import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getMatchConfidenceStyle,
  getStoredRecentMatches,
  scoreToPercent,
} from "../services/api";

function MatchShowcaseCard({ match, index }) {
  const percent = scoreToPercent(match.score);
  const confidenceClass = getMatchConfidenceStyle(percent);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="card-interactive overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        {match.image_url ? (
          <img
            src={match.image_url}
            alt={match.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-content-faint">
            No image
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-lg px-2 py-1 text-xs font-semibold tabular-nums backdrop-blur-md ${confidenceClass}`}
        >
          {percent}%
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="truncate text-sm font-semibold text-content">{match.title}</h3>
        {match.location && (
          <p className="mt-1 truncate text-xs text-content-muted">{match.location}</p>
        )}

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-content-faint">
            <span>Confidence</span>
            <span className="tabular-nums text-content-muted">{percent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 + index * 0.05, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        </div>

        <Link
          to="/browse"
          className="btn-secondary mt-5 w-full !py-2 text-xs"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
}

export default function TopMatches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const stored = getStoredRecentMatches();
    const sorted = [...stored].sort(
      (a, b) => scoreToPercent(b.score) - scoreToPercent(a.score)
    );
    setMatches(sorted.slice(0, 4));
  }, []);

  return (
    <section className="section-pad border-b border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="section-title">Top AI Matches</h2>
          <p className="section-desc">
            Highest-confidence similarity matches from recent AI scans.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="glass-panel px-6 py-14 text-center">
            <p className="text-sm text-content-muted">
              No AI matches yet. Report an item to generate visual matches.
            </p>
            <Link to="/report" className="btn-primary mt-5 inline-flex">
              Report Item
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {matches.map((match, i) => (
              <MatchShowcaseCard key={`${match.id}-${i}`} match={match} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
