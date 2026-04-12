/** Static preview snippets for selected high-impact ideas. */
const previewMap: Record<string, string> = {
  "validate-before-you-waste-time":
    'Example: "Meal prep delivery for remote workers" → 2/3 validation signals found, worth pursuing.',
  "underserved-niche-finder":
    'Example: Reddit search for "frustrated + personal finance" → 3 unresolved complaints with no good tools.',
  "build-a-simple-tool":
    'Example: "I track freelance invoices in a spreadsheet every week" → no good tool under $15/mo. That\'s your idea.',
};

export function getFeedPreview(id: string): string | null {
  return previewMap[id] ?? null;
}
