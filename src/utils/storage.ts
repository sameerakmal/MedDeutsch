import type { VocabularyItem } from "../types/vocabulary";
import type { QuestionType } from "../types/practice";
import {
  type MistakeRecord,
  type ReviewStatus,
  type ReviewStats,
  REVIEW_THRESHOLDS,
} from "../types/mistake";
import type {
  LearnerProgress,
  RecentActivityItem,
  ActivityType,
} from "../types/progress";

/**
 * Storage key for persisting mistake records.
 * Single namespaced key for isolation and clean migrations.
 */
export const STORAGE_KEY_MISTAKES = "meddeutsch_mistakes_v1";

/**
 * Custom event name dispatched when mistakes storage updates.
 * Allows components in the same window to re-render reactively.
 */
export const MISTAKES_UPDATED_EVENT = "meddeutsch:mistakes_updated";

/**
 * Storage key for persisting aggregate learner progress.
 */
export const STORAGE_KEY_PROGRESS = "meddeutsch_progress_v1";

/**
 * Custom event name dispatched when progress storage updates.
 */
export const PROGRESS_UPDATED_EVENT = "meddeutsch:progress_updated";

/**
 * Default learner progress state for first-time or clean-slate learners.
 */
export const DEFAULT_LEARNER_PROGRESS: LearnerProgress = {
  totalQuestionsAttempted: 0,
  totalCorrectAnswers: 0,
  totalPracticeSessions: 0,
  wordsStudied: [],
  recentActivity: [],
  lastActivityAt: null,
};


/**
 * Checks if browser localStorage is available and writable.
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    const testKey = "__meddeutsch_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Pure heuristic calculator to determine a mistake record's review lifecycle status.
 *
 * Thresholds:
 * - < 2 successful recalls: "needsReview"
 * - >= 2 and < 4 successful recalls: "improving"
 * - >= 4 successful recalls: "mastered"
 */
export function computeReviewStatus(successfulRecallCount: number): ReviewStatus {
  if (successfulRecallCount >= REVIEW_THRESHOLDS.MASTERED_RECALL_COUNT) {
    return "mastered";
  }
  if (successfulRecallCount >= REVIEW_THRESHOLDS.IMPROVING_RECALL_COUNT) {
    return "improving";
  }
  return "needsReview";
}

/**
 * Runtime type guard to safely validate stored mistake records.
 */
function isValidMistakeRecord(data: unknown): data is MistakeRecord {
  if (!data || typeof data !== "object") return false;
  const obj = data as Partial<MistakeRecord>;

  const hasValidItem =
    obj.vocabularyItem &&
    typeof obj.vocabularyItem === "object" &&
    typeof obj.vocabularyItem.id === "string" &&
    typeof obj.vocabularyItem.german === "string" &&
    typeof obj.vocabularyItem.english === "string";

  const hasValidFields =
    typeof obj.itemId === "string" &&
    typeof obj.questionType === "string" &&
    typeof obj.incorrectAnswer === "string" &&
    typeof obj.correctAnswer === "string" &&
    typeof obj.mistakeCount === "number" &&
    typeof obj.successfulRecallCount === "number" &&
    typeof obj.firstMissedAt === "number" &&
    typeof obj.lastAttemptedAt === "number" &&
    (obj.status === "needsReview" ||
      obj.status === "improving" ||
      obj.status === "mastered");

  return Boolean(hasValidItem && hasValidFields);
}

/**
 * Retrieves all stored mistakes as a dictionary keyed by itemId.
 * Handles missing keys, corrupt JSON, or malformed schemas safely.
 */
export function getMistakes(): Record<string, MistakeRecord> {
  if (!isLocalStorageAvailable()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_MISTAKES);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.warn("Storage item is not a valid dictionary. Resetting.");
      return {};
    }

    const validated: Record<string, MistakeRecord> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (isValidMistakeRecord(value)) {
        validated[key] = value;
      }
    }
    return validated;
  } catch (error) {
    console.error("Failed to parse mistakes from localStorage:", error);
    return {};
  }
}

