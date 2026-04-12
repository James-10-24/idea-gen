"use client";

import { useRouter } from "next/navigation";
import { IdeaFeedItem } from "@/lib/types";
import { moneyTagColor, effortTagColor } from "@/lib/utils";
import TagBadge from "@/components/feed/TagBadge";

export default function IdeaHero({ idea }: { idea: IdeaFeedItem }) {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => router.push("/")}
        className="mb-4 flex items-center gap-1 text-[13px] font-medium text-zinc-400 transition-colors active:text-zinc-600"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-current"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      <h1 className="text-xl font-bold leading-tight tracking-tight text-zinc-900">
        {idea.title}
      </h1>
      <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-500">
        {idea.subtext}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        <TagBadge label={idea.moneyTag} colorClass={moneyTagColor(idea.moneyTag)} />
        <TagBadge label={idea.effortTag} colorClass={effortTagColor(idea.effortTag)} />
      </div>
    </div>
  );
}
