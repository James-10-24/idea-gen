import { IdeaValidation } from "@/lib/types";
import ValidationSection from "./ValidationSection";

interface ValidationSprintProps {
  validation: IdeaValidation | null;
}

export default function ValidationSprint({ validation }: ValidationSprintProps) {
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-zinc-400">
        Validation Sprint
      </h2>
      <div className="flex flex-col gap-2.5">
        <ValidationSection
          label="Demand"
          icon="📈"
          content={validation?.demand ?? null}
          loadingText="Checking demand…"
        />
        <ValidationSection
          label="Competition"
          icon="⚔️"
          content={validation?.competition ?? null}
          loadingText="Scanning competition…"
        />
        <ValidationSection
          label="Monetisation"
          icon="💰"
          content={validation?.monetisation ?? null}
          loadingText="Mapping monetisation…"
        />
      </div>
    </div>
  );
}