/**
 * Returns mistakes as an array sorted by lastAttemptedAt descending.
 */
export function getMistakesList(): MistakeRecord[] {
  const dictionary = getMistakes();
  return Object.values(dictionary).sort(
    (a, b) => b.lastAttemptedAt - a.lastAttemptedAt
  );
}

/**
 * Returns a specific mistake record by itemId, or null if not tracked.
 */
export function getMistakeRecord(itemId: string): MistakeRecord | null {
  const dictionary = getMistakes();
  return dictionary[itemId] ?? null;
}

/**
 * Returns summary counts for the review dashboard.
 */
export function getReviewStats(): ReviewStats {
  const list = getMistakesList();
  let needsReview = 0;
  let improving = 0;
  let mastered = 0;

  for (const item of list) {
    if (item.status === "mastered") {
      mastered++;
    } else if (item.status === "improving") {
      improving++;
    } else {
      needsReview++;
    }
  }

  return {
    total: list.length,
    needsReview,
    improving,
    mastered,
  };
}

/**
 * Persists the mistakes dictionary to localStorage and notifies listeners.
 */
export function saveMistakes(mistakes: Record<string, MistakeRecord>): void {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY_MISTAKES,
      JSON.stringify(mistakes)
    );
    window.dispatchEvent(new CustomEvent(MISTAKES_UPDATED_EVENT));
  } catch (error) {
    console.error("Failed to save mistakes to localStorage:", error);
  }
}

/**
 * Records an incorrect answer for a vocabulary item.
 * - If new: creates a record with mistakeCount: 1, successfulRecallCount: 0, status: 'needsReview'
 * - If already existing: increments mistakeCount, updates timestamps, resets recall progress
 * - Avoids duplicate records by keying strictly by item.id.
 */
export function recordMistake(
  item: VocabularyItem,
  questionType: QuestionType,
  incorrectAnswer: string,
  correctAnswer: string
): MistakeRecord {
  const mistakes = getMistakes();
  const existing = mistakes[item.id];
  const now = Date.now();

  const record: MistakeRecord = {
    itemId: item.id,
    vocabularyItem: item,
    questionType,
    incorrectAnswer,
    correctAnswer,
    mistakeCount: existing ? existing.mistakeCount + 1 : 1,
    successfulRecallCount: 0, // Reset recall progress upon mistake
    firstMissedAt: existing ? existing.firstMissedAt : now,
    lastAttemptedAt: now,
    lastAnswerCorrect: false,
    status: "needsReview",
  };

  mistakes[item.id] = record;
  saveMistakes(mistakes);
  return record;
}

/**
 * Records a successful recall of a previously missed vocabulary item.
 * - Increments successfulRecallCount
 * - Updates status according to thresholds: 'needsReview' -> 'improving' -> 'mastered'
 * - Preserves mistake history for learner reflection
 * - Returns updated MistakeRecord, or null if item is not currently in the mistake tracker.
 */
export function recordSuccessfulRecall(itemId: string): MistakeRecord | null {
  const mistakes = getMistakes();
  const existing = mistakes[itemId];
  if (!existing) {
    return null;
  }

  const now = Date.now();
  const newRecallCount = existing.successfulRecallCount + 1;
  const newStatus = computeReviewStatus(newRecallCount);

  const updated: MistakeRecord = {
    ...existing,
    successfulRecallCount: newRecallCount,
    lastAttemptedAt: now,
    lastAnswerCorrect: true,
    status: newStatus,
  };

  mistakes[itemId] = updated;
  saveMistakes(mistakes);
  return updated;
}

/**
 * Removes a specific vocabulary item from mistake tracking.
 */
export function clearMistake(itemId: string): void {
  const mistakes = getMistakes();
  if (mistakes[itemId]) {
    delete mistakes[itemId];
    saveMistakes(mistakes);
  }
}

