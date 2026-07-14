import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchItems, getStoredMatchCount } from "../services/api";

const STATS = [
  {
    key: "reported",
    label: "Items Reported",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: "matches",
    label: "Matches Generated",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: "found",
    label: "Found Items",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

function StatCard({ label, value, loading, icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="glass-panel group flex flex-1 flex-col gap-4 p-6 sm:p-7"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
          {icon}
        </span>
        {loading ? (
          <span className="h-8 w-12 animate-pulse rounded-lg bg-white/10" />
        ) : (
          <span className="text-3xl font-semibold tabular-nums tracking-tight text-content">
            {value.toLocaleString()}
          </span>
        )}
      </div>
      <span className="text-sm text-content-muted">{label}</span>
    </motion.div>
  );
}

export default function StatsSection({ refreshKey = 0 }) {
  const [stats, setStats] = useState({ reported: 0, matches: 0, found: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const items = await fetchItems();
        if (cancelled) return;
        const found = items.filter((i) => i.type === "found").length;
        setStats({
          reported: items.length,
          matches: getStoredMatchCount(),
          found,
        });
      } catch {
        /* stats fail silently */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <section className="section-pad border-b border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="section-title">Campus activity</h2>
          <p className="section-desc">Live counts from reports and AI matches across campus.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {STATS.map((s, i) => (
            <StatCard
              key={s.key}
              label={s.label}
              value={stats[s.key]}
              loading={loading}
              icon={s.icon}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
