"use client";

import { useEffect, useState } from "react";

interface ValidationSectionProps {
  label: string;
  icon: string;
  content: string | null;
  loadingTexts: string[];
}

export default function ValidationSection({
  label,
  icon,
  content,
  loadingTexts,
}: ValidationSectionProps) {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    if (content) return;
    const interval = setInterval(() => {
      setTextIndex((i) => (i + 1) % loadingTexts.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [content, loadingTexts.length]);

  return (
    <div
      className={`rounded-xl bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)] transition-all duration-300 ${
        content ? "validation-reveal" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-50 text-[12px]">
          {icon}
        </span>
        <h3 className="text-[12px] font-semibold tracking-[-0.01em] text-zinc-900">
          {label}
        </h3>
      </div>
      {content ? (
        <p className="mt-1.5 text-[13px] leading-[1.5] text-zinc-500">
          {content}
        </p>
      ) : (
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-zinc-200 border-t-zinc-500" />
            <span className="text-[12px] text-zinc-400 transition-opacity duration-200">
              {loadingTexts[textIndex]}
            </span>
          </div>
          <div className="h-2.5 w-full animate-pulse rounded bg-zinc-50" />
          <div className="h-2.5 w-3/5 animate-pulse rounded bg-zinc-50" />
        </div>
      )}
    </div>
  );
}
