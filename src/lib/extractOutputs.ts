/**
 * Extracts key user-created values from filled artifact templates.
 *
 * Scans each artifact's template for lines where blanks (________) have been
 * replaced with actual user input. Prioritizes commitment choices, named
 * selections, and first meaningful filled fields.
 */

export interface ExtractedOutput {
  label: string;
  value: string;
  stepNumber: number;
}

interface Artifact {
  stepNumber: number;
  stepTitle: string;
  template: string;
}

// Patterns that indicate a commitment / selection line
const COMMITMENT_PATTERNS = [
  /I'm going with:\s*(.+)/i,
  /selected option:\s*(.+)/i,
  /best option[^:]*:\s*(.+)/i,
  /my pick:\s*(.+)/i,
  /chosen[^:]*:\s*(.+)/i,
  /verdict:\s*(.+)/i,
  /score:\s*(.+)/i,
];

// Patterns for key-value lines (label: value)
const KV_PATTERN = /^([^:]{3,30}):\s+(.+)$/;

// Values that are still blank or template placeholders
const BLANK_PATTERN = /^[_\s.\-…]*$|^YES\s*\/\s*NO$|^\(.*\)$/;

/**
 * Extract the most meaningful user-created values from artifacts.
 * Returns up to `limit` outputs, prioritized by importance.
 */
export function extractKeyOutputs(
  artifacts: Artifact[],
  limit = 6
): ExtractedOutput[] {
  const outputs: ExtractedOutput[] = [];

  for (const artifact of artifacts) {
    const lines = artifact.template.split("\n");

    // First pass: commitment/selection lines (highest priority)
    for (const line of lines) {
      for (const pattern of COMMITMENT_PATTERNS) {
        const match = line.match(pattern);
        if (match && match[1] && !BLANK_PATTERN.test(match[1].trim())) {
          outputs.push({
            label: extractLabel(pattern),
            value: match[1].trim(),
            stepNumber: artifact.stepNumber,
          });
        }
      }
    }

    // Second pass: key-value lines with filled values
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip numbered list prefixes
      const cleaned = trimmed.replace(/^\d+[\.\)]\s*/, "");
      const kvMatch = cleaned.match(KV_PATTERN);

      if (kvMatch) {
        const label = kvMatch[1].trim();
        const value = kvMatch[2].trim();

        // Skip if value is still a blank or generic
        if (BLANK_PATTERN.test(value)) continue;
        if (value.includes("________")) continue;
        if (value.length < 2) continue;

        // Skip meta labels
        const skipLabels = ["why this", "next steps", "source", "platform"];
        if (skipLabels.some((s) => label.toLowerCase().includes(s))) continue;

        outputs.push({ label, value, stepNumber: artifact.stepNumber });
      }
    }
  }

  // Deduplicate by value
  const seen = new Set<string>();
  const unique = outputs.filter((o) => {
    const key = o.value.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, limit);
}

function extractLabel(pattern: RegExp): string {
  const src = pattern.source;
  if (src.includes("going with")) return "Selected focus";
  if (src.includes("selected option")) return "Selected option";
  if (src.includes("best option")) return "Best option";
  if (src.includes("verdict")) return "Verdict";
  if (src.includes("score")) return "Score";
  if (src.includes("chosen")) return "Choice";
  if (src.includes("pick")) return "Pick";
  return "Selection";
}

/**
 * Format extracted outputs for the copy summary.
 */
export function formatOutputsForCopy(outputs: ExtractedOutput[]): string {
  if (outputs.length === 0) return "";
  const lines = outputs.map((o) => `  • ${o.label}: ${o.value}`);
  return `KEY OUTPUTS:\n${lines.join("\n")}`;
}
