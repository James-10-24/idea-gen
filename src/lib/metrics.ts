/**
 * Lightweight local interaction tracking for dev testing.
 *
 * Stores per-idea metrics in localStorage (dev only).
 * No external analytics, no backend, no cookies.
 *
 * Shape:
 *   { [ideaId]: { impressions, clicks, starts, step2Plus } }
 */

const STORAGE_KEY = "idea-income-metrics";

export interface IdeaMetrics {
  impressions: number;
  clicks: number;
  starts: number;
  step2Plus: number;
}

export type AllMetrics = Record<string, IdeaMetrics>;

function emptyMetrics(): IdeaMetrics {
  return { impressions: 0, clicks: 0, starts: 0, step2Plus: 0 };
}

// ---------------------------------------------------------------------------
// Read / write
// ---------------------------------------------------------------------------

export function loadMetrics(): AllMetrics {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AllMetrics) : {};
  } catch {
    return {};
  }
}

function saveMetrics(m: AllMetrics): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(m));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

// ---------------------------------------------------------------------------
// Increment helpers
// ---------------------------------------------------------------------------

function increment(ideaId: string, field: keyof IdeaMetrics): void {
  const all = loadMetrics();
  if (!all[ideaId]) all[ideaId] = emptyMetrics();
  all[ideaId][field]++;
  saveMetrics(all);
}

/** Card rendered in feed */
export function trackImpression(ideaId: string): void {
  increment(ideaId, "impressions");
}

/** User tapped card → navigated to detail page */
export function trackClick(ideaId: string): void {
  increment(ideaId, "clicks");
}

/** User triggered "Start this" (step 1 generated) */
export function trackStart(ideaId: string): void {
  increment(ideaId, "starts");
}

/** User generated step 2 or beyond */
export function trackStep2Plus(ideaId: string): void {
  increment(ideaId, "step2Plus");
}

// ---------------------------------------------------------------------------
// Query helpers (for DevDebug)
// ---------------------------------------------------------------------------

export function getMetricsForIdea(ideaId: string): IdeaMetrics {
  const all = loadMetrics();
  return all[ideaId] ?? emptyMetrics();
}

/** All ideas sorted by a given field descending. */
export function getTopIdeas(
  sortBy: keyof IdeaMetrics = "clicks",
  limit = 13
): Array<{ id: string; metrics: IdeaMetrics }> {
  const all = loadMetrics();
  return Object.entries(all)
    .map(([id, metrics]) => ({ id, metrics }))
    .sort((a, b) => b.metrics[sortBy] - a.metrics[sortBy])
    .slice(0, limit);
}

/** Clear all metrics (dev convenience) */
export function resetMetrics(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
