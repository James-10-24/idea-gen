"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  const [output, setOutput] = useState<StartThisOutput | null>(null);
  const [startLoading, setStartLoading] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    let cancelled = false;

    async function fetchValidation() {
      const res = await fetch("/api/validate-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id }),
      });
      if (!cancelled) {
        const data = await res.json();
        setValidation(data);
      }
    }

    fetchValidation();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const handleStart = async () => {
    setStartLoading(true);
    const res = await fetch("/api/start-this", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: params.id }),
    });
    const data = await res.json();
    setOutput(data);
    setStartLoading(false);
  };

  if (!idea) {
    return (
      <div className="flex h-60 items-center justify-center">
        <p className="text-sm text-zinc-400">Idea not found.</p>
      </div>
    );
  }

  return (
    <>
      <IdeaHero idea={idea} />
      <ValidationSprint validation={validation} />
      {!output && (
        <PrimaryActionPanel
          onStart={handleStart}
          loading={startLoading}
          disabled={!validation}
        />
      )}
      {output && <OutputPanel data={output} />}
    </>
  );
}
