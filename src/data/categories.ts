import type { CategoryInfo } from "../types/vocabulary";

/**
 * All vocabulary categories with display metadata.
 *
 * The `icon` field stores a Lucide icon name for future UI rendering.
 */
export const categories: CategoryInfo[] = [
  {
    id: "body",
    label: "Body Parts",
    description: "Learn the German names for parts of the body.",
    icon: "Heart",
  },
  {
    id: "symptoms",
    label: "Symptoms & Conditions",
    description: "Describe common symptoms and health conditions.",
    icon: "Thermometer",
  },
  {
    id: "patientCommunication",
    label: "Patient Communication",
    description: "Phrases for speaking with patients in German.",
    icon: "MessageCircle",
  },
  {
    id: "hospital",
    label: "Hospital & Equipment",
    description: "Vocabulary for the hospital environment.",
    icon: "Building2",
  },
  {
    id: "basicNursing",
    label: "Basic Nursing",
    description: "Everyday nursing tasks and actions.",
    icon: "Stethoscope",
  },
  {
    id: "vitalSigns",
    label: "Vital Signs",
    description: "Terms for measuring and recording vital signs.",
    icon: "Activity",
  },
];

/** Look up a single category by its ID */
export function getCategoryById(id: string): CategoryInfo | undefined {
  return categories.find((c) => c.id === id);
}
