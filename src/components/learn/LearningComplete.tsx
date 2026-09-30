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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Summary Card */}
      <Card className="text-center py-8 px-4 sm:px-8 border-slate-200">
        <div className="w-12 h-12 rounded-xl bg-success-50 border border-success-200 text-success-700 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
          <CategoryIcon name={categoryIconName} className="w-3.5 h-3.5 text-slate-500" />
          <span>{level}</span>
          <span>•</span>
          <span>{categoryLabel}</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Session Complete!
        </h1>
        <p className="text-slate-600 mt-1 text-sm max-w-md mx-auto">
          You have reviewed{" "}
          <strong className="text-slate-900">{items.length} clinical {items.length === 1 ? "term" : "terms"}</strong>.
          Reinforce them now with active practice.
        </p>

        {/* Clear Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() =>
              navigate(`/practice?level=${level}&category=${category}`)
            }
            className="w-full sm:w-auto shadow-xs font-semibold"
          >
            <PenLine className="w-4 h-4 mr-1.5" aria-hidden="true" />
            <span>Practice These Words</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onRestart}
            className="w-full sm:w-auto font-medium"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" aria-hidden="true" />
            <span>Review Set Again</span>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={onNewSession}
            className="w-full sm:w-auto font-medium"
          >
            <BookOpen className="w-4 h-4 mr-1.5" aria-hidden="true" />
            <span>Choose Another Topic</span>
          </Button>
        </div>
      </Card>

      {/* Reviewed Words List */}
      <section aria-labelledby="reviewed-words-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="reviewed-words-heading"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Words in this Session ({items.length})
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Click audio to listen
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {items.map((item, index) => {
            const spokenText = item.article
              ? `${item.article} ${item.german}`
              : item.german;

            return (
              <div
                key={item.id || index}
                className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-semibold text-slate-400 w-5 text-right shrink-0">
                    {index + 1}.
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {item.article && (
                        <span className="text-xs font-bold text-primary-800">
                          {item.article}
                        </span>
                      )}
                      <span className="text-sm font-bold text-slate-900">
                        {item.german}
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        —
                      </span>
                      <span className="text-xs sm:text-sm text-slate-600 block sm:inline">
                        {item.english}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 italic mt-0.5 truncate max-w-md hidden sm:block">
                      &ldquo;{item.exampleGerman}&rdquo;
                    </p>
                  </div>
                </div>

                {speechSupported && (
                  <button
                    type="button"
                    onClick={() => onSpeak(spokenText)}
                    aria-label={`Listen to ${spokenText}`}
                    className="p-2 rounded-lg text-slate-500 hover:text-primary-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
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
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
}
