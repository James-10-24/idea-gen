"use client";

import { useCallback } from "react";
import { useAuth } from "./auth-context";
import {
  saveSessionToDb,
  loadSessionFromDb,
  loadLatestSessionFromDb,
  deleteSessionFromDb,
  recordFinalizationToDb,
  isProUser,
  type DbSavedSession,
} from "./data";
import {
  saveSession as saveLocal,
  loadSavedSession as loadLocal,
  clearSavedSession as clearLocal,
  type SavedSession,
} from "@/lib/savedSession";
import { recordFinalization as recordLocalFinalization } from "@/lib/sessionStats";

/**
 * Hook that routes save/restore/finalization through Supabase when
 * signed in, or localStorage when anonymous.
 *
 * Returns the same interface regardless of auth state.
 */
export function usePersistedSession() {
  const { user, configured } = useAuth();
  const isSignedIn = configured && !!user;

  const save = useCallback(
    async (data: SavedSession): Promise<boolean> => {
      // Always save locally for instant access
      saveLocal(data);

      if (isSignedIn) {
        return saveSessionToDb(
          data.ideaId,
          data.ideaTitle,
          data.stepNumber,
          data.currentStep,
          data.completedSteps,
          data.artifacts
        );
      }
      return true;
    },
    [isSignedIn]
  );

  const loadByIdea = useCallback(
    async (ideaId: string): Promise<SavedSession | null> => {
      if (isSignedIn) {
        const db = await loadSessionFromDb(ideaId);
        if (db) return dbToLocal(db);
      }
      // Fallback to local
      const local = loadLocal();
      if (local && local.ideaId === ideaId) return local;
      return null;
    },
    [isSignedIn]
  );

  const loadLatest = useCallback(async (): Promise<SavedSession | null> => {
    if (isSignedIn) {
      const db = await loadLatestSessionFromDb();
      if (db) return dbToLocal(db);
    }
    return loadLocal();
  }, [isSignedIn]);

  const clear = useCallback(
    async (ideaId: string): Promise<void> => {
      clearLocal();
      if (isSignedIn) {
        await deleteSessionFromDb(ideaId);
      }
    },
    [isSignedIn]
  );

  const recordFinalization = useCallback(async (): Promise<void> => {
    recordLocalFinalization();
    if (isSignedIn) {
      await recordFinalizationToDb();
    }
  }, [isSignedIn]);

  const checkPro = useCallback(async (): Promise<boolean> => {
    if (!isSignedIn) return false;
    return isProUser();
  }, [isSignedIn]);

  return {
    save,
    loadByIdea,
    loadLatest,
    clear,
    recordFinalization,
    checkPro,
    isSignedIn,
  };
}

/** Convert DB shape to local shape */
function dbToLocal(db: DbSavedSession): SavedSession {
  return {
    ideaId: db.idea_id,
    ideaTitle: db.idea_title,
    stepNumber: db.step_number,
    currentStep: db.current_step,
    completedSteps: db.completed_steps,
    artifacts: db.artifacts,
    savedAt: new Date(db.saved_at).getTime(),
  };
}
