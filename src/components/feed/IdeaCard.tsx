import Link from "next/link";
import { IdeaFeedItem } from "@/lib/types";
import { moneyTagColor, effortTagColor } from "@/lib/utils";
import TagBadge from "./TagBadge";

export default function IdeaCard({ idea }: { idea: IdeaFeedItem }) {
  return (
    <Link
      href={`/idea/${idea.id}`}
      className="group block rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-zinc-100 transition-all active:scale-[0.98]"
    >
      <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-zinc-900 group-hover:text-zinc-700">
        {idea.title}
      </h3>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
        {idea.subtext}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        <TagBadge label={idea.moneyTag} colorClass={moneyTagColor(idea.moneyTag)} />
        <TagBadge label={idea.effortTag} colorClass={effortTagColor(idea.effortTag)} />
      </div>
    </Link>
  );
}
