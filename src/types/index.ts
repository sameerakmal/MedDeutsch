/**
 * Shared type definitions for MedDeutsch.
 *
 * These types will be expanded in later phases as vocabulary,
 * quiz, and progress features are implemented.
 */

/** CEFR proficiency levels supported by this application */
export type CEFRLevel = "A1" | "A2";

/** Navigation route definition used by the sidebar/header */
export interface NavItem {
  label: string;
  path: string;
  icon: string; // Lucide icon name
}
