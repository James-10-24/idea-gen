import { StepOutcome } from "./types";

// ---------------------------------------------------------------------------
// Shareable session — serialized into a URL query param
// ---------------------------------------------------------------------------

/** Compact representation of a session for URL sharing. */
export interface SharedSession {
  /** Completed step titles + instructions + outcomes */
  s: Array<{
    t: string; // stepTitle
    i: string; // instruction
    m: string; // template
    o: StepOutcome | null;
    d: boolean; // done
  }>;
  /** Current step (the one the user is on) */
  c: {
    t: string;
    i: string;
    m: string;
  } | null;
  /** Current step number */
  n: number;
}

interface CompletedStep {
  stepTitle: string;
  instruction: string;
  done: boolean;
  outcome: StepOutcome | null;
}

interface Artifact {
  stepNumber: number;
  stepTitle: string;
  template: string;
  outcome: StepOutcome | null;
}

interface CurrentStep {
  stepTitle: string;
  instruction: string;
  template: string;
}

// ---------------------------------------------------------------------------
// Encode
// ---------------------------------------------------------------------------

export function encodeSession(
  completedSteps: CompletedStep[],
  artifacts: Artifact[],
  currentStep: CurrentStep | null,
  stepNumber: number
): string {
  // Merge completed steps with their artifact templates
  const templateMap = new Map<number, string>();
  for (const a of artifacts) {
    templateMap.set(a.stepNumber, a.template);
  }

  const session: SharedSession = {
    s: completedSteps.map((step, i) => ({
      t: step.stepTitle,
      i: step.instruction,
      m: templateMap.get(i + 1) ?? "",
      o: step.outcome,
      d: step.done,
    })),
    c: currentStep
      ? { t: currentStep.stepTitle, i: currentStep.instruction, m: currentStep.template }
      : null,
    n: stepNumber,
  };

  const json = JSON.stringify(session);
  // Use base64url (no + / =) for safe URL embedding
  const b64 = btoa(json)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return b64;
}

// ---------------------------------------------------------------------------
// Decode
// ---------------------------------------------------------------------------

export interface DecodedSession {
  completedSteps: CompletedStep[];
  artifacts: Artifact[];
  currentStep: CurrentStep | null;
  stepNumber: number;
}

export function decodeSession(encoded: string): DecodedSession | null {
  try {
    // Restore standard base64
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding
    while (b64.length % 4) b64 += "=";

    const json = atob(b64);
    const session: SharedSession = JSON.parse(json);

    // Validate shape
    if (!Array.isArray(session.s) || typeof session.n !== "number") {
      return null;
    }

    const completedSteps: CompletedStep[] = session.s.map((s) => ({
      stepTitle: s.t ?? "",
      instruction: s.i ?? "",
      done: !!s.d,
      outcome: s.o ?? null,
    }));

    const artifacts: Artifact[] = session.s.map((s, i) => ({
      stepNumber: i + 1,
      stepTitle: s.t ?? "",
      template: s.m ?? "",
      outcome: s.o ?? null,
    }));

    const currentStep = session.c
      ? { stepTitle: session.c.t, instruction: session.c.i, template: session.c.m }
      : null;

    return {
      completedSteps,
      artifacts,
      currentStep,
      stepNumber: session.n,
    };
  } catch {
    return null;
  }
}
