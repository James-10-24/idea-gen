import Link from "next/link";
import { IdeaFeedItem } from "@/lib/types";
import { moneyTagColor, effortTagColor } from "@/lib/utils";
import TagBadge from "./TagBadge";

interface IdeaCardProps {
  idea: IdeaFeedItem;
  recommended?: boolean;
}

export default function IdeaCard({ idea, recommended }: IdeaCardProps) {
  return (
    <Link
      href={`/idea/${idea.id}`}
      className="group relative block rounded-2xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)] transition-all duration-150 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.06)] active:scale-[0.98] active:bg-zinc-50/80"
    >
      {recommended && (
        <span className="mb-1.5 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-600/10">
          Good first example
        </span>
      )}
      <h3 className="text-[15px] font-semibold leading-[1.35] tracking-[-0.01em] text-zinc-900">
        {idea.title}
      </h3>
      <p className="mt-1 text-[13px] leading-[1.5] text-zinc-400">
        {idea.subtext}
      </p>
      <div className="mt-2.5 flex items-center gap-1.5">
        <TagBadge label={idea.moneyTag} colorClass={moneyTagColor(idea.moneyTag)} />
        <TagBadge label={idea.effortTag} colorClass={effortTagColor(idea.effortTag)} />
      </div>
      {/* Chevron hint */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-200 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-zinc-400"
      >
        <path
          d="M6 4L10 8L6 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
