import { IdeaValidation } from "@/lib/types";
import ValidationSection from "./ValidationSection";

interface ValidationSprintProps {
  validation: IdeaValidation | null;
}

export default function ValidationSprint({ validation }: ValidationSprintProps) {
  return (
    <div className="mt-5">
      <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-300">
        Validation Sprint
      </h2>
      <div className="flex flex-col gap-2">
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
