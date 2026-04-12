"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadSavedSession, clearSavedSession, SavedSession } from "@/lib/savedSession";
import { mockIdeas } from "@/lib/mockIdeas";

export default function ContinueCard() {
  const [session, setSession] = useState<SavedSession | null>(null);

  useEffect(() => {
    const saved = loadSavedSession();
    if (!saved) return;
    // Verify idea still exists
    const ideaExists = mockIdeas.some((i) => i.id === saved.ideaId);
    if (!ideaExists) {
      clearSavedSession();
      return;
    }
    setSession(saved);
  }, []);

  if (!session) return null;

  const doneCount = session.completedSteps.filter((s) => s.done).length;
  const ago = getTimeAgo(session.savedAt);

  return (
    <div className="mb-3 animate-in-fast overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.04)]">
      <Link
        href={`/idea/${session.ideaId}?restore=true`}
        className="flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-zinc-50"
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[14px] text-white">
          ↩
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-tight text-zinc-900">
            Continue where you left off
          </p>
          <p className="mt-0.5 truncate text-[12px] text-zinc-400">
            {session.ideaTitle}
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col items-end">
          <span className="text-[12px] font-medium tabular-nums text-zinc-500">
            {doneCount}/{session.stepNumber} steps
          </span>
          <span className="text-[11px] text-zinc-300">{ago}</span>
        </div>
      </Link>
      <div className="flex border-t border-zinc-100">
        <button
          onClick={(e) => {
            e.preventDefault();
            clearSavedSession();
            setSession(null);
          }}
          className="flex-1 px-4 py-2 text-[12px] text-zinc-400 transition-colors hover:text-zinc-600"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
