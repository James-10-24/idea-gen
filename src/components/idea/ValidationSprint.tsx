import { IdeaValidation } from "@/lib/types";
import { computePriority } from "@/lib/priority";
import ValidationSection from "./ValidationSection";
import PriorityBadge from "./PriorityBadge";

interface ValidationSprintProps {
  validation: IdeaValidation | null;
}

export default function ValidationSprint({ validation }: ValidationSprintProps) {
  const priority = validation ? computePriority(validation) : null;

  return (
    <div className="mt-4">
      <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
        Validation Sprint
      </h2>

      {priority && <PriorityBadge priority={priority} />}

      <div className={`flex flex-col gap-1.5 ${priority ? "mt-2" : ""}`}>
        <ValidationSection
          label="Demand"
          icon="📈"
          content={validation?.demand ?? null}
          loadingTexts={[
            "Checking demand signals…",
            "Analyzing search trends…",
            "Scanning communities…",
          ]}
        />
        <ValidationSection
          label="Competition"
          icon="⚔️"
          content={validation?.competition ?? null}
          loadingTexts={[
            "Scanning competition…",
            "Mapping existing players…",
            "Finding whitespace…",
          ]}
        />
        <ValidationSection
          label="Monetisation"
          icon="💰"
          content={validation?.monetisation ?? null}
          loadingTexts={[
            "Mapping monetisation…",
            "Evaluating revenue models…",
            "Estimating unit economics…",
          ]}
        />
      </div>
    </div>
  );
}
