import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchItems, formatRelativeTime } from "../services/api";

function ItemCard({ item, index }) {
  const isLost = item.type === "lost";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="card-interactive overflow-hidden"
    >
      <div className="aspect-[16/10] overflow-hidden bg-surface-elevated">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-content-faint">
            No image
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-content">{item.title}</h3>
          <span className={isLost ? "badge-lost shrink-0" : "badge-found shrink-0"}>
            {isLost ? "Lost" : "Found"}
          </span>
        </div>
        {item.location && (
          <p className="flex items-center gap-1.5 truncate text-xs text-content-muted">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.location}
          </p>
        )}
        <p className="mt-3 text-[11px] text-content-faint">
          {formatRelativeTime(item.created_at)}
        </p>
      </div>
    </motion.article>
  );
}

export default function RecentItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchItems();
        if (cancelled) return;
        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setItems(sorted.slice(0, 8));
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section-pad border-b border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Recently Reported Items</h2>
            <p className="section-desc">
              Latest lost and found reports from across campus.
            </p>
          </div>
          <Link to="/browse" className="btn-secondary w-fit text-xs sm:text-sm">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="card h-56 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="glass-panel px-6 py-14 text-center">
            <p className="text-sm text-content-muted">No items reported yet.</p>
            <Link to="/report" className="btn-primary mt-5 inline-flex">
              Report the first item
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
