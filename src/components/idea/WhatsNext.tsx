"use client";

import Link from "next/link";
import { IdeaFeedItem } from "@/lib/types";
import { moneyTagColor, effortTagColor } from "@/lib/utils";
import TagBadge from "@/components/feed/TagBadge";

interface WhatsNextProps {
  suggestions: IdeaFeedItem[];
}

export default function WhatsNext({ suggestions }: WhatsNextProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="mt-6 animate-in">
      <div className="rounded-2xl bg-zinc-900 px-4 py-4 shadow-sm">
        <p className="text-[14px] font-semibold text-white">
          Nice — you just created something usable.
        </p>
        <p className="mt-0.5 text-[12px] text-zinc-400">
          Want to try another one?
        </p>

        <div className="mt-3 space-y-2">
          {suggestions.map((idea) => (
            <Link
              key={idea.id}
              href={`/idea/${idea.id}`}
              className="block rounded-xl bg-white/10 px-3.5 py-3 transition-all duration-150 hover:bg-white/15 active:scale-[0.98]"
            >
              <h4 className="text-[13px] font-semibold leading-tight text-white">
                {idea.title}
              </h4>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                {idea.subtext}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <TagBadge
                  label={idea.moneyTag}
                  colorClass={moneyTagColor(idea.moneyTag)}
                />
                <TagBadge
                  label={idea.effortTag}
                  colorClass={effortTagColor(idea.effortTag)}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
