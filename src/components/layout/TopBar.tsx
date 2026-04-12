"use client";

import Link from "next/link";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-lg items-center px-4">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
            Idea
          </span>
          <span className="text-[13px] text-zinc-400">→</span>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
            Income
          </span>
        </Link>
      </div>
    </header>
  );
}
