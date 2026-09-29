/**
 * Types for learner progress tracking and activity history.
 */

export type ActivityType = "learn" | "practice" | "review";

export interface RecentActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: number;
}

export interface LearnerProgress {
  totalQuestionsAttempted: number;
  totalCorrectAnswers: number;
  totalPracticeSessions: number;
  /** Deduplicated array of vocabulary item IDs encountered during Learn sessions */
  wordsStudied: string[];
  /** Latest 5-10 learning activity events */
  recentActivity: RecentActivityItem[];
  /** Timestamp (ms) of the latest activity or null if no activity */
  lastActivityAt: number | null;
}
