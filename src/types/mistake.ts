import type { VocabularyItem } from "./vocabulary";
import type { QuestionType } from "./practice";

/**
 * Review status representing the learner's mastery lifecycle for a vocabulary item:
 * - needsReview: recently missed item requiring focused active recall.
 * - improving: answered correctly during review/practice (>= 2 successful recalls).
 * - mastered: demonstrated repeated successful recall (>= 4 successful recalls).
 */
export type ReviewStatus = "needsReview" | "improving" | "mastered";

/**
 * Recall thresholds for advancing through the review lifecycle.
 * Note: These are prototype learning heuristics designed for clear user comprehension.
 */
export const REVIEW_THRESHOLDS = {
  /** Recalls needed to transition from 'needsReview' to 'improving' */
  IMPROVING_RECALL_COUNT: 2,
  /** Recalls needed to transition from 'improving' to 'mastered' */
  MASTERED_RECALL_COUNT: 4,
} as const;

/**
 * Data model for an individual vocabulary mistake record.
 */
export interface MistakeRecord {
  /** Unique ID matching VocabularyItem.id */
  itemId: string;
  /** Full vocabulary item details for self-contained rendering and offline safety */
  vocabularyItem: VocabularyItem;
  /** The question type when this term was missed */
  questionType: QuestionType;
  /** The incorrect answer text submitted by the learner */
  incorrectAnswer: string;
  /** The correct answer text */
  correctAnswer: string;
  /** Total number of times this term was missed */
  mistakeCount: number;
  /** Number of times answered correctly in review or practice */
  successfulRecallCount: number;
  /** Timestamp (ms) when this item was first missed */
  firstMissedAt: number;
  /** Timestamp (ms) of the most recent attempt (practice or review) */
  lastAttemptedAt: number;
  /** Whether the most recent attempt was correct */
  lastAnswerCorrect?: boolean;
  /** Current review lifecycle status */
  status: ReviewStatus;
}

/**
 * Summary counts across review statuses.
 */
export interface ReviewStats {
  total: number;
  needsReview: number;
  improving: number;
  mastered: number;
}
