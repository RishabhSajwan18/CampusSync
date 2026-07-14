const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

const MATCHES_STORAGE_KEY = "campusSync_totalMatches";

function parseErrorDetail(err) {
  if (typeof err.detail === "string") return err.detail;
  if (Array.isArray(err.detail)) {
    return err.detail.map((d) => d.msg || String(d)).join(", ");
  }
  return null;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

function authHeaders(json = false) {
  const headers = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (json) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

export async function signup(name, email, password) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(parseErrorDetail(data) || "Signup failed");
  }
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(parseErrorDetail(data) || "Login failed");
  }
  return data;
}

export async function fetchMe() {
  const res = await fetch(`${API_BASE}/me`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(parseErrorDetail(data) || "Unauthorized");
  }
  return data;
}

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
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(parseErrorDetail(data) || "Failed to fetch items");
  }
  return data;
}

const RECENT_MATCHES_KEY = "campusSync_recentMatches";

export function getStoredRecentMatches() {
  try {
    const raw = localStorage.getItem(RECENT_MATCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function storeRecentMatches(matches) {
  if (!Array.isArray(matches) || matches.length === 0) return;
  const existing = getStoredRecentMatches();
  const merged = [...matches, ...existing]
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .slice(0, 8);
  localStorage.setItem(RECENT_MATCHES_KEY, JSON.stringify(merged));
}

export async function createItem(formData) {
  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(parseErrorDetail(data) || "Failed to upload item");
  }
  if (data.total_matches > 0) {
    addToMatchCount(data.total_matches);
  }
  if (data.possible_matches?.length) {
    storeRecentMatches(data.possible_matches);
  }
  return data;
}

export function scoreToPercent(score) {
  if (score == null || Number.isNaN(score)) return 0;
  // Backend may return 0–1 similarity or 0–100 percentage
  const n = Number(score);
  if (n > 1) return Math.min(100, Math.round(n));
  return Math.min(100, Math.round(n * 100));
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function getMatchConfidenceStyle(percent) {
  if (percent >= 90) return "text-emerald-400 bg-emerald-500/10";
  if (percent >= 70) return "text-primary bg-primary/10";
  if (percent >= 50) return "text-amber-400 bg-amber-500/10";
  return "text-content-muted bg-white/5";
}
