import { PriorityRating } from "./priority";

/** Static preview snippets for selected high-impact ideas. */

interface FeedPreview {
  text: string;
  priority: PriorityRating;
}

const previewMap: Record<string, FeedPreview> = {
  "validate-before-you-waste-time": {
    text: 'Example: "Meal prep delivery for remote workers" → 2/3 validation signals found, worth pursuing.',
    priority: "promising",
  },
  "underserved-niche-finder": {
    text: 'Example: Reddit search for "frustrated + personal finance" → 3 unresolved complaints with no good tools.',
    priority: "promising",
  },
  "build-a-simple-tool": {
    text: 'Example: "I track freelance invoices in a spreadsheet every week" → no good tool under $15/mo. That\'s your idea.',
    priority: "worth-testing",
  },
};

export function getFeedPreview(id: string): string | null {
  return previewMap[id]?.text ?? null;
}

export function getFeedPriority(id: string): PriorityRating | null {
  return previewMap[id]?.priority ?? null;
}
