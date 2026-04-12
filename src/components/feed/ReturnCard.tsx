"use client";

import { useEffect, useState } from "react";
import { loadStats, getReturnMessage, ReturnMessage } from "@/lib/sessionStats";

export default function ReturnCard() {
  const [message, setMessage] = useState<ReturnMessage | null>(null);

  useEffect(() => {
    const stats = loadStats();
    setMessage(getReturnMessage(stats));
  }, []);

  if (!message) return null;

  return (
    <div className="mb-3 animate-in-fast rounded-2xl bg-zinc-900 px-4 py-3.5 shadow-sm">
      <p className="text-[14px] font-semibold text-white">
        {message.headline}
      </p>
      <p className="mt-0.5 text-[12px] text-zinc-400">
        {message.subtext}
      </p>
    </div>
  );
}
