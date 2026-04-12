"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { mockIdeas } from "@/lib/mockIdeas";
import { getGoal } from "@/lib/goals";
import { encodeSession, decodeSession } from "@/lib/session";
import { trackStart, trackStep2Plus } from "@/lib/metrics";
import { saveSession, loadSavedSession, clearSavedSession } from "@/lib/savedSession";
import { IdeaValidation, StartThisOutput, StepOutcome } from "@/lib/types";
import { computePriority } from "@/lib/priority";
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
import { buildFilledTemplate } from "@/components/idea/EditableTemplate";
import { needsCommitment, buildCommitmentStep } from "@/lib/commitment";
import FirstStepToast from "@/components/idea/FirstStepToast";
import ResumeBanner from "@/components/idea/ResumeBanner";

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
  resultSignal: null,
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
  const [templateValues, setTemplateValues] = useState<Record<number, string>>({});
  const [isCommitmentStep, setIsCommitmentStep] = useState(false);
  const [lastSelectedChoice, setLastSelectedChoice] = useState<string | null>(null);
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState(false);
  const [nextStepLoading, setNextStepLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(emptyFeedback);
  const [hydrated, setHydrated] = useState(false);
  const [showFirstToast, setShowFirstToast] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [restoredSavedAt, setRestoredSavedAt] = useState<number | null>(null);
  const hasShownToast = useRef(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const goal = idea ? getGoal(idea.id) : "";

  // -----------------------------------------------------------------------
  // Hydrate from shared session URL or saved session
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (hydrated) return;

    // Priority 1: shared session in URL
    const sessionParam = searchParams.get("session");
    if (sessionParam) {
      const decoded = decodeSession(sessionParam);
      if (decoded) {
        setCompletedSteps(decoded.completedSteps);
        setArtifacts(decoded.artifacts);
        setStepNumber(decoded.stepNumber);
        if (decoded.currentStep) setCurrentStep(decoded.currentStep);
        setHydrated(true);
        const url = new URL(window.location.href);
        url.searchParams.delete("session");
        window.history.replaceState({}, "", url.toString());
        return;
      }
    }

    // Priority 2: saved session from localStorage (via ?restore=true)
    const shouldRestore = searchParams.get("restore") === "true";
    if (shouldRestore) {
      const saved = loadSavedSession();
      if (saved && saved.ideaId === params.id) {
        setCompletedSteps(saved.completedSteps);
        setArtifacts(saved.artifacts);
        setStepNumber(saved.stepNumber);
        if (saved.currentStep) setCurrentStep(saved.currentStep);
        setIsRestored(true);
        setRestoredSavedAt(saved.savedAt);
        // Clean URL
        const url = new URL(window.location.href);
        url.searchParams.delete("restore");
        window.history.replaceState({}, "", url.toString());
      }
    }

    setHydrated(true);
  }, [searchParams, hydrated, params.id]);

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
    lastOutcome?: StepOutcome | null,
    selectedChoice?: string | null
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
          selectedChoice: selectedChoice ?? undefined,
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
      trackStart(params.id);
      setCurrentStep(data);
      setStepNumber(1);
      setCompletedSteps([]);
      setArtifacts([]);
      setCurrentOutcome(null);
      setTemplateValues({});
      setIsCommitmentStep(false);
      setLastSelectedChoice(null);
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

    const filledTemplate = buildFilledTemplate(currentStep.template, templateValues);

    // Archive current step
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
        template: filledTemplate,
        outcome: currentOutcome,
      },
    ];
    const nextNum = stepNumber + 1;

    // --- Commitment intercept ---
    // If current step was a list step (not already a commitment step),
    // inject a commitment step before calling the AI.
    if (!isCommitmentStep && needsCommitment(currentStep.template)) {
      const commitStep = buildCommitmentStep(currentStep.stepTitle, templateValues);
      setCompletedSteps(updatedCompleted);
      setArtifacts(updatedArtifacts);
      setCurrentStep(commitStep);
      setStepNumber(nextNum);
      setCurrentOutcome(null);
      setTemplateValues({});
      setIsCommitmentStep(true);
      setNextStepLoading(false);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }

    // --- Extract selection from commitment step ---
    let choiceForNextStep: string | null = null;
    if (isCommitmentStep) {
      // The first filled value in the commitment template is the user's choice
      const choice = templateValues[0]?.trim() || null;
      choiceForNextStep = choice;
      setLastSelectedChoice(choice);
      setIsCommitmentStep(false);
    }

    // --- Normal flow: call AI for next step ---
    const historyForAPI = updatedCompleted.map((s) => ({
      stepTitle: s.stepTitle,
      instruction: s.instruction,
    }));

    const data = await fetchAction(
      nextNum,
      historyForAPI,
      currentOutcome,
      choiceForNextStep || lastSelectedChoice
    );
    if (data) {
      trackStep2Plus(params.id);
      setCompletedSteps(updatedCompleted);
      setArtifacts(updatedArtifacts);
      setCurrentStep(data);
      setStepNumber(nextNum);
      setCurrentOutcome(null);
      setTemplateValues({});
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

  const handleStartFresh = () => {
    setCurrentStep(null);
    setStepNumber(0);
    setCompletedSteps([]);
    setArtifacts([]);
    setCurrentOutcome(null);
    setTemplateValues({});
    setIsCommitmentStep(false);
    setLastSelectedChoice(null);
    setFeedback(emptyFeedback);
    setIsRestored(false);
    setRestoredSavedAt(null);
    clearSavedSession();
  };

  // -----------------------------------------------------------------------
  // Save progress
  // -----------------------------------------------------------------------
  const handleSave = () => {
    if (!idea) return;
    saveSession({
      ideaId: idea.id,
      ideaTitle: idea.title,
      stepNumber,
      currentStep,
      completedSteps,
      artifacts,
    });
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
  const priority = validation ? computePriority(validation) : null;

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

  // Time-ago helper
  const getTimeAgo = (ts: number): string => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <>
      <IdeaHero idea={idea} />

      {isRestored && (
        <ResumeBanner
          completedCount={doneCount}
          currentStepTitle={currentStep?.stepTitle ?? null}
          savedAgo={restoredSavedAt ? getTimeAgo(restoredSavedAt) : ""}
          onStartFresh={handleStartFresh}
        />
      )}

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
          onSave={handleSave}
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
            isRestored={isRestored}
            outcome={currentOutcome}
            onOutcomeSelect={handleOutcomeSelect}
            onNextStep={handleNextStep}
            nextStepLoading={nextStepLoading}
            onTryAnother={handleTryAnother}
            templateValues={templateValues}
            onTemplateValuesChange={setTemplateValues}
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
          priority={priority}
        />
      )}

      <FirstStepToast show={showFirstToast} />
    </>
  );
}
