"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/90 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-11 max-w-lg items-center px-5">
        <Link
          href="/"
          className="flex items-baseline gap-1 transition-opacity active:opacity-60"
        >
          <span className="text-[14px] font-semibold tracking-tight text-zinc-900">
            Idea
          </span>
          <span className="text-[12px] text-zinc-300">→</span>
          <span className="text-[14px] font-semibold tracking-tight text-zinc-900">
            Income
          </span>
        </Link>
      </div>
    </header>
  );
}
