"use client";

import { useCallback } from "react";

/**
 * Parses a template string and replaces ________ blanks with inline inputs.
 *
 * Template format:
 *   "Keyword: ________ → Search volume: ________"
 *   → renders as: "Keyword: [input] → Search volume: [input]"
 *
 * Each blank is identified by its index (0, 1, 2...) across the entire template.
 */

const BLANK_PATTERN = /_{4,}/g; // 4+ underscores = a blank

interface EditableTemplateProps {
  template: string;
  values: Record<number, string>; // blank index → value
  onChange: (values: Record<number, string>) => void;
  expanded: boolean;
  previewLines: number;
  /** Indices of key fields to visually highlight (for "Make this yours" nudge). */
  highlightIndices?: number[];
}

interface TemplatePart {
  type: "text" | "blank";
  content: string; // text content or blank placeholder
  blankIndex?: number;
}

function parseTemplate(template: string): TemplatePart[] {
  const parts: TemplatePart[] = [];
  let blankIndex = 0;
  let lastIndex = 0;

  let match;
  const regex = new RegExp(BLANK_PATTERN.source, "g");

  while ((match = regex.exec(template)) !== null) {
    // Text before this blank
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: template.slice(lastIndex, match.index) });
    }
    // The blank itself
    parts.push({ type: "blank", content: match[0], blankIndex });
    blankIndex++;
    lastIndex = regex.lastIndex;
  }

  // Remaining text after last blank
  if (lastIndex < template.length) {
    parts.push({ type: "text", content: template.slice(lastIndex) });
  }

  return parts;
}

/** Count blanks in template text up to a line limit. */
function countBlanksInLines(template: string, maxLines: number): number {
  const lines = template.split("\n").filter((l) => l.trim() !== "");
  const visible = lines.slice(0, maxLines).join("\n");
  const matches = visible.match(new RegExp(BLANK_PATTERN.source, "g"));
  return matches ? matches.length : 0;
}

export default function EditableTemplate({
  template,
  values,
  onChange,
  expanded,
  previewLines,
  highlightIndices,
}: EditableTemplateProps) {
  const handleChange = useCallback(
    (blankIndex: number, value: string) => {
      onChange({ ...values, [blankIndex]: value });
    },
    [values, onChange]
  );

  // Determine which portion of the template to render
  const lines = template.split("\n").filter((l) => l.trim() !== "");
  const needsCollapse = lines.length > previewLines;
  const visibleTemplate = expanded
    ? template
    : lines.slice(0, previewLines).join("\n");

  // How many blanks are hidden (for collapsed state)
  const totalBlanks = (template.match(new RegExp(BLANK_PATTERN.source, "g")) || []).length;
  const visibleBlanks = expanded ? totalBlanks : countBlanksInLines(template, previewLines);

  const parts = parseTemplate(visibleTemplate);

  return (
    <div className="rounded-xl bg-zinc-50 p-3 font-sans text-[13px] leading-[1.8] text-zinc-600">
      {parts.map((part, i) => {
        if (part.type === "text") {
          // Preserve newlines
          const segments = part.content.split("\n");
          return segments.map((seg, j) => (
            <span key={`${i}-${j}`}>
              {j > 0 && <br />}
              {seg}
            </span>
          ));
        }

        // Blank → inline input
        const idx = part.blankIndex!;
        const val = values[idx] ?? "";
        const width = Math.max(val.length, 6);
        const isHighlighted = highlightIndices?.includes(idx);

        return (
          <input
            key={`blank-${idx}`}
            type="text"
            value={val}
            onChange={(e) => handleChange(idx, e.target.value)}
            placeholder="..."
            style={{ width: `${width + 2}ch` }}
            className={`mx-0.5 inline-block min-w-[4ch] max-w-[20ch] rounded border-0 border-b-2 px-1.5 py-0.5 text-[13px] text-zinc-900 placeholder-zinc-300 outline-none transition-colors focus:border-zinc-900 ${
              isHighlighted
                ? "border-amber-400 bg-amber-50"
                : "border-zinc-200 bg-white"
            }`}
          />
        );
      })}

      {/* Collapsed indicator */}
      {needsCollapse && !expanded && totalBlanks > visibleBlanks && (
        <span className="mt-1 block text-[11px] text-zinc-400">
          +{totalBlanks - visibleBlanks} more fields below
        </span>
      )}
    </div>
  );
}

/** Build a filled template string by replacing blanks with values. */
export function buildFilledTemplate(
  template: string,
  values: Record<number, string>
): string {
  let blankIndex = 0;
  return template.replace(new RegExp(BLANK_PATTERN.source, "g"), () => {
    const val = values[blankIndex] ?? "________";
    blankIndex++;
    return val || "________";
  });
}

/** Count blanks in a template. */
export function countBlanks(template: string): number {
  const matches = template.match(new RegExp(BLANK_PATTERN.source, "g"));
  return matches ? matches.length : 0;
}