/**
 * Retrieves the aggregate learner progress from localStorage.
 * Defensive against missing keys, invalid JSON, or partial schemas.
 */
export function getLearnerProgress(): LearnerProgress {
  if (!isLocalStorageAvailable()) {
    return { ...DEFAULT_LEARNER_PROGRESS };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) {
      return { ...DEFAULT_LEARNER_PROGRESS };
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...DEFAULT_LEARNER_PROGRESS };
    }

    const totalQuestionsAttempted =
      typeof parsed.totalQuestionsAttempted === "number" &&
      parsed.totalQuestionsAttempted >= 0
        ? parsed.totalQuestionsAttempted
        : 0;

    const totalCorrectAnswers =
      typeof parsed.totalCorrectAnswers === "number" &&
      parsed.totalCorrectAnswers >= 0
        ? parsed.totalCorrectAnswers
        : 0;

    const totalPracticeSessions =
      typeof parsed.totalPracticeSessions === "number" &&
      parsed.totalPracticeSessions >= 0
        ? parsed.totalPracticeSessions
        : 0;

    const wordsStudied: string[] = Array.isArray(parsed.wordsStudied)
      ? Array.from<string>(
          new Set<string>(
            parsed.wordsStudied.filter(
              (id: unknown): id is string =>
                typeof id === "string" && id.trim() !== ""
            )
          )
        )
      : [];

    const recentActivity: RecentActivityItem[] = Array.isArray(
      parsed.recentActivity
    )
      ? parsed.recentActivity
          .filter(
            (act: unknown): act is RecentActivityItem =>
              Boolean(
                act &&
                  typeof act === "object" &&
                  typeof (act as RecentActivityItem).id === "string" &&
                  typeof (act as RecentActivityItem).type === "string" &&
                  typeof (act as RecentActivityItem).description === "string" &&
                  typeof (act as RecentActivityItem).timestamp === "number"
              )
          )
          .slice(0, 10)
      : [];

    const lastActivityAt =
      typeof parsed.lastActivityAt === "number" ? parsed.lastActivityAt : null;

    return {
      totalQuestionsAttempted,
      totalCorrectAnswers,
      totalPracticeSessions,
      wordsStudied,
      recentActivity,
      lastActivityAt,
    };
  } catch (error) {
    console.error("Failed to parse learner progress from localStorage:", error);
    return { ...DEFAULT_LEARNER_PROGRESS };
  }
}

/**
 * Persists learner progress into localStorage and broadcasts an update event.
 */
export function saveLearnerProgress(progress: LearnerProgress): void {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.setItem(
      STORAGE_KEY_PROGRESS,
      JSON.stringify(progress)
    );
    window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT));
  } catch (error) {
    console.error("Failed to save learner progress to localStorage:", error);
  }
}

/**
 * Records newly studied vocabulary item IDs.
 * Deduplicates using a Set so repeatedly studying the same word never inflates the count.
 */
export function recordWordsStudied(itemIds: string[] | string): void {
  const ids = Array.isArray(itemIds) ? itemIds : [itemIds];
  if (ids.length === 0) return;

  const current = getLearnerProgress();
  const set = new Set<string>(current.wordsStudied);
  let changed = false;

  for (const id of ids) {
    if (typeof id === "string" && id.trim() !== "" && !set.has(id)) {
      set.add(id);
      changed = true;
    }
  }

  if (changed) {
    const updated: LearnerProgress = {
      ...current,
      wordsStudied: Array.from<string>(set),
      lastActivityAt: Date.now(),
    };
    saveLearnerProgress(updated);
  }
}


/**
 * Updates question attempt counts when a practice question is answered.
 * Does not mutate mistake tracking (which is managed independently).
 */
