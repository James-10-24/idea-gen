const STORAGE_KEY = "idea-income-onboarding-seen";

/** The recommended first idea — content is the strongest "wow" category. */
export const RECOMMENDED_IDEA_ID = "explain-anything-simply";

export function hasSeenOnboarding(): boolean {
  if (typeof window === "undefined") return true; // SSR safe
  return localStorage.getItem(STORAGE_KEY) === "1";
}

export function markOnboardingSeen(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, "1");
}

export function resetOnboarding(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
