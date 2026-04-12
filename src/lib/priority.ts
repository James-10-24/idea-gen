import { IdeaValidation } from "./types";

export type PriorityRating = "promising" | "worth-testing" | "weak";

export interface PriorityResult {
  rating: PriorityRating;
  label: string;
  explanation: string;
}

// ---------------------------------------------------------------------------
// Keyword scoring
// ---------------------------------------------------------------------------

const strongPositive = [
  "high", "very high", "strong", "massive", "booming", "growing",
  "clear", "real demand", "consistently", "recurring", "proven",
];

const weakNegative = [
  "fragmented", "saturated", "crowded", "uncertain", "unclear",
  "weak", "limited", "niche", "hard to gauge", "generic",
  "vague", "low", "declining",
];

const monetisationPositive = [
  "subscription", "affiliate", "freemium", "per lead", "per conversion",
  "$", "revenue", "charge", "premium", "upsell", "recurring",
];

function scoreField(text: string, positive: string[], negative: string[]): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of positive) {
    if (lower.includes(kw)) score++;
  }
  for (const kw of negative) {
    if (lower.includes(kw)) score--;
  }
  return score;
}

// ---------------------------------------------------------------------------
// Rating logic
// ---------------------------------------------------------------------------

export function computePriority(validation: IdeaValidation): PriorityResult {
  const demandScore = scoreField(validation.demand, strongPositive, weakNegative);
  const compScore = scoreField(validation.competition, strongPositive, weakNegative);
  const monScore = scoreField(validation.monetisation, monetisationPositive, weakNegative);

  // Competition: negative keywords are actually positive (gap = good)
  // Reinterpret: "crowded" is bad, "gap" / "whitespace" / "room" is good
  const compGapBonus = /gap|whitespace|room|underserved|open|thin|novel/i.test(validation.competition) ? 2 : 0;
  const adjustedComp = compScore + compGapBonus;

  const total = demandScore + adjustedComp + monScore;

  if (total >= 3) {
    return {
      rating: "promising",
      label: "Promising",
      explanation: "Clear demand and a realistic path to revenue.",
    };
  }

  if (total >= 0) {
    return {
      rating: "worth-testing",
      label: "Worth testing",
      explanation: "Mixed signals — worth a quick test before committing.",
    };
  }

  return {
    rating: "weak",
    label: "Weak",
    explanation: "Too vague or crowded right now.",
  };
}

// ---------------------------------------------------------------------------
// Visual helpers
// ---------------------------------------------------------------------------

export function priorityColor(rating: PriorityRating): string {
  switch (rating) {
    case "promising":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/10";
    case "worth-testing":
      return "bg-amber-50 text-amber-700 ring-amber-600/10";
    case "weak":
      return "bg-zinc-100 text-zinc-500 ring-zinc-300/20";
  }
}

export function priorityDot(rating: PriorityRating): string {
  switch (rating) {
    case "promising":
      return "bg-emerald-500";
    case "worth-testing":
      return "bg-amber-500";
    case "weak":
      return "bg-zinc-400";
  }
}
