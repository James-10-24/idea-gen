"use client";

import { useState, useEffect } from "react";
import { StartThisOutput, StepOutcome } from "@/lib/types";
import OutcomeSelector from "./OutcomeSelector";
import EditableTemplate, { buildFilledTemplate } from "./EditableTemplate";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-1.5 text-[12px] font-medium text-zinc-400 transition-all duration-150 hover:bg-zinc-100 hover:text-zinc-600 active:scale-[0.97]"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 11V3.5C3 2.67 3.67 2 4.5 2H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

const nextStepMessages = [
  "Building on your progress…",
  "Generating your next move…",
  "Adapting to your result…",
];

const TEMPLATE_PREVIEW_LINES = 4;

interface OutputPanelProps {
  data: StartThisOutput;
  stepNumber: number;
  isFirstStep: boolean;
  isRestored?: boolean;
  isFinalStep?: boolean;
  outcome: StepOutcome | null;
  onOutcomeSelect: (outcome: StepOutcome) => void;
  onNextStep: () => void;
  nextStepLoading: boolean;
  onTryAnother: () => void;
  templateValues: Record<number, string>;
  onTemplateValuesChange: (values: Record<number, string>) => void;
}

export default function OutputPanel({
  data,
  stepNumber,
  isFirstStep,
  isRestored,
  isFinalStep,
  outcome,
  onOutcomeSelect,
  onNextStep,
  nextStepLoading,
  onTryAnother,
  templateValues,
  onTemplateValuesChange,
}: OutputPanelProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [templateExpanded, setTemplateExpanded] = useState(false);

  // Reset template collapse when step changes
  useEffect(() => {
    setTemplateExpanded(false);
  }, [stepNumber]);

  useEffect(() => {
    if (!nextStepLoading) return;
    setMsgIndex(0);
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % nextStepMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [nextStepLoading]);

  // Detect if template has pre-filled values (non-empty values on first render)
  const hasPrefills = Object.keys(templateValues).length > 0;

  // Build filled text for copy
  const filledTemplate = buildFilledTemplate(data.template, templateValues);
  const fullText = `STEP ${stepNumber}: ${data.stepTitle}\n\n${data.instruction}\n\nTEMPLATE:\n${filledTemplate}`;

  // Template line count for collapse
  const templateLines = data.template.split("\n").filter((l) => l.trim() !== "");
  const needsCollapse = templateLines.length > TEMPLATE_PREVIEW_LINES;

  return (
    <div className="mt-6 animate-in">
      {/* Contextual label */}
      {isRestored && (
        <p className="mb-3 text-[12px] font-medium text-zinc-500">
          ↓ Continue here
        </p>
      )}
      {isFinalStep && !isRestored && (
        <p className="mb-3 text-[12px] font-medium text-emerald-600">
          You&apos;ve done the work — now make it usable.
        </p>
      )}
      {!isFirstStep && !isRestored && !isFinalStep && (
        <p className="mb-3 text-[12px] text-zinc-400">
          Based on your last result, here&apos;s the best next move.
        </p>
      )}

      {/* Step header */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
            Step {stepNumber}
          </span>
          {isFinalStep && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-600/10">
              Final step
            </span>
          )}
        </div>
        <h3 className="mt-0.5 text-[17px] font-semibold leading-tight tracking-[-0.01em] text-zinc-900">
          {data.stepTitle}
        </h3>
      </div>

      {/* Instruction card */}
      <div
        className={`rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)] ${
          isRestored ? "ring-2 ring-zinc-900/10" : ""
        }`}
      >
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
          What to do
        </h4>
        <p className="mt-1.5 text-[14px] leading-[1.6] text-zinc-700">
          {data.instruction}
        </p>
      </div>

      {/* Outcome check-in + next step CTA — ABOVE template */}
      <OutcomeSelector selected={outcome} onSelect={onOutcomeSelect} />

      <button
        onClick={onNextStep}
        disabled={nextStepLoading || !outcome}
        className="mt-4 w-full rounded-2xl bg-zinc-900 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all duration-150 hover:bg-zinc-800 active:scale-[0.97] disabled:opacity-30 disabled:active:scale-100"
      >
        {nextStepLoading ? (
          <span className="flex items-center justify-center gap-2.5">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span>{nextStepMessages[msgIndex]}</span>
          </span>
        ) : (
          "Generate next step"
        )}
      </button>
      {!outcome && (
        <p className="mt-1.5 text-center text-[11px] text-zinc-400">
          Tell us how it went to get a tailored next step.
        </p>
      )}

      {/* Editable template — secondary, collapsible */}
      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between px-4 pt-3.5 pb-0">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
            {hasPrefills ? "Working draft" : "Fill this in"}
          </h4>
          <CopyButton text={filledTemplate} label="Copy" />
        </div>
        {hasPrefills && (
          <p className="px-4 pt-2 text-[11px] text-zinc-400">
            This is a working draft — edit it or use it as-is.
          </p>
        )}
        <div className={`px-4 ${hasPrefills ? "pt-1.5" : "pt-2"} pb-3.5`}>
          <EditableTemplate
            template={data.template}
            values={templateValues}
            onChange={onTemplateValuesChange}
            expanded={templateExpanded}
            previewLines={TEMPLATE_PREVIEW_LINES}
          />
          {needsCollapse && (
            <button
              onClick={() => setTemplateExpanded((v) => !v)}
              className="mt-2 text-[12px] font-medium text-zinc-400 transition-colors hover:text-zinc-600"
            >
              {templateExpanded
                ? "Show less"
                : `Show full template (${templateLines.length} lines)`}
            </button>
          )}
        </div>
        <div className="flex border-t border-zinc-100 px-4 py-2.5">
          <CopyButton text={fullText} label="Copy all" />
        </div>
      </div>

      {/* Try another idea */}
      <button
        onClick={onTryAnother}
        className="mt-4 flex w-full items-center justify-center rounded-xl px-5 py-3 text-[13px] font-medium text-zinc-400 transition-all duration-150 hover:text-zinc-600 active:scale-[0.98]"
      >
        ← Try another idea
      </button>
    </div>
  );
}
