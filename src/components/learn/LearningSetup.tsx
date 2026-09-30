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
    <div className="space-y-6">
      {/* Page Title & Intro */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Learn Medical German
        </h1>
        <p className="text-slate-600 mt-1 text-sm max-w-2xl">
          Master clinical German terms step-by-step with grammatical gender (der/die/das), native audio pronunciation, and real hospital example sentences.
        </p>
      </div>

      {/* Step 1: Select CEFR Level */}
      <section aria-labelledby="level-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="level-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            1. Select Level
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Selected: <strong className="text-primary-800">{level}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* A1 Level Card */}
          <button
            type="button"
            onClick={() => setLevel("A1")}
            className={`text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
              level === "A1"
                ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200">
                  Level A1
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Beginner Medical German
                </h3>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  level === "A1"
                    ? "border-primary-700 bg-primary-700 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {level === "A1" && <Check className="w-3 h-3" aria-hidden="true" />}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Essential body parts, basic symptoms, hospital objects, and simple communication for nurses starting in Germany.
            </p>
            <p className="text-xs text-primary-800 font-semibold mt-2.5">
              {vocabulary.filter((item) => item.level === "A1").length} words available
            </p>
          </button>

          {/* A2 Level Card */}
          <button
            type="button"
            onClick={() => setLevel("A2")}
            className={`text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
              level === "A2"
                ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  Level A2
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Elementary Clinical German
                </h3>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  level === "A2"
                    ? "border-primary-700 bg-primary-700 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {level === "A2" && <Check className="w-3 h-3" aria-hidden="true" />}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Vital signs documentation, patient admission dialogue, clinical handovers, and routine nursing interventions.
            </p>
            <p className="text-xs text-primary-800 font-semibold mt-2.5">
              {vocabulary.filter((item) => item.level === "A2").length} words available
            </p>
          </button>
        </div>
      </section>

      {/* Step 2: Select Category */}
      <section aria-labelledby="category-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="category-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            2. Choose Category
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Selected:{" "}
            <strong className="text-slate-800">
              {selectedCategory === "all"
                ? "All Categories"
                : categories.find((c) => c.id === selectedCategory)?.label}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* All Categories Option */}
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedCategory === "all"
                ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                </div>
                {selectedCategory === "all" && (
                  <span className="w-4 h-4 rounded-full bg-primary-700 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" aria-hidden="true" />
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                All Categories
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                Study vocabulary across all medical and nursing topics for {level}.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Total</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
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
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200/80 flex items-center justify-center text-primary-700">
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-primary-700 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>Topic</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                    {count} words
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 3: Session Size */}
      {candidateItems.length > 5 && (
        <section aria-labelledby="size-heading" className="space-y-3">
          <h2 id="size-heading" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            3. Session Length
          </h2>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setSessionBatchSize("quick")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                sessionBatchSize === "quick"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Quick (5 words)
            </button>
            {candidateItems.length >= 10 && (
              <button
                type="button"
                onClick={() => setSessionBatchSize("standard")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  sessionBatchSize === "standard"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Standard (10 words)
              </button>
            )}
            <button
              type="button"
              onClick={() => setSessionBatchSize("all")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                sessionBatchSize === "all"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All {candidateItems.length} words
            </button>
          </div>
        </section>
      )}

      {/* Summary & Start Button Card */}
      <Card className="bg-white border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-800 mb-1">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ready to Learn</span>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {level} • {selectedCategory === "all" ? "All Categories" : categories.find((c) => c.id === selectedCategory)?.label}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Study {finalSessionItems.length} medical German terms with pronunciation and clinical context.
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleStart}
            disabled={finalSessionItems.length === 0}
            className="w-full sm:w-auto shrink-0 font-semibold shadow-xs"
          >
            <span>Start Learning ({finalSessionItems.length} words)</span>
            <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
