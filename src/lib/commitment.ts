import { StartThisOutput } from "./types";
import { detectIdeaCategory } from "./finalization";

/**
 * Detects whether a step produced multiple OPTIONS that need commitment
 * before deeper work begins.
 *
 * Key distinction:
 * - OPTIONS = alternatives to choose between (keywords, niches, ideas)
 * - OUTPUT = sequential/structural content (tweets, steps, bullets)
 *
 * Content-category ideas never trigger commitment because their lists
 * are output, not choices.
 */

// Patterns that indicate CHOICE-type lists (pick one)
const CHOICE_PATTERNS = [
  /option\s*\d/i,        // "Option 1"
  /keyword\s*\d/i,       // "Keyword 1"
  /idea\s*\d/i,          // "Idea 1"
  /niche\s*#?\d/i,       // "Niche #1"
  /candidate\s*\d/i,     // "Candidate 1"
  /competitor\s*\d/i,    // "Competitor 1"
  /problem\s*\d/i,       // "Problem 1"
  /complaint\s*\d/i,     // "Complaint 1"
  /subject\s*line\s*(option\s*)?\d/i, // "Subject line option 1"
];

// Patterns that indicate OUTPUT-type lists (don't trigger commitment)
const OUTPUT_PATTERNS = [
  /tweet\s*\d/i,         // "Tweet 1"
  /post\s*\d/i,          // "Post 1"
  /slide\s*\d/i,         // "Slide 1"
  /point\s*\d/i,         // "Point 1"
  /bullet\s*\d/i,        // "Bullet 1"
  /section\s*\d/i,       // "Section 1"
  /paragraph\s*\d/i,     // "Paragraph 1"
  /hook/i,               // Contains "hook" — it's a post draft
  /cta/i,                // Contains "CTA" — it's a post draft
  /follow.?up/i,         // "Follow-up" — sequential action
];

interface CommitmentContext {
  template: string;
  ideaId: string;
  alreadyCommitted: boolean;
}

export function needsCommitment(ctx: CommitmentContext): boolean {
  const { template, ideaId, alreadyCommitted } = ctx;

  // Max 1 commitment per session
  if (alreadyCommitted) return false;

  // Content-category ideas never trigger — their lists are output
  const category = detectIdeaCategory(ideaId);
  if (category === "content") return false;

  // Check for output patterns first — if present, this is a build step
  for (const p of OUTPUT_PATTERNS) {
    if (p.test(template)) return false;
  }

  // Check for explicit choice patterns
  let choiceHits = 0;
  for (const p of CHOICE_PATTERNS) {
    const matches = template.match(new RegExp(p.source, "gi"));
    if (matches && matches.length >= 2) choiceHits++;
  }
  if (choiceHits >= 1) return true;

  // Check for numbered lines — but only if they look like alternatives
  const lines = template.split("\n").filter((l) => l.trim());
  const numberedLines = lines.filter((l) => /^\s*\d+[\.\)]\s/.test(l));

  if (numberedLines.length >= 3) {
    // Check if the numbered lines contain blanks (fillable = choices)
    const blanksInNumbered = numberedLines.filter((l) => /_{4,}/.test(l));
    // If most numbered lines have blanks, these are options to fill & choose from
    if (blanksInNumbered.length >= 2) return true;

    // If numbered lines are short labels without blanks, they might be structure
    // Only trigger if they look like distinct alternatives
    const avgLength = numberedLines.reduce((s, l) => s + l.length, 0) / numberedLines.length;
    if (avgLength < 40) return true; // Short items = likely options
  }

  return false;
}

/**
 * Generate a commitment step that asks the user to pick one direction.
 */
export function buildCommitmentStep(
  previousStepTitle: string,
  filledValues?: Record<number, string>
): StartThisOutput {
  const filledOptions = filledValues
    ? Object.values(filledValues).filter((v) => v.trim().length > 0)
    : [];

  let template: string;

  if (filledOptions.length >= 2) {
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
