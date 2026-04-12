"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockIdeas } from "@/lib/mockIdeas";
import { IdeaValidation, StartThisOutput } from "@/lib/types";
import IdeaHero from "@/components/idea/IdeaHero";
import ValidationSprint from "@/components/idea/ValidationSprint";
import PrimaryActionPanel from "@/components/idea/PrimaryActionPanel";
import OutputPanel from "@/components/idea/OutputPanel";

export default function IdeaDetailPage() {
  const params = useParams<{ id: string }>();
  const idea = mockIdeas.find((i) => i.id === params.id);

  const [validation, setValidation] = useState<IdeaValidation | null>(null);
  const [validationError, setValidationError] = useState(false);
  const [output, setOutput] = useState<StartThisOutput | null>(null);
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState(false);

  const fetchValidation = useCallback(async () => {
    setValidationError(false);
    setValidation(null);
    try {
      const res = await fetch("/api/validate-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setValidation(data);
    } catch {
      setValidationError(true);
    }
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;
    fetchValidation();
  }, [params.id, fetchValidation]);

  const handleStart = async () => {
    setStartLoading(true);
    setStartError(false);
    try {
      const res = await fetch("/api/start-this", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOutput(data);
    } catch {
      setStartError(true);
    } finally {
      setStartLoading(false);
    }
  };

  // Not found state
  if (!idea) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-xl">
          🔍
        </div>
        <h2 className="text-[16px] font-semibold text-zinc-900">
          Idea not found
        </h2>
        <p className="mt-1 text-[13px] text-zinc-400">
          This idea may have been removed or the link is incorrect.
        </p>
        <Link
          href="/"
          className="mt-5 rounded-xl bg-zinc-900 px-5 py-2.5 text-[14px] font-medium text-white transition-all active:scale-[0.97]"
        >
          Browse ideas
        </Link>
      </div>
    );
  }

  return (
    <>
      <IdeaHero idea={idea} />

      {validationError ? (
        <div className="mt-5 rounded-xl bg-white p-4 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)]">
          <p className="text-[13px] text-zinc-500">
            Couldn&apos;t load validation. Please try again.
          </p>
          <button
            onClick={fetchValidation}
            className="mt-3 rounded-lg bg-zinc-100 px-4 py-2 text-[13px] font-medium text-zinc-700 transition-all active:scale-[0.97]"
          >
            Retry
          </button>
        </div>
      ) : (
        <ValidationSprint validation={validation} />
      )}

      {!output && !startError && (
        <PrimaryActionPanel
          onStart={handleStart}
          loading={startLoading}
          disabled={!validation}
        />
      )}

      {startError && !output && (
        <div className="mt-6 rounded-xl bg-white p-4 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)]">
          <p className="text-[13px] text-zinc-500">
            Something went wrong generating your action.
          </p>
          <button
            onClick={handleStart}
            className="mt-3 rounded-lg bg-zinc-100 px-4 py-2 text-[13px] font-medium text-zinc-700 transition-all active:scale-[0.97]"
          >
            Try again
          </button>
        </div>
      )}

      {output && <OutputPanel data={output} />}
    </>
  );
}
