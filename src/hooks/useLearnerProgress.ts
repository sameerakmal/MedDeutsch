import { useState, useEffect, useCallback } from "react";
import type { LearnerProgress } from "../types/progress";
import type { ReviewStats } from "../types/mistake";
import {
  getLearnerProgress,
  getReviewStats,
  calculateAccuracy,
  PROGRESS_UPDATED_EVENT,
  MISTAKES_UPDATED_EVENT,
} from "../utils";

export interface LearnerDataHook {
  progress: LearnerProgress;
  reviewStats: ReviewStats;
  accuracy: number;
  refresh: () => void;
}

/**
 * Hook providing reactive learner progress and mistake/review statistics.
 * Listens to custom window storage events dispatched by MedDeutsch mutators.
 */
export function useLearnerProgress(): LearnerDataHook {
  const [progress, setProgress] = useState<LearnerProgress>(() =>
    getLearnerProgress()
  );
  const [reviewStats, setReviewStats] = useState<ReviewStats>(() =>
    getReviewStats()
  );

  const refresh = useCallback(() => {
    setProgress(getLearnerProgress());
    setReviewStats(getReviewStats());
  }, []);

  useEffect(() => {
    const handleProgressUpdate = () => {
      setProgress(getLearnerProgress());
    };
    const handleMistakesUpdate = () => {
      setReviewStats(getReviewStats());
    };

    window.addEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
    window.addEventListener(MISTAKES_UPDATED_EVENT, handleMistakesUpdate);

    return () => {
      window.removeEventListener(PROGRESS_UPDATED_EVENT, handleProgressUpdate);
      window.removeEventListener(MISTAKES_UPDATED_EVENT, handleMistakesUpdate);
    };
  }, []);

  const accuracy = calculateAccuracy(
    progress.totalCorrectAnswers,
    progress.totalQuestionsAttempted
  );

  return {
    progress,
    reviewStats,
    accuracy,
    refresh,
  };
}
