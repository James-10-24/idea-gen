import { IdeaFeedItem } from "./types";
import { mockIdeas } from "./mockIdeas";
import { detectIdeaCategory } from "./finalization";

// ---------------------------------------------------------------------------
// Category adjacency map
// ---------------------------------------------------------------------------

const ADJACENT: Record<string, string[]> = {
  content: ["business", "validation"],
  business: ["content", "validation"],
  tool: ["business", "validation"],
  validation: ["business", "tool"],
  finance: ["validation", "tool"],
  general: ["content", "business"],
};

// ---------------------------------------------------------------------------
// Suggestion logic
// ---------------------------------------------------------------------------

/**
 * Returns 2-3 contextually relevant ideas based on the current idea's category.
 * Prioritizes same-category first, then adjacent categories.
 * Excludes the current idea.
 */
export function getSuggestions(
  currentIdeaId: string,
  limit = 3
): IdeaFeedItem[] {
  const currentCategory = detectIdeaCategory(currentIdeaId);
  const adjacent = ADJACENT[currentCategory] ?? ["content", "business"];

  // Score each idea by relevance
  const scored = mockIdeas
    .filter((idea) => idea.id !== currentIdeaId)
    .map((idea) => {
      const cat = detectIdeaCategory(idea.id);
      let score = 0;

      // Same category = highest relevance
      if (cat === currentCategory) score += 3;
      // Adjacent category = moderate relevance
      else if (adjacent.includes(cat)) score += 2;
      // Different category = low relevance
      else score += 1;

      // Boost $$$ ideas slightly (higher perceived value)
      if (idea.moneyTag === "$$$") score += 0.5;

      // Boost Low effort (easier next action)
      if (idea.effortTag === "Low") score += 0.3;

      return { idea, score };
    })
    .sort((a, b) => b.score - a.score);

  // Take top N, but ensure at least 1 from a different category for variety
  const result: IdeaFeedItem[] = [];
  let hasDifferent = false;

  for (const { idea } of scored) {
    if (result.length >= limit) break;
    const cat = detectIdeaCategory(idea.id);
    const isSame = cat === currentCategory;

    // If we have 2 same-category picks, force the next to be different
    if (result.length === limit - 1 && !hasDifferent && isSame) continue;

    result.push(idea);
    if (!isSame) hasDifferent = true;
  }

  return result;
}
