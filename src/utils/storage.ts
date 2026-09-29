import type { VocabularyItem } from "../types/vocabulary";
import type { QuestionType } from "../types/practice";
import {
  type MistakeRecord,
  type ReviewStatus,
  type ReviewStats,
  REVIEW_THRESHOLDS,
} from "../types/mistake";

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
 * Resets all mistake records from storage.
 */
export function resetLearningData(): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY_MISTAKES);
    window.dispatchEvent(new CustomEvent(MISTAKES_UPDATED_EVENT));
  } catch (error) {
    console.error("Failed to reset learning data:", error);
  }
}
