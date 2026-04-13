/**
 * Client-side Pro access state.
 *
 * Priority order:
 * 1. Server check (Supabase subscription table, set by Stripe webhook)
 * 2. localStorage fallback (for immediate post-checkout activation)
 *
 * The server is the source of truth. localStorage is used as a
 * temporary cache so the UI responds instantly after checkout redirect.
 */

const STORAGE_KEY = "idea-income-pro";

interface ProState {
  active: boolean;
  email: string;
  activatedAt: number;
}

// -----------------------------------------------------------------------
// Server check (preferred)
// -----------------------------------------------------------------------

export async function checkProServer(): Promise<boolean> {
  try {
    const res = await fetch("/api/pro/status", { cache: "no-store" });
    if (!res.ok) return false;
    const data = await res.json();
    return data.pro === true;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------
// Combined check: server first, localStorage fallback
// -----------------------------------------------------------------------

export async function checkPro(): Promise<boolean> {
  // Try server first (source of truth)
  const serverPro = await checkProServer();
  if (serverPro) return true;

  // Fallback to localStorage (covers post-checkout before webhook fires)
  return isProLocal();
}

// -----------------------------------------------------------------------
// localStorage helpers (kept for immediate activation after redirect)
// -----------------------------------------------------------------------

export function isProLocal(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const state: ProState = JSON.parse(raw);
    return state.active === true;
  } catch {
    return false;
  }
}

export function activatePro(email: string): void {
  const state: ProState = {
    active: true,
    email,
    activatedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getProEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state: ProState = JSON.parse(raw);
    return state.email || null;
  } catch {
    return null;
  }
}

/** Dev only — reset pro state for testing */
export function resetPro(): void {
  localStorage.removeItem(STORAGE_KEY);
}
