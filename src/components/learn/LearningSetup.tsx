import { useState } from "react";
import { BookOpen, Check, Layers, ArrowRight } from "lucide-react";
import type { CEFRLevel, VocabularyCategory, VocabularyItem } from "../../types/vocabulary";
import { categories } from "../../data/categories";
import { vocabulary } from "../../data/vocabulary";
import { Button } from "../Button";
import { Card } from "../Card";
import { CategoryIcon } from "./CategoryIcon";

interface LearningSetupProps {
  onStartSession: (
    level: CEFRLevel,
    category: VocabularyCategory | "all",
    items: VocabularyItem[]
  ) => void;
  initialLevel?: CEFRLevel;
  initialCategory?: VocabularyCategory | "all";
}

export function LearningSetup({
  onStartSession,
  initialLevel = "A1",
  initialCategory = "body",
}: LearningSetupProps) {
  const [level, setLevel] = useState<CEFRLevel>(initialLevel);
  const [selectedCategory, setSelectedCategory] = useState<
    VocabularyCategory | "all"
  >(initialCategory);
  const [sessionBatchSize, setSessionBatchSize] = useState<"quick" | "standard" | "all">("all");

  // Filter items matching current level & category selection
  const candidateItems = vocabulary.filter((item) => {
    const levelMatch = item.level === level;
    const categoryMatch =
      selectedCategory === "all" || item.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  // Calculate words count per category for current level
  const getCategoryCount = (catId: VocabularyCategory | "all"): number => {
    return vocabulary.filter((item) => {
      const levelMatch = item.level === level;
      const categoryMatch = catId === "all" || item.category === catId;
      return levelMatch && categoryMatch;
    }).length;
  };

  // Determine actual items to include based on batch choice
  const determineSessionItems = (): VocabularyItem[] => {
    if (sessionBatchSize === "quick") {
      return candidateItems.slice(0, Math.min(5, candidateItems.length));
    }
    if (sessionBatchSize === "standard") {
      return candidateItems.slice(0, Math.min(10, candidateItems.length));
    }
    return candidateItems;
  };

  const finalSessionItems = determineSessionItems();

  const handleStart = () => {
    if (finalSessionItems.length > 0) {
      onStartSession(level, selectedCategory, finalSessionItems);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title & Intro */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Learn Medical German
        </h1>
        <p className="text-gray-600 mt-1.5 text-base">
          Master essential clinical vocabulary step-by-step with clear definitions,
          gender articles, example sentences, and native pronunciation.
        </p>
      </div>

      {/* Step 1: Select CEFR Level */}
      <section aria-labelledby="level-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="level-heading" className="text-sm font-bold uppercase tracking-wider text-gray-700">
            1. Select Your Level
          </h2>
          <span className="text-xs text-gray-500">
            Current level: <strong className="text-primary-700">{level}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* A1 Level Card */}
          <button
            type="button"
            onClick={() => setLevel("A1")}
            className={`text-left p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
              level === "A1"
                ? "border-primary-600 bg-primary-50/50 ring-2 ring-primary-100 shadow-sm"
                : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-800">
                  Level A1
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">
                  Beginner German
                </h3>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  level === "A1"
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {level === "A1" && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Essential body parts, basic symptoms, hospital objects, and simple phrases for Indian nurses starting their German journey.
            </p>
            <p className="text-xs text-primary-700 font-medium mt-3">
              {getCategoryCount("all")} words available in A1
            </p>
          </button>

          {/* A2 Level Card */}
          <button
            type="button"
            onClick={() => setLevel("A2")}
            className={`text-left p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
              level === "A2"
                ? "border-primary-600 bg-primary-50/50 ring-2 ring-primary-100 shadow-sm"
                : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-100 text-accent-900">
                  Level A2
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2">
                  Elementary German
                </h3>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  level === "A2"
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {level === "A2" && <Check className="w-3.5 h-3.5" aria-hidden="true" />}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              More contextual terminology, routine nursing tasks, vital signs monitoring, and patient dialogue.
            </p>
            <p className="text-xs text-primary-700 font-medium mt-3">
              {vocabulary.filter((item) => item.level === "A2").length} words available in A2
            </p>
          </button>
        </div>
      </section>

      {/* Step 2: Select Category */}
      <section aria-labelledby="category-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="category-heading" className="text-sm font-bold uppercase tracking-wider text-gray-700">
            2. Choose a Category
          </h2>
          <span className="text-xs text-gray-500">
            Selected:{" "}
            <strong className="text-gray-800">
              {selectedCategory === "all"
                ? "All Categories"
                : categories.find((c) => c.id === selectedCategory)?.label}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* All Categories Option */}
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedCategory === "all"
                ? "border-primary-600 bg-primary-50/60 ring-2 ring-primary-100 shadow-sm"
                : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50/50"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
                  <Layers className="w-5 h-5" aria-hidden="true" />
                </div>
                {selectedCategory === "all" && (
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" aria-hidden="true" />
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-base">
                All Categories
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                Study vocabulary across all medical and nursing topics for {level}.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-primary-700 font-medium">
              <span>All topics</span>
              <span className="bg-primary-100/70 px-2 py-0.5 rounded-full">
                {getCategoryCount("all")} words
              </span>
            </div>
          </button>

          {/* Specific Categories */}
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-primary-600 bg-primary-50/60 ring-2 ring-primary-100 shadow-sm"
                    : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
                      <CategoryIcon name={cat.icon} className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-primary-700 font-medium">
                  <span>{cat.label}</span>
                  <span className="bg-primary-100/70 px-2 py-0.5 rounded-full">
                    {count} words
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 3: Session Size (Sensible Batching) */}
      {candidateItems.length > 5 && (
        <section aria-labelledby="size-heading" className="space-y-3">
          <h2 id="size-heading" className="text-sm font-bold uppercase tracking-wider text-gray-700">
            3. Session Length
          </h2>

          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 text-sm">
            <button
              type="button"
              onClick={() => setSessionBatchSize("quick")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                sessionBatchSize === "quick"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Quick (5 words)
            </button>
            {candidateItems.length >= 10 && (
              <button
                type="button"
                onClick={() => setSessionBatchSize("standard")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  sessionBatchSize === "standard"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Standard (10 words)
              </button>
            )}
            <button
              type="button"
              onClick={() => setSessionBatchSize("all")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                sessionBatchSize === "all"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All {candidateItems.length} words
            </button>
          </div>
        </section>
      )}

      {/* Summary & Start Button Card */}
      <Card className="bg-gradient-to-r from-primary-50 to-white border-primary-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-700 mb-1">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Ready to Learn</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {level} • {selectedCategory === "all" ? "All Categories" : categories.find((c) => c.id === selectedCategory)?.label}
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              Study {finalSessionItems.length} medical German words with pronunciation and clinical context.
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleStart}
            disabled={finalSessionItems.length === 0}
            className="w-full sm:w-auto shrink-0 shadow-sm"
          >
            Start Learning ({finalSessionItems.length} words)
            <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
