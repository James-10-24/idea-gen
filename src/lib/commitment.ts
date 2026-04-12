import { StartThisOutput } from "./types";

/**
 * Detects whether a step produced multiple options that need commitment
 * before deeper work begins.
 *
 * Looks for numbered list patterns like:
 *   "1. Keyword: ________"
 *   "Option 1: ________"
 *   "Niche #1: ________"
 *
 * If 3+ similar numbered items are found, it's a list step.
 */

const LIST_PATTERNS = [
  /^\d+\.\s/m,           // "1. something"
  /^#\d+/m,              // "#1 something"
  /option\s*\d/i,        // "Option 1"
  /keyword\s*\d/i,       // "Keyword 1"
  /idea\s*\d/i,          // "Idea 1"
  /niche\s*#?\d/i,       // "Niche #1"
  /candidate\s*\d/i,     // "Candidate 1"
  /competitor\s*\d/i,    // "Competitor 1"
  /problem\s*\d/i,       // "Problem 1"
  /complaint\s*\d/i,     // "Complaint 1"
  /group\s*\d/i,         // "Group 1"
  /profile\s*\d/i,       // "Profile 1"
  /person\s*\d/i,        // "Person 1"
  /subject\s*line\s*(option\s*)?\d/i, // "Subject line option 1"
];

export function needsCommitment(template: string): boolean {
  // Count numbered items (lines starting with "N." pattern)
  const lines = template.split("\n").filter((l) => l.trim());
  const numberedLines = lines.filter((l) => /^\s*\d+[\.\)]\s/.test(l));
  if (numberedLines.length >= 3) return true;

  // Check for other list patterns
  let patternHits = 0;
  for (const p of LIST_PATTERNS) {
    const matches = template.match(new RegExp(p.source, "gi"));
    if (matches && matches.length >= 2) patternHits++;
  }

  return patternHits >= 1;
}

/**
 * Generate a commitment step that asks the user to pick one direction.
 *
 * @param previousStepTitle - title of the step that generated the list
 * @param filledValues - filled template values from the list step (optional, for context)
 */
export function buildCommitmentStep(
  previousStepTitle: string,
  filledValues?: Record<number, string>
): StartThisOutput {
  // Extract any filled values to show as options
  const filledOptions = filledValues
    ? Object.values(filledValues).filter((v) => v.trim().length > 0)
    : [];

  let template: string;

  if (filledOptions.length >= 2) {
    // Show the user's own entries to pick from
    const optionLines = filledOptions
      .slice(0, 5)
      .map((v, i) => `${i + 1}. ${v}`)
      .join("\n");
    template = `Your options:\n${optionLines}\n\nI'm going with: ________\nWhy this one: ________`;
  } else {
    template = `Best option from the list: ________\nWhy this one: ________`;
  }

  return {
    stepTitle: "Pick your focus",
    instruction: `Review what you found in "${previousStepTitle}". Choose the ONE option with the strongest signal — the one you'd bet 10 minutes on right now. Don't overthink it.`,
    template,
  };
}
