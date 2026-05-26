import { useEffect, useMemo, useState } from "react";
import { fetchItems } from "../services/api";

function BrowseCard({ item }) {
  return (
    <article className="card overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:border-white/[0.1]">
      <div className="aspect-[16/10] overflow-hidden bg-surface-elevated">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-content-faint">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-content">{item.title}</h3>
        {item.location && (
          <p className="mt-0.5 truncate text-xs text-content-muted">{item.location}</p>
        )}
        {item.created_at && (
          <p className="mt-2 text-[11px] text-content-faint">
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
    <section id="browse" className="border-t border-white/[0.06] py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-title">Browse Items</h2>
            <p className="section-desc">All reported lost and found items on campus.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="input-field sm:w-48"
            />
            <div className="segmented w-fit">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`segmented-btn !flex-none px-3 ${
                    filter === f.id ? "segmented-btn-active" : "segmented-btn-inactive"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-rose-400">Could not load items: {error}</p>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="card h-48 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card py-10 text-center">
            <p className="text-sm text-content-muted">No items found</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <BrowseCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
