"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  hasSeenOnboarding,
  markOnboardingSeen,
  RECOMMENDED_IDEA_ID,
} from "@/lib/onboarding";

export default function OnboardingCard() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasSeenOnboarding());
  }, []);

  if (!visible) return null;

  const handleShowMe = () => {
    markOnboardingSeen();
    router.push(`/idea/${RECOMMENDED_IDEA_ID}`);
  };

  const handleSkip = () => {
    markOnboardingSeen();
    setVisible(false);
  };

  return (
    <div className="mb-4 animate-in-fast overflow-hidden rounded-2xl bg-zinc-900 px-4 py-4 shadow-sm">
      <h2 className="text-[15px] font-semibold leading-snug text-white">
        Turn free time into ideas you can act on
      </h2>

      <div className="mt-3 space-y-2">
        {[
          { num: "1", text: "Pick an idea" },
          { num: "2", text: "Get a guided first step" },
          { num: "3", text: "Build momentum in minutes" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white/70">
              {s.num}
            </span>
            <span className="text-[13px] text-white/70">{s.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleShowMe}
          className="flex-1 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-zinc-900 transition-all active:scale-[0.97]"
        >
          Show me how
        </button>
        <button
          onClick={handleSkip}
          className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-white/40 transition-colors hover:text-white/60 active:scale-[0.97]"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
