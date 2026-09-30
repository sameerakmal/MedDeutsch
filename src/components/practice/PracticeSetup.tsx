import { useState } from "react";
import { ArrowRight, Check, Layers } from "lucide-react";
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
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Practice Quizzes
        </h1>
        <p className="text-slate-600 mt-1 text-sm max-w-2xl">
          Strengthen your clinical vocabulary with interactive multiple-choice questions, German noun genders (der/die/das), sentence completion, and immediate grammar explanations.
        </p>
      </div>

      {/* Step 1: Select CEFR Level */}
      <section aria-labelledby="practice-level-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="practice-level-heading"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            1. Select Level
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Selected: <strong className="text-primary-800">{level}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* A1 Level */}
          <button
            type="button"
            onClick={() => setLevel("A1")}
            className={`text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
              level === "A1"
                ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
            aria-pressed={level === "A1"}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200">
                A1 Level
              </span>
              {level === "A1" && (
                <span className="w-5 h-5 rounded-full bg-primary-700 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" aria-hidden="true" />
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Nursing Foundations
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Core body parts, simple symptoms, basic hospital objects, and first-contact nursing phrases.
            </p>
            <div className="mt-2.5 text-xs text-primary-800 font-semibold">
              <strong>{vocabulary.filter((v) => v.level === "A1").length}</strong> terms available
            </div>
          </button>

          {/* A2 Level */}
          <button
            type="button"
            onClick={() => setLevel("A2")}
            className={`text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
              level === "A2"
                ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
            aria-pressed={level === "A2"}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                A2 Level
              </span>
              {level === "A2" && (
                <span className="w-5 h-5 rounded-full bg-primary-700 text-white flex items-center justify-center">
                  <Check className="w-3 h-3" aria-hidden="true" />
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Clinical Ward Routine
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Vital signs, medical procedures, hygiene routines, and contextual patient communication.
            </p>
            <div className="mt-2.5 text-xs text-primary-800 font-semibold">
              <strong>{vocabulary.filter((v) => v.level === "A2").length}</strong> terms available
            </div>
          </button>
        </div>
      </section>

      {/* Step 2: Select Vocabulary Category */}
      <section aria-labelledby="practice-category-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="practice-category-heading"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            2. Choose Topic
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {availableCount} terms available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* All Categories Option */}
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              selectedCategory === "all"
                ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
            aria-pressed={selectedCategory === "all"}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                selectedCategory === "all"
                  ? "bg-primary-700 text-white border-primary-700"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <Layers className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 truncate">
                  All Categories
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                  {getCategoryCount("all")}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
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
                    ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                }`}
                aria-pressed={isSelected}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? "bg-primary-700 text-white border-primary-700"
                      : "bg-primary-50 text-primary-700 border-primary-200/80"
                  }`}
                >
                  <CategoryIcon name={cat.icon} className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {cat.label}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {count}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
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
          className="text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          3. Question Count
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              value: 5 as const,
              label: "5 Questions",
              desc: "Quick (~2 min)",
            },
            {
              value: 10 as const,
              label: "10 Questions",
              desc: "Standard (~4 min)",
            },
            {
              value: 15 as const,
              label: "15 Questions",
              desc: "Intensive (~6 min)",
            },
            {
              value: "all" as const,
              label: `All (${availableCount})`,
              desc: "Complete drill",
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
                    ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
                aria-pressed={isSelected}
              >
                <div className="text-sm font-bold text-slate-900">
                  {option.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{option.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Launch Action Card - Clean white card, 1px border */}
      <Card className="bg-white border-slate-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary-800 text-xs font-bold uppercase tracking-wider mb-1">
              <span>{level}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CategoryIcon
                  name={selectedCategoryInfo.icon}
                  className="w-3.5 h-3.5 text-primary-700"
                />
                {selectedCategoryInfo.label}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900">
              Ready to start: {actualQuestionCount} interactive{" "}
              {actualQuestionCount === 1 ? "question" : "questions"}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Includes German → English, English → German, and clinical sentence completion.
            </p>
          </div>

          <Button
            size="lg"
            variant="primary"
            onClick={handleStart}
            disabled={actualQuestionCount === 0}
            className="w-full sm:w-auto shrink-0 font-semibold shadow-xs"
          >
            <span>Start Practice ({actualQuestionCount} Questions)</span>
            <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
