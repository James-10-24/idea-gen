"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { mockIdeas } from "@/lib/mockIdeas";
import { getGoal } from "@/lib/goals";
import { encodeSession, decodeSession } from "@/lib/session";
import { IdeaValidation, StartThisOutput, StepOutcome } from "@/lib/types";
import IdeaHero from "@/components/idea/IdeaHero";
import ValidationSprint from "@/components/idea/ValidationSprint";
import PrimaryActionPanel from "@/components/idea/PrimaryActionPanel";
import GoalBanner from "@/components/idea/GoalBanner";
import BuildBoard, { Artifact } from "@/components/idea/BuildBoard";
import ProgressLog from "@/components/idea/ProgressLog";
import OutputPanel from "@/components/idea/OutputPanel";
import SessionRecap, {
  FeedbackState,
} from "@/components/idea/SessionRecap";
import DevDebug from "@/components/idea/DevDebug";
import WhatHappensNext from "@/components/idea/WhatHappensNext";
import FirstStepToast from "@/components/idea/FirstStepToast";

interface CompletedStep {
  stepTitle: string;
  instruction: string;
  done: boolean;
  outcome: StepOutcome | null;
}

const emptyFeedback: FeedbackState = {
  usefulness: null,
  hardest: null,
  continueLater: null,
  freeText: "",
};

export default function IdeaDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const idea = mockIdeas.find((i) => i.id === params.id);

  const [validation, setValidation] = useState<IdeaValidation | null>(null);
  const [validationError, setValidationError] = useState(false);

  // Step progression state
  const [currentStep, setCurrentStep] = useState<StartThisOutput | null>(null);
  const [stepNumber, setStepNumber] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<CompletedStep[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [currentOutcome, setCurrentOutcome] = useState<StepOutcome | null>(null);
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState(false);
  const [nextStepLoading, setNextStepLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(emptyFeedback);
  const [hydrated, setHydrated] = useState(false);
  const [showFirstToast, setShowFirstToast] = useState(false);
  const hasShownToast = useRef(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const goal = idea ? getGoal(idea.id) : "";

  // -----------------------------------------------------------------------
  // Hydrate from shared session URL
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (hydrated) return;
    const sessionParam = searchParams.get("session");
    if (!sessionParam) {
      setHydrated(true);
      return;
    }

    const decoded = decodeSession(sessionParam);
    if (!decoded) {
      // Invalid session — silently ignore, continue normal flow
      setHydrated(true);
      return;
    }

    setCompletedSteps(decoded.completedSteps);
    setArtifacts(decoded.artifacts);
    setStepNumber(decoded.stepNumber);
    if (decoded.currentStep) {
      setCurrentStep(decoded.currentStep);
    }
    setHydrated(true);

    // Clean URL without reloading (remove ?session= param)
    const url = new URL(window.location.href);
    url.searchParams.delete("session");
    window.history.replaceState({}, "", url.toString());
  }, [searchParams, hydrated]);

  // -----------------------------------------------------------------------
  // Validation
  // -----------------------------------------------------------------------
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

  // -----------------------------------------------------------------------
  // Step generation
  // -----------------------------------------------------------------------
  const fetchAction = async (
    targetStepNumber: number,
    history: Array<{ stepTitle: string; instruction: string }>,
    lastOutcome?: StepOutcome | null
  ): Promise<StartThisOutput | null> => {
    try {
      const res = await fetch("/api/start-this", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params.id,
          stepNumber: targetStepNumber,
          previousSteps: history,
          lastOutcome: lastOutcome ?? undefined,
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
      setArtifacts([]);
      setCurrentOutcome(null);
      setFeedback(emptyFeedback);
      // Show first-step toast once per session
      if (!hasShownToast.current) {
        hasShownToast.current = true;
        setShowFirstToast(true);
      }
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

    const updatedCompleted: CompletedStep[] = [
      ...completedSteps,
      {
        stepTitle: currentStep.stepTitle,
        instruction: currentStep.instruction,
        done: currentOutcome === "done" || currentOutcome === "useful",
        outcome: currentOutcome,
      },
    ];
    const updatedArtifacts: Artifact[] = [
      ...artifacts,
      {
        stepNumber,
        stepTitle: currentStep.stepTitle,
        template: currentStep.template,
        outcome: currentOutcome,
      },
    ];
    const historyForAPI = updatedCompleted.map((s) => ({
      stepTitle: s.stepTitle,
      instruction: s.instruction,
    }));
    const nextNum = stepNumber + 1;

    const data = await fetchAction(nextNum, historyForAPI, currentOutcome);
    if (data) {
      setCompletedSteps(updatedCompleted);
      setArtifacts(updatedArtifacts);
      setCurrentStep(data);
      setStepNumber(nextNum);
      setCurrentOutcome(null);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
    setNextStepLoading(false);
  };

  const handleOutcomeSelect = (outcome: StepOutcome) => {
    setCurrentOutcome(outcome);
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

  // -----------------------------------------------------------------------
  // Share
  // -----------------------------------------------------------------------
  const handleShare = async () => {
    const encoded = encodeSession(
      completedSteps,
      artifacts,
      currentStep,
      stepNumber
    );
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("session", encoded);
    await navigator.clipboard.writeText(url.toString());
  };

  // -----------------------------------------------------------------------
  // Derived
  // -----------------------------------------------------------------------
  const totalSteps = stepNumber;
  const doneCount = completedSteps.filter((s) => s.done).length;
  const showRecap = completedSteps.length >= 2 || artifacts.length >= 2;

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

      {(currentStep || completedSteps.length > 0) && (
        <GoalBanner
          goal={goal}
          completedCount={doneCount}
          totalSteps={totalSteps}
        />
      )}

      {(artifacts.length > 0 || completedSteps.length > 0) && (
        <BuildBoard
          ideaTitle={idea.title}
          goal={goal}
          completedSteps={completedSteps}
          artifacts={artifacts}
          onShare={handleShare}
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

      {!currentStep && !startError && completedSteps.length === 0 && validation && (
        <WhatHappensNext />
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

      {completedSteps.length > 0 && (
        <ProgressLog
          steps={completedSteps}
          onToggleDone={handleTogglePreviousDone}
        />
      )}

      <div ref={outputRef}>
        {currentStep && (
          <OutputPanel
            data={currentStep}
            stepNumber={stepNumber}
            isFirstStep={stepNumber === 1 && completedSteps.length === 0}
            outcome={currentOutcome}
            onOutcomeSelect={handleOutcomeSelect}
            onNextStep={handleNextStep}
            nextStepLoading={nextStepLoading}
            onTryAnother={handleTryAnother}
          />
        )}
      </div>

      {showRecap && (
        <SessionRecap
          ideaTitle={idea.title}
          goal={goal}
          stepsGenerated={totalSteps}
          stepsCompleted={doneCount}
          artifactsCount={artifacts.length}
          feedback={feedback}
          onFeedbackChange={setFeedback}
        />
      )}

      {currentStep && (
        <DevDebug
          ideaId={params.id}
          stepNumber={stepNumber}
          completedCount={completedSteps.length}
          artifactsCount={artifacts.length}
          currentOutcome={currentOutcome}
          feedback={feedback}
        />
      )}

      <FirstStepToast show={showFirstToast} />
    </>
  );
}
