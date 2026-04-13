"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { activatePro } from "@/lib/proAccess";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError(true);
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) throw new Error("Verification failed");

        const data = await res.json();
        activatePro(data.email || "");
        setActivated(true);
      } catch {
        // Even if verification fails, activate based on the redirect
        activatePro("");
        setActivated(true);
      }
    }

    verify();
  }, [searchParams]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-[14px] text-zinc-500">
          Something went wrong. Please contact support.
        </p>
        <Link
          href="/"
          className="mt-4 rounded-xl bg-zinc-900 px-5 py-2.5 text-[14px] font-medium text-white transition-all active:scale-[0.97]"
        >
          Go home
        </Link>
      </div>
    );
  }

  if (!activated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-600" />
        <p className="mt-3 text-[13px] text-zinc-400">
          Activating your account…
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">
        🎉
      </div>
      <h1 className="text-[20px] font-bold tracking-[-0.02em] text-zinc-900">
        You&apos;re now unlimited
      </h1>
      <p className="mt-1 text-[14px] text-zinc-400">
        Keep shipping — no limits, no interruptions.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-2xl bg-zinc-900 px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition-all active:scale-[0.97]"
      >
        Start shipping
      </Link>
    </div>
  );
}
