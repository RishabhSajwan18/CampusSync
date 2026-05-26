const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

const MATCHES_STORAGE_KEY = "campusSync_totalMatches";

export function getStoredMatchCount() {
  const raw = localStorage.getItem(MATCHES_STORAGE_KEY);
  const n = parseInt(raw ?? "0", 10);
  return Number.isFinite(n) ? n : 0;
}

export function addToMatchCount(count) {
  const current = getStoredMatchCount();
  localStorage.setItem(MATCHES_STORAGE_KEY, String(current + (count || 0)));
}

export async function fetchItems() {
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch items");
  }
  return res.json();
}

export async function createItem(formData) {
  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail =
      typeof err.detail === "string"
        ? err.detail
        : Array.isArray(err.detail)
          ? err.detail.map((d) => d.msg).join(", ")
          : "Failed to upload item";
    throw new Error(detail);
  }

  const data = await res.json();
  if (data.total_matches > 0) {
    addToMatchCount(data.total_matches);
  }
  return data;
}

export function scoreToPercent(score) {
  if (score == null || Number.isNaN(score)) return 0;
  return Math.min(100, Math.round(score * 100));
}

export function getMatchConfidenceStyle(percent) {
  if (percent >= 90) return "text-emerald-400 bg-emerald-500/10";
  if (percent >= 70) return "text-primary bg-primary/10";
  if (percent >= 50) return "text-amber-400 bg-amber-500/10";
  return "text-content-muted bg-white/5";
}
