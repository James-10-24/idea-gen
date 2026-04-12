import { StartThisOutput, StepOutcome } from "./types";

const STORAGE_KEY = "idea-income-last-session";

// ---------------------------------------------------------------------------
// Shape
// ---------------------------------------------------------------------------

export interface SavedCompletedStep {
  stepTitle: string;
  instruction: string;
  done: boolean;
  outcome: StepOutcome | null;
}

export interface SavedArtifact {
  stepNumber: number;
  stepTitle: string;
  template: string;
  outcome: StepOutcome | null;
}

export interface SavedSession {
  ideaId: string;
  ideaTitle: string;
  stepNumber: number;
  currentStep: StartThisOutput | null;
  completedSteps: SavedCompletedStep[];
  artifacts: SavedArtifact[];
  savedAt: number; // timestamp
}

// ---------------------------------------------------------------------------
// Save
// ---------------------------------------------------------------------------

export function saveSession(session: Omit<SavedSession, "savedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const data: SavedSession = { ...session, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

export function loadSavedSession(): SavedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavedSession;
    // Basic validation
    if (!data.ideaId || typeof data.ideaId !== "string") return null;
    if (!Array.isArray(data.completedSteps)) return null;
    if (typeof data.stepNumber !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Clear
// ---------------------------------------------------------------------------

export function clearSavedSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function hasSavedSession(): boolean {
  return loadSavedSession() !== null;
}
