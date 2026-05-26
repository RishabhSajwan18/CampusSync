import { useEffect, useState } from "react";
import { fetchItems, getStoredMatchCount } from "../services/api";

function StatCard({ label, value, loading }) {
  return (
    <div className="card flex flex-1 items-center justify-between px-4 py-3">
      <span className="text-xs text-content-muted">{label}</span>
      {loading ? (
        <span className="h-5 w-8 animate-pulse rounded bg-white/10" />
      ) : (
        <span className="text-lg font-semibold tabular-nums text-content">
          {value.toLocaleString()}
        </span>
      )}
    </div>
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
    <section className="border-b border-white/[0.06] py-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 sm:flex-row sm:gap-3 sm:px-6">
        <StatCard label="Items Reported" value={stats.reported} loading={loading} />
        <StatCard label="Matches Generated" value={stats.matches} loading={loading} />
        <StatCard label="Found Items" value={stats.found} loading={loading} />
      </div>
    </section>
  );
}
