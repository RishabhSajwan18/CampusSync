import { useEffect, useMemo, useState } from "react";
import { fetchItems } from "../services/api";

function BrowseCard({ item }) {
  const isLost = item.type === "lost";

  return (
    <article className="glass group overflow-hidden rounded-2xl transition-all hover:bg-white/[0.06] hover:shadow-glass">
      <div className="aspect-[4/3] overflow-hidden bg-navy-800">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-600">No image</div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white line-clamp-1">{item.title}</h3>
          <span className={isLost ? "badge-lost shrink-0" : "badge-found shrink-0"}>
            {isLost ? "Lost" : "Found"}
          </span>
        </div>
        {item.description && (
          <p className="mb-3 text-sm text-slate-400 line-clamp-2">{item.description}</p>
        )}
        {item.location && (
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {item.location}
          </p>
        )}
        {item.created_at && (
          <p className="mt-3 text-xs text-slate-600">
            {new Date(item.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </article>
  );
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "lost", label: "Lost" },
  { id: "found", label: "Found" },
];

export default function BrowseSection({ refreshKey = 0 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchItems();
        if (!cancelled) setItems(data);
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== "all" && item.type !== filter) return false;
      if (!q) return true;
      return (
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      );
    });
  }, [items, search, filter]);

  return (
    <section id="browse" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-heading">Browse Items</h2>
            <p className="section-sub">
              Search and filter all lost and found reports on campus.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                className="input-field w-full pl-10 sm:w-64"
              />
            </div>

            <div className="flex rounded-xl bg-navy-900/80 p-1 ring-1 ring-white/10">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    filter === f.id
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="mb-6 text-center text-sm text-rose-400">
            Could not load items: {error}
          </p>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass h-80 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl py-16 text-center">
            <p className="text-lg font-medium text-slate-400">No items found</p>
            <p className="mt-2 text-sm text-slate-600">
              {items.length === 0
                ? "Be the first to report a lost or found item."
                : "Try adjusting your search or filter."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <BrowseCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
