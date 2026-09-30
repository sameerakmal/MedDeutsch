import { useState } from "react";
import { ArrowRight, Check, Layers, Sparkles } from "lucide-react";
import type { CEFRLevel, VocabularyCategory } from "../../types/vocabulary";
import type { PracticeSessionConfig } from "../../types/practice";
import { categories } from "../../data/categories";
import { vocabulary } from "../../data/vocabulary";
import { Button } from "../Button";
import { Card } from "../Card";
import { CategoryIcon } from "../learn/CategoryIcon";

interface PracticeSetupProps {
  onStartPractice: (config: PracticeSessionConfig) => void;
  initialLevel?: CEFRLevel;
  initialCategory?: VocabularyCategory | "all";
}

export function PracticeSetup({
  onStartPractice,
  initialLevel = "A1",
  initialCategory = "body",
}: PracticeSetupProps) {
  const [level, setLevel] = useState<CEFRLevel>(initialLevel);
  const [selectedCategory, setSelectedCategory] = useState<
    VocabularyCategory | "all"
  >(initialCategory);
  const [questionCountChoice, setQuestionCountChoice] = useState<
    5 | 10 | 15 | "all"
  >(10);

  // Available vocabulary matching current level & category
  const candidateItems = vocabulary.filter((item) => {
    const levelMatch = item.level === level;
    const catMatch =
      selectedCategory === "all" || item.category === selectedCategory;
    return levelMatch && catMatch;
  });

  const availableCount = candidateItems.length;

  // Category counts for current level
  const getCategoryCount = (catId: VocabularyCategory | "all"): number => {
    return vocabulary.filter((item) => {
      const levelMatch = item.level === level;
      const catMatch = catId === "all" || item.category === catId;
      return levelMatch && catMatch;
    }).length;
  };

  const actualQuestionCount =
    questionCountChoice === "all"
      ? availableCount
      : Math.min(questionCountChoice, availableCount);

  const handleStart = () => {
    if (actualQuestionCount > 0) {
      onStartPractice({
        level,
        category: selectedCategory,
        questionCount: actualQuestionCount,
      });
    }
  };

  const selectedCategoryInfo =
    selectedCategory === "all"
      ? { label: "All Categories", icon: "Layers" }
      : categories.find((c) => c.id === selectedCategory) ?? {
          label: selectedCategory,
          icon: "BookOpen",
        };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title & Introduction */}
      <div>
        <div className="flex items-center gap-2 text-primary-700 text-sm font-semibold mb-1">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>Active Recall Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Practice Medical German
        </h1>
        <p className="text-gray-600 mt-1.5 text-base">
          Strengthen your clinical vocabulary with interactive multiple-choice
          questions, sentence completion, and instant feedback with grammar notes.
        </p>
      </div>

      {/* Step 1: Select CEFR Level */}
      <section aria-labelledby="practice-level-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="practice-level-heading"
            className="text-sm font-bold uppercase tracking-wider text-gray-700"
          >
            1. Select Your Level
          </h2>
          <span className="text-xs text-gray-500">
            Selected: <strong className="text-primary-700">{level}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* A1 Level */}
          <button
            type="button"
            onClick={() => setLevel("A1")}
            className={`text-left p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
              level === "A1"
                ? "border-primary-600 bg-primary-50/50 ring-2 ring-primary-100 shadow-sm"
                : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50/50"
            }`}
            aria-pressed={level === "A1"}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-800">
                Level A1
              </span>
              {level === "A1" && (
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-base">
              Beginner Medical German
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Core body parts, simple symptoms, basic hospital objects, and
              first-contact nursing phrases.
            </p>
            <div className="mt-3 text-xs text-gray-500">
              <strong>
                {vocabulary.filter((v) => v.level === "A1").length}
              </strong>{" "}
              available terms
            </div>
          </button>

          {/* A2 Level */}
          <button
            type="button"
            onClick={() => setLevel("A2")}
            className={`text-left p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
              level === "A2"
                ? "border-primary-600 bg-primary-50/50 ring-2 ring-primary-100 shadow-sm"
                : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50/50"
            }`}
            aria-pressed={level === "A2"}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-100 text-accent-900">
                Level A2
              </span>
              {level === "A2" && (
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-base">
              Elementary Clinical German
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Vital signs, medical procedures, hygiene routines, and contextual
              patient communication.
            </p>
            <div className="mt-3 text-xs text-gray-500">
              <strong>
                {vocabulary.filter((v) => v.level === "A2").length}
              </strong>{" "}
              available terms
            </div>
          </button>
        </div>
      </section>

      {/* Step 2: Select Vocabulary Category */}
      <section aria-labelledby="practice-category-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="practice-category-heading"
            className="text-sm font-bold uppercase tracking-wider text-gray-700"
          >
            2. Choose Topic or Category
          </h2>
          <span className="text-xs text-gray-500">
            {availableCount} terms matching selection
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* All Categories Option */}
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              selectedCategory === "all"
                ? "border-primary-600 bg-primary-50/60 ring-2 ring-primary-100 shadow-xs"
                : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50/50"
            }`}
            aria-pressed={selectedCategory === "all"}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                selectedCategory === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  All Topics
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                  {getCategoryCount("all")}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                Mixed questions from all medical topics
              </p>
            </div>
          </button>

          {/* Specific Categories */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = getCategoryCount(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? "border-primary-600 bg-primary-50/60 ring-2 ring-primary-100 shadow-xs"
                    : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50/50"
                }`}
                aria-pressed={isSelected}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-primary-600 text-white"
                      : "bg-primary-50 text-primary-700"
                  }`}
                >
                  <CategoryIcon name={cat.icon} className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {cat.label}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 3: Question Count */}
      <section aria-labelledby="practice-count-heading" className="space-y-3">
        <h2
          id="practice-count-heading"
          className="text-sm font-bold uppercase tracking-wider text-gray-700"
        >
          3. Practice Session Length
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              value: 5 as const,
              label: "5 Questions",
              desc: "Quick ~2 min drill",
            },
            {
              value: 10 as const,
              label: "10 Questions",
              desc: "Standard session (recommended)",
            },
            {
              value: 15 as const,
              label: "15 Questions",
              desc: "Extended practice",
            },
            {
              value: "all" as const,
              label: `All (${availableCount})`,
              desc: "Complete topic drill",
            },
          ].map((option) => {
            const isSelected = questionCountChoice === option.value;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => setQuestionCountChoice(option.value)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary-600 bg-primary-50/70 ring-2 ring-primary-100 shadow-xs"
                    : "border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50"
                }`}
                aria-pressed={isSelected}
              >
                <div className="text-sm font-bold text-gray-900">
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Launch Action Card */}
      <Card className="bg-gradient-to-r from-primary-900 to-primary-800 text-white p-5 sm:p-6 shadow-md border-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary-200 text-xs font-semibold uppercase tracking-wider mb-1">
              <span>{level}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CategoryIcon
                  name={selectedCategoryInfo.icon}
                  className="w-3.5 h-3.5"
                />
                {selectedCategoryInfo.label}
              </span>
            </div>
            <div className="text-lg font-bold text-white">
              Ready to start: {actualQuestionCount} interactive{" "}
              {actualQuestionCount === 1 ? "question" : "questions"}
            </div>
            <p className="text-xs sm:text-sm text-primary-100 mt-0.5">
              Includes German → English, English → German, and clinical sentence completion.
            </p>
          </div>

          <Button
            size="lg"
            onClick={handleStart}
            disabled={actualQuestionCount === 0}
            className="w-full sm:w-auto bg-white text-primary-900 hover:bg-primary-50 focus-visible:ring-white shrink-0 font-bold shadow-sm"
          >
            Start Practice
            <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
