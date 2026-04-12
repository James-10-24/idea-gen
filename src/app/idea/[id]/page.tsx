"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mockIdeas } from "@/lib/mockIdeas";
import { getGoal } from "@/lib/goals";
import { IdeaValidation, StartThisOutput } from "@/lib/types";
import IdeaHero from "@/components/idea/IdeaHero";
import ValidationSprint from "@/components/idea/ValidationSprint";
import PrimaryActionPanel from "@/components/idea/PrimaryActionPanel";
import GoalBanner from "@/components/idea/GoalBanner";
import ProgressLog from "@/components/idea/ProgressLog";
import OutputPanel from "@/components/idea/OutputPanel";

interface CompletedStep {
  stepTitle: string;
  instruction: string;
  done: boolean;
}

export default function IdeaDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const idea = mockIdeas.find((i) => i.id === params.id);

  const [validation, setValidation] = useState<IdeaValidation | null>(null);
  const [validationError, setValidationError] = useState(false);

  // Step progression state
  const [currentStep, setCurrentStep] = useState<StartThisOutput | null>(null);
  const [stepNumber, setStepNumber] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);
  const [currentStepDone, setCurrentStepDone] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState(false);
  const [nextStepLoading, setNextStepLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const goal = idea ? getGoal(idea.id) : "";

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

  const fetchAction = async (
    targetStepNumber: number,
    history: Array<{ stepTitle: string; instruction: string }>
  ): Promise<StartThisOutput | null> => {
    try {
      const res = await fetch("/api/start-this", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params.id,
          stepNumber: targetStepNumber,
          previousSteps: history,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      return await res.json();
    } catch {
      return null;
    }
  };

  const handleStart = async () => {
    setStartLoading(true);
    setStartError(false);
    const data = await fetchAction(1, []);
    if (data) {
      setCurrentStep(data);
      setStepNumber(1);
      setCompletedSteps([]);
      setCurrentStepDone(false);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      setStartError(true);
    }
    setStartLoading(false);
  };

  const handleNextStep = async () => {
    if (!currentStep) return;
    setNextStepLoading(true);

    // Move current step to completed log
    const updatedCompleted = [
      ...completedSteps,
      {
        stepTitle: currentStep.stepTitle,
        instruction: currentStep.instruction,
        done: currentStepDone,
      },
    ];
    const historyForAPI = updatedCompleted.map((s) => ({
      stepTitle: s.stepTitle,
      instruction: s.instruction,
    }));
    const nextNum = stepNumber + 1;

    const data = await fetchAction(nextNum, historyForAPI);
    if (data) {
      setCompletedSteps(updatedCompleted);
      setCurrentStep(data);
      setStepNumber(nextNum);
      setCurrentStepDone(false);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
    setNextStepLoading(false);
  };

  const handleMarkCurrentDone = () => {
    setCurrentStepDone((prev) => !prev);
  };

  const handleTogglePreviousDone = (index: number) => {
    setCompletedSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, done: !step.done } : step
      )
    );
  };

  const handleTryAnother = () => {
    router.push("/");
  };

  const totalSteps = stepNumber;
  const doneCount =
    completedSteps.filter((s) => s.done).length + (currentStepDone ? 1 : 0);

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

      {/* Goal banner — shows once steps begin */}
      {currentStep && (
        <GoalBanner
          goal={goal}
          completedCount={doneCount}
          totalSteps={totalSteps}
        />
      )}

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

      {!currentStep && !startError && (
        <PrimaryActionPanel
          onStart={handleStart}
          loading={startLoading}
          disabled={!validation}
        />
      )}

      {startError && !currentStep && (
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

      {/* Progress log of previous steps */}
      {completedSteps.length > 0 && (
        <ProgressLog
          steps={completedSteps}
          onToggleDone={handleTogglePreviousDone}
        />
      )}

      {/* Current step */}
      <div ref={outputRef}>
        {currentStep && (
          <OutputPanel
            data={currentStep}
            stepNumber={stepNumber}
            isDone={currentStepDone}
            onMarkDone={handleMarkCurrentDone}
            onNextStep={handleNextStep}
            nextStepLoading={nextStepLoading}
            onTryAnother={handleTryAnother}
          />
        )}
      </div>
    </>
  );
}
