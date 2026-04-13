import { createClient } from "./client";
import type { StartThisOutput, StepOutcome } from "@/lib/types";

// -----------------------------------------------------------------------
// Types matching DB schema
// -----------------------------------------------------------------------

export interface DbSavedSession {
  id: string;
  user_id: string;
  idea_id: string;
  idea_title: string;
  step_number: number;
  current_step: StartThisOutput | null;
  completed_steps: Array<{
    stepTitle: string;
    instruction: string;
    done: boolean;
    outcome: StepOutcome | null;
    isCommitment?: boolean;
  }>;
  artifacts: Array<{
    stepNumber: number;
    stepTitle: string;
    template: string;
    outcome: StepOutcome | null;
  }>;
  saved_at: string;
  updated_at: string;
}

export interface DbSubscription {
  status: string;
  plan: string;
  current_period_end: string | null;
}

export interface DbUserStats {
  total_sessions: number;
  total_outputs: number;
  last_session_date: string | null;
}

// -----------------------------------------------------------------------
// Saved Sessions
// -----------------------------------------------------------------------

export async function saveSessionToDb(
  ideaId: string,
  ideaTitle: string,
  stepNumber: number,
  currentStep: StartThisOutput | null,
  completedSteps: DbSavedSession["completed_steps"],
  artifacts: DbSavedSession["artifacts"]
): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from("saved_sessions").upsert(
    {
      user_id: user.id,
      idea_id: ideaId,
      idea_title: ideaTitle,
      step_number: stepNumber,
      current_step: currentStep,
      completed_steps: completedSteps,
      artifacts: artifacts,
      saved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,idea_id" }
  );

  return !error;
}

export async function loadSessionFromDb(
  ideaId: string
): Promise<DbSavedSession | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("saved_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("idea_id", ideaId)
    .single();

  if (error || !data) return null;
  return data as DbSavedSession;
}

export async function loadLatestSessionFromDb(): Promise<DbSavedSession | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("saved_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as DbSavedSession;
}

export async function deleteSessionFromDb(ideaId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("saved_sessions")
    .delete()
    .eq("user_id", user.id)
    .eq("idea_id", ideaId);

  return !error;
}

// -----------------------------------------------------------------------
// Subscription / Pro status
// -----------------------------------------------------------------------

export async function getSubscriptionStatus(): Promise<DbSubscription | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("status, plan, current_period_end")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;
  return data as DbSubscription;
}

export async function isProUser(): Promise<boolean> {
  const sub = await getSubscriptionStatus();
  if (!sub) return false;
  return sub.plan === "pro" && sub.status === "active";
}

// -----------------------------------------------------------------------
// User Stats
// -----------------------------------------------------------------------

export async function getDbStats(): Promise<DbUserStats | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_stats")
    .select("total_sessions, total_outputs, last_session_date")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;
  return data as DbUserStats;
}

export async function recordFinalizationToDb(): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  // Upsert: increment or create
  const existing = await getDbStats();
  const { error } = await supabase.from("user_stats").upsert({
    user_id: user.id,
    total_sessions: (existing?.total_sessions ?? 0) + 1,
    total_outputs: (existing?.total_outputs ?? 0) + 1,
    last_session_date: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  return !error;
}
