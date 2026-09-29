import type { CEFRLevel, VocabularyCategory, VocabularyItem } from "./vocabulary";

/**
 * Types of questions supported in a practice session.
 * - germanToEnglish: Displays German word/phrase, options are English meanings.
 * - englishToGerman: Displays English meaning, options are German terms.
 * - sentenceCompletion: Displays a German clinical sentence with a blank (___),
 *   options are German vocabulary candidates to fill in the blank.
 */
export type QuestionType =
  | "germanToEnglish"
  | "englishToGerman"
  | "sentenceCompletion";

/**
 * A single choice presented to the learner for a question.
 */
export interface AnswerOption {
  /** Unique option identifier (e.g., "opt-a", "opt-b") */
  id: string;
  /** Display label (e.g., "der Kopf", "head") */
  text: string;
  /** Whether this option represents the correct answer */
  isCorrect: boolean;
  /** Optional reference to the underlying vocabulary item */
  item?: VocabularyItem;
}

/**
 * Educational explanation shown after answering.
 */
export interface QuestionExplanation {
  /** Correct German term with article (e.g. "der Kopf") */
  germanText: string;
  /** English translation */
  englishText: string;
  /** Contextual example sentence in German */
  exampleGerman: string;
  /** Translation of the example sentence in English */
  exampleEnglish: string;
  /** Additional grammatical or clinical usage note */
  note?: string;
}

/**
 * A fully formed practice question ready for rendering.
 */
export interface Question {
  /** Unique question ID within the session */
  id: string;
  /** The question type format */
  type: QuestionType;
  /** The main prompt question text */
  prompt: string;
  /** Optional contextual snippet (e.g. sentence with blank for sentence completion) */
  promptContext?: string;
  /** Optional English translation of the contextual snippet */
  promptContextTranslation?: string;
  /** The target vocabulary item being tested */
  targetItem: VocabularyItem;
  /** 4 multiple choice options (1 correct + 3 distractors, shuffled) */
  options: AnswerOption[];
  /** ID of the correct AnswerOption */
  correctOptionId: string;
  /** Educational explanation displayed in the feedback panel */
  explanation: QuestionExplanation;
}

/**
 * Record of the learner's answer to a specific question.
 */
export interface QuestionAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  answeredAt: number;
}

/**
 * Configuration selected by the user in Practice Setup.
 */
export interface PracticeSessionConfig {
  level: CEFRLevel;
  category: VocabularyCategory | "all";
  questionCount: number;
}

/**
 * In-memory state of an active practice session.
 */
export interface PracticeSession {
  id: string;
  config: PracticeSessionConfig;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, QuestionAnswer>;
  isCompleted: boolean;
  startedAt: number;
  completedAt?: number;
}

/**
 * Session results summary calculated upon completing all questions.
 */
export interface PracticeResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  level: CEFRLevel;
  category: VocabularyCategory | "all";
  questions: Question[];
  answers: Record<string, QuestionAnswer>;
}
