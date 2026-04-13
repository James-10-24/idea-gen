/**
 * Client-side Pro access state.
 *
 * For this MVP, paid state is stored in localStorage after
 * successful Stripe checkout redirect. This is NOT secure —
 * a determined user could set it manually. That's fine for now.
 *
 * When auth is added later, replace this with a server-side
 * check against the Stripe customer/subscription status.
 */

const STORAGE_KEY = "idea-income-pro";

interface ProState {
  active: boolean;
  email: string;
  activatedAt: number;
}

export function isPro(): boolean {
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
