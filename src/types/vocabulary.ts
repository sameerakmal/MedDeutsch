import type { CEFRLevel } from "./index";

/**
 * Vocabulary categories covering beginner medical/nursing areas.
 * Each category groups related terms that a nurse would encounter.
 */
export type VocabularyCategory =
  | "body"
  | "symptoms"
  | "patientCommunication"
  | "hospital"
  | "basicNursing"
  | "vitalSigns";

/**
 * German grammatical gender, used for noun articles.
 * - der → masculine
 * - die → feminine
 * - das → neuter
 */
export type GermanArticle = "der" | "die" | "das";

/**
 * A single vocabulary item in the learning system.
 *
 * Represents one German word or short phrase with its English translation,
 * grammatical metadata, a categorisation, and an example sentence pair.
 */
export interface VocabularyItem {
  /** Unique identifier (e.g. "body-a1-001") */
  id: string;
  /** The German word or short phrase */
  german: string;
  /** English translation */
  english: string;
  /** Grammatical article for nouns; null for non-nouns (verbs, phrases, adjectives) */
  article: GermanArticle | null;
  /** CEFR proficiency level */
  level: CEFRLevel;
  /** Thematic category */
  category: VocabularyCategory;
  /** Example sentence in German using this word */
  exampleGerman: string;
  /** English translation of the example sentence */
  exampleEnglish: string;
}

/**
 * Metadata for a vocabulary category, used to render category
 * selectors and headings in the UI.
 */
export interface CategoryInfo {
  /** Machine key matching VocabularyCategory */
  id: VocabularyCategory;
  /** Human-readable label */
  label: string;
  /** Short description shown to the learner */
  description: string;
  /** Lucide icon name used in the UI */
  icon: string;
}
