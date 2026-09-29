import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  PenLine,
  RotateCcw,
  BookOpen,
  Volume2,
  LayoutDashboard,
} from "lucide-react";
import type { CEFRLevel, VocabularyCategory, VocabularyItem } from "../../types/vocabulary";
import { categories } from "../../data/categories";
import { Button } from "../Button";
import { Card } from "../Card";
import { CategoryIcon } from "./CategoryIcon";

interface LearningCompleteProps {
  level: CEFRLevel;
  category: VocabularyCategory | "all";
  items: VocabularyItem[];
  onRestart: () => void;
  onNewSession: () => void;
  onSpeak: (text: string) => void;
  speechSupported: boolean;
}

export function LearningComplete({
  level,
  category,
  items,
  onRestart,
  onNewSession,
  onSpeak,
  speechSupported,
}: LearningCompleteProps) {
  const navigate = useNavigate();

  const categoryLabel =
    category === "all"
      ? "All Categories"
      : categories.find((c) => c.id === category)?.label ?? category;

  const categoryIconName =
    category === "all"
      ? "Layers"
      : categories.find((c) => c.id === category)?.icon ?? "BookOpen";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Celebration & Summary Card */}
      <Card className="text-center py-8 sm:py-10 px-4 sm:px-8 border-primary-200 bg-gradient-to-b from-primary-50/40 to-white shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-primary-50">
          <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 mb-2">
          <CategoryIcon name={categoryIconName} className="w-3.5 h-3.5" />
          <span>{level}</span>
          <span>•</span>
          <span>{categoryLabel}</span>
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Session Complete!
        </h1>
        <p className="text-gray-600 mt-2 max-w-md mx-auto text-base">
          You&apos;ve completed the learning session and reviewed{" "}
          <strong className="text-gray-900">{items.length} vocabulary {items.length === 1 ? "item" : "items"}</strong>.
        </p>

        {/* Clear Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() =>
              navigate(`/practice?level=${level}&category=${category}`)
            }
            className="w-full sm:w-auto shadow-sm"
          >
            <PenLine className="w-4 h-4 mr-1" aria-hidden="true" />
            Practice these words
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onRestart}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-1" aria-hidden="true" />
            Review set again
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={onNewSession}
            className="w-full sm:w-auto"
          >
            <BookOpen className="w-4 h-4 mr-1" aria-hidden="true" />
            Choose another topic
          </Button>
        </div>
      </Card>

      {/* Reviewed Words List */}
      <section aria-labelledby="reviewed-words-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="reviewed-words-heading"
            className="text-sm font-bold uppercase tracking-wider text-gray-700"
          >
            Words in this Session ({items.length})
          </h2>
          <span className="text-xs text-gray-500">
            Click audio to listen again
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
          {items.map((item, index) => {
            const spokenText = item.article
              ? `${item.article} ${item.german}`
              : item.german;

            return (
              <div
                key={item.id || index}
                className="p-4 sm:px-5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <span className="text-xs font-semibold text-gray-400 w-5 text-right shrink-0 pt-0.5 sm:pt-0">
                    {index + 1}.
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {item.article && (
                        <span className="text-sm font-medium text-primary-700">
                          {item.article}
                        </span>
                      )}
                      <span className="text-base font-bold text-gray-900">
                        {item.german}
                      </span>
                      <span className="text-sm text-gray-500 hidden sm:inline">
                        —
                      </span>
                      <span className="text-sm text-gray-600 block sm:inline">
                        {item.english}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 italic mt-0.5 truncate max-w-md hidden sm:block">
                      &ldquo;{item.exampleGerman}&rdquo;
                    </p>
                  </div>
                </div>

                {speechSupported && (
                  <button
                    type="button"
                    onClick={() => onSpeak(spokenText)}
                    aria-label={`Listen to ${spokenText}`}
                    title={`Listen to ${spokenText}`}
                    className="p-2 rounded-lg text-primary-700 hover:bg-primary-50 transition-colors cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Return to Dashboard Link */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
}
