/**
 * Lightweight session stats for return hooks.
 * Tracks completed sessions (finalized) in localStorage.
 */

const STORAGE_KEY = "idea-income-stats";

export interface SessionStats {
  lastSessionDate: number; // timestamp
  totalSessions: number;
  totalOutputs: number; // finalized sessions
}

const empty: SessionStats = {
  lastSessionDate: 0,
  totalSessions: 0,
  totalOutputs: 0,
};

// ---------------------------------------------------------------------------
// Read / write
// ---------------------------------------------------------------------------

export function loadStats(): SessionStats {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const data = JSON.parse(raw) as SessionStats;
    if (typeof data.totalSessions !== "number") return empty;
    return data;
  } catch {
    return empty;
  }
}

function saveStats(stats: SessionStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage full or unavailable
  }
}

// ---------------------------------------------------------------------------
// Record events
// ---------------------------------------------------------------------------

/** Called when user completes a finalization step. */
export function recordFinalization(): void {
  const stats = loadStats();
  stats.lastSessionDate = Date.now();
  stats.totalSessions++;
  stats.totalOutputs++;
  saveStats(stats);
}

// ---------------------------------------------------------------------------
// Return message logic
// ---------------------------------------------------------------------------

export interface ReturnMessage {
  headline: string;
  subtext: string;
}

export function getReturnMessage(stats: SessionStats): ReturnMessage | null {
  if (stats.totalOutputs === 0) return null;

  const now = Date.now();
  const diff = now - stats.lastSessionDate;
  const hours = diff / (1000 * 60 * 60);
  const days = Math.floor(hours / 24);

  let headline: string;

  if (hours < 12) {
    headline = "Back for another one?";
  } else if (days < 1) {
    headline = "You built something earlier today.";
  } else if (days === 1) {
    headline = "You built something yesterday.";
  } else if (days <= 5) {
    headline = `It's been ${days} days — ready to build something?`;
  } else {
    headline = "Ready to pick up where you left off?";
  }

  const subtext =
    stats.totalOutputs === 1
      ? "You've created 1 output so far. Want to do another 10-minute session?"
      : `You've created ${stats.totalOutputs} outputs so far. Want to do another?`;

  return { headline, subtext };
}

// ---------------------------------------------------------------------------
// Usage limit
// ---------------------------------------------------------------------------

const FREE_LIMIT = 3;

export function isAtLimit(stats?: SessionStats): boolean {
  const s = stats ?? loadStats();
  return s.totalOutputs >= FREE_LIMIT;
}

export function outputsRemaining(stats?: SessionStats): number {
  const s = stats ?? loadStats();
  return Math.max(0, FREE_LIMIT - s.totalOutputs);
}

export const FREE_LIMIT_COUNT = FREE_LIMIT;

/** Clear stats (dev convenience) */
export function resetStats(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