export function recordPracticeAnswer(isCorrect: boolean): void {
  const current = getLearnerProgress();
  const updated: LearnerProgress = {
    ...current,
    totalQuestionsAttempted: current.totalQuestionsAttempted + 1,
    totalCorrectAnswers: isCorrect
      ? current.totalCorrectAnswers + 1
      : current.totalCorrectAnswers,
    lastActivityAt: Date.now(),
  };
  saveLearnerProgress(updated);
}

/**
 * Appends a lightweight recent activity event, keeping at most 10 latest events.
 */
export function addRecentActivity(
  type: ActivityType,
  description: string
): void {
  const current = getLearnerProgress();
  const now = Date.now();
  const item: RecentActivityItem = {
    id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    description,
    timestamp: now,
  };

  const updated: LearnerProgress = {
    ...current,
    recentActivity: [item, ...current.recentActivity].slice(0, 10),
    lastActivityAt: now,
  };
  saveLearnerProgress(updated);
}

/**
 * Records a completed practice session and appends a recent activity entry.
 */
export function recordPracticeSessionCompleted(
  correctCount: number,
  totalQuestions: number,
  topicLabel?: string
): void {
  const current = getLearnerProgress();
  const now = Date.now();
  const topicDesc = topicLabel ? ` (${topicLabel})` : "";
  const activityItem: RecentActivityItem = {
    id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
    type: "practice",
    description: `Completed practice quiz${topicDesc} — ${correctCount}/${totalQuestions} correct`,
    timestamp: now,
  };

  const updated: LearnerProgress = {
    ...current,
    totalPracticeSessions: current.totalPracticeSessions + 1,
    recentActivity: [activityItem, ...current.recentActivity].slice(0, 10),
    lastActivityAt: now,
  };
  saveLearnerProgress(updated);
}

/**
 * Records a completed learning session and appends a recent activity entry.
 */
export function recordLearnSessionCompleted(
  wordsCount: number,
  topicLabel?: string
): void {
  const current = getLearnerProgress();
  const now = Date.now();
  const topicDesc = topicLabel ? ` (${topicLabel})` : "";
  const activityItem: RecentActivityItem = {
    id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
    type: "learn",
    description: `Studied ${wordsCount} vocabulary terms${topicDesc}`,
    timestamp: now,
  };

  const updated: LearnerProgress = {
    ...current,
    recentActivity: [activityItem, ...current.recentActivity].slice(0, 10),
    lastActivityAt: now,
  };
  saveLearnerProgress(updated);
}

/**
 * Records a completed review session and appends a recent activity entry.
 */
export function recordReviewSessionCompleted(
  totalAnswered: number,
  improvedCount: number
): void {
  const current = getLearnerProgress();
  const now = Date.now();
  const detail =
    improvedCount > 0
      ? ` — ${improvedCount} improved recall`
      : "";
  const activityItem: RecentActivityItem = {
    id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
    type: "review",
    description: `Reviewed ${totalAnswered} difficult term${
      totalAnswered === 1 ? "" : "s"
    }${detail}`,
    timestamp: now,
  };

  const updated: LearnerProgress = {
    ...current,
    recentActivity: [activityItem, ...current.recentActivity].slice(0, 10),
    lastActivityAt: now,
  };
  saveLearnerProgress(updated);
}

/**
 * Calculates practice accuracy percentage (0-100).
 * Handles zero-attempt cleanly by returning 0.
 */
export function calculateAccuracy(
  correctCount: number,
  attemptedCount: number
): number {
  if (attemptedCount <= 0) return 0;
  return Math.round((correctCount / attemptedCount) * 100);
}

/**
 * Formats a unix timestamp (ms) into a concise relative time string.
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/**
 * Resets all learner data (mistakes and progress) from storage.
 */
export function resetLearningData(): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY_MISTAKES);
    window.localStorage.removeItem(STORAGE_KEY_PROGRESS);
    window.dispatchEvent(new CustomEvent(MISTAKES_UPDATED_EVENT));
    window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT));
  } catch (error) {
    console.error("Failed to reset learning data:", error);
  }
}

