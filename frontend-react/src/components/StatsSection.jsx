import { useEffect, useState } from "react";
import { fetchItems, getStoredMatchCount } from "../services/api";

function StatCard({ label, value, loading, accent }) {
  const accents = {
    blue: "from-accent-blue/20 to-transparent ring-accent-blue/20",
    cyan: "from-accent-cyan/20 to-transparent ring-accent-cyan/20",
    violet: "from-accent-violet/20 to-transparent ring-accent-violet/20",
  };

  return (
    <div
      className={`glass group relative overflow-hidden rounded-2xl p-6 ring-1 transition-all hover:bg-white/[0.06] ${accents[accent]}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${accents[accent]} opacity-50`} />
      <div className="relative">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        {loading ? (
          <div className="mt-3 h-10 w-24 animate-pulse rounded-lg bg-white/10" />
        ) : (
          <p className="mt-2 text-4xl font-bold tracking-tight text-white">
            {value.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default function StatsSection({ refreshKey = 0 }) {
  const [stats, setStats] = useState({ lost: 0, found: 0, matches: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const items = await fetchItems();
        if (cancelled) return;
        const lost = items.filter((i) => i.type === "lost").length;
        const found = items.filter((i) => i.type === "found").length;
        const matches = getStoredMatchCount();
        setStats({ lost, found, matches });
      } catch (err) {
        if (!cancelled) setError(err.message);
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
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="section-heading">Platform Statistics</h2>
          <p className="section-sub mx-auto">
            Live counts from reported campus items and AI-generated matches.
          </p>
        </div>

        {error && (
          <p className="mb-6 text-center text-sm text-rose-400">
            Could not load stats: {error}. Is the backend running?
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          <StatCard label="Total Lost Items" value={stats.lost} loading={loading} accent="blue" />
          <StatCard label="Total Found Items" value={stats.found} loading={loading} accent="cyan" />
          <StatCard
            label="Total Matches Generated"
            value={stats.matches}
            loading={loading}
            accent="violet"
          />
        </div>
      </div>
    </section>
  );
}
