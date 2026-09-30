import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import type { CEFRLevel, VocabularyCategory, VocabularyItem } from "../../types/vocabulary";
import { categories } from "../../data/categories";
import { Button } from "../Button";
import { ProgressBar } from "../ProgressBar";
import { VocabularyLearningCard } from "./VocabularyLearningCard";
import { CategoryIcon } from "./CategoryIcon";

interface LearningSessionProps {
  level: CEFRLevel;
  category: VocabularyCategory | "all";
  items: VocabularyItem[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  speakingText: string | null;
  speechSupported: boolean;
}

export function LearningSession({
  level,
  category,
  items,
  currentIndex,
  onNext,
  onPrev,
  onExit,
  onSpeak,
  isSpeaking,
  speakingText,
  speechSupported,
}: LearningSessionProps) {
  const currentItem = items[currentIndex];
  const total = items.length;
  const progressPercent = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const isLastWord = currentIndex === total - 1;

  const categoryLabel =
    category === "all"
      ? "All Categories"
      : categories.find((c) => c.id === category)?.label ?? category;

  const categoryIconName =
    category === "all"
      ? "Layers"
      : categories.find((c) => c.id === category)?.icon ?? "BookOpen";

  // Keyboard navigation support: Left / Right arrows, Space to speak
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "BUTTON"
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === " " && currentItem) {
        e.preventDefault();
        const spoken = currentItem.article
          ? `${currentItem.article} ${currentItem.german}`
          : currentItem.german;
        onSpeak(spoken);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, currentItem, onNext, onPrev, onSpeak]);

  if (!currentItem) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Session Top Bar: Navigation, Topic Info, and Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          {/* Exit / Return button */}
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit learning session"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            <span>Exit</span>
          </button>

          {/* Level & Category Info */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700">
              <CategoryIcon name={categoryIconName} className="w-3.5 h-3.5 text-slate-500" />
              <span>{categoryLabel}</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-primary-50 text-primary-800 border border-primary-200">
              {level}
            </span>
          </div>
        </div>

        {/* Progress Bar & Word Counter */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
            <span role="status" aria-live="polite">
              Word {currentIndex + 1} of {total}
            </span>
            <span className="tabular-nums font-semibold">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <ProgressBar value={progressPercent} size="sm" />
        </div>
      </div>

      {/* Main Vocabulary Learning Card */}
      <main aria-label="Vocabulary learning card">
        <VocabularyLearningCard
          item={currentItem}
          onSpeak={onSpeak}
          isSpeaking={isSpeaking}
          speakingText={speakingText}
          speechSupported={speechSupported}
        />
      </main>

      {/* Session Bottom Navigation Controls */}
      <nav aria-label="Learning card controls" className="pt-2">
        <div className="flex items-center justify-between gap-3">
          {/* Previous Button */}
          <Button
            type="button"
            variant="secondary"
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="w-28 sm:w-32"
            aria-label="Previous word"
          >
            <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
            <span>Previous</span>
          </Button>

          {/* Indicator text */}
          <div className="text-center hidden sm:block">
            <span className="text-xs font-semibold text-slate-400">
              {currentIndex + 1} / {total}
            </span>
          </div>

          {/* Next / Complete Button */}
          <Button
            type="button"
            variant="primary"
            onClick={onNext}
            className="w-28 sm:w-36 font-semibold"
            aria-label={isLastWord ? "Complete session" : "Next word"}
          >
            {isLastWord ? (
              <>
                <span>Finish</span>
                <Check className="w-4 h-4 ml-1" aria-hidden="true" />
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>

        {/* Accessible Keyboard Shortcut Hint (Desktop only) */}
        <p className="text-center text-xs text-slate-400 mt-4 select-none hidden sm:block">
          Tip: Keyboard <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono text-[11px]">←</kbd> / <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono text-[11px]">→</kbd> to navigate, <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono text-[11px]">Space</kbd> to listen.
        </p>
      </nav>
    </div>
  );
}
