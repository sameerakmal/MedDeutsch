import { useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Volume2,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import type { ReviewSessionResult } from "./ReviewSession";
import { formatGermanTerm } from "../../utils/quiz";
import { Button } from "../Button";
import { Card } from "../Card";

interface ReviewCompleteProps {
  result: ReviewSessionResult;
  onReviewAgain: () => void;
  onBackToList: () => void;
  onSpeak: (text: string) => void;
  speechSupported: boolean;
  hasMoreToReview: boolean;
}

export function ReviewComplete({
  result,
  onReviewAgain,
  onBackToList,
  onSpeak,
  speechSupported,
  hasMoreToReview,
}: ReviewCompleteProps) {
  const navigate = useNavigate();
  const { totalReviewed, correctCount, incorrectCount, accuracy, items } = result;

  const newlyMastered = items.filter(
    (i) => i.newStatus === "mastered" && i.previousStatus !== "mastered"
  ).length;

  const newlyImproving = items.filter(
    (i) => i.newStatus === "improving" && i.previousStatus === "needsReview"
  ).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Hero Summary Card */}
      <Card className="text-center py-8 sm:py-10 px-4 sm:px-8 border-primary-200 bg-gradient-to-b from-primary-50/50 via-white to-white shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-primary-50">
          <Trophy className="w-8 h-8" aria-hidden="true" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100/80 text-primary-800 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Recall Complete</span>
          <span>•</span>
          <span>{totalReviewed} {totalReviewed === 1 ? "Word" : "Words"} Reviewed</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Review Drill Finished!
        </h1>
        <p className="text-gray-600 mt-2 max-w-lg mx-auto text-sm sm:text-base">
          Targeted revision builds strong neural pathways for fast clinical
          communication.
        </p>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
          <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary-700 tabular-nums">
              {accuracy}%
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">
              Accuracy
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums">
              {correctCount}
            </div>
            <div className="text-xs font-medium text-emerald-800 mt-0.5">
              Recalled
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/60 border border-amber-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 tabular-nums">
              {incorrectCount}
            </div>
            <div className="text-xs font-medium text-amber-800 mt-0.5">
              Still Tricky
            </div>
          </div>
        </div>

        {/* Progression Highlights */}
        {(newlyMastered > 0 || newlyImproving > 0) && (
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-900">
            {newlyMastered > 0 && (
              <span className="flex items-center gap-1 font-semibold">
                <Trophy className="w-4 h-4 text-emerald-600" />
                {newlyMastered} word{newlyMastered > 1 ? "s" : ""} reached Mastered!
              </span>
            )}
            {newlyMastered > 0 && newlyImproving > 0 && <span>•</span>}
            {newlyImproving > 0 && (
              <span className="flex items-center gap-1 font-semibold">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                {newlyImproving} word{newlyImproving > 1 ? "s" : ""} advanced to Improving!
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onBackToList}
            className="w-full sm:w-auto shadow-sm cursor-pointer"
          >
            <span>Review List</span>
          </Button>

          {hasMoreToReview && (
            <Button
              variant="secondary"
              size="lg"
              onClick={onReviewAgain}
              className="w-full sm:w-auto cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              <span>Review More Tricky Words</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate("/practice")}
            className="w-full sm:w-auto cursor-pointer"
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            <span>Practice New Words</span>
          </Button>
        </div>
      </Card>

      {/* Breakdown of Reviewed Items */}
      <section aria-labelledby="review-breakdown-heading" className="space-y-4">
        <h2
          id="review-breakdown-heading"
          className="text-sm font-bold uppercase tracking-wider text-gray-700"
        >
          Reviewed In This Session ({totalReviewed})
        </h2>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
          {items.map((summary, idx) => {
            const displayGerman = formatGermanTerm(summary.record.vocabularyItem);

            return (
              <div
                key={summary.record.itemId}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {summary.isCorrect ? (
                      <CheckCircle2
                        className="w-5 h-5 text-emerald-600"
                        aria-label="Recalled correctly"
                      />
                    ) : (
                      <XCircle
                        className="w-5 h-5 text-amber-600"
                        aria-label="Still tricky"
                      />
                    )}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        #{idx + 1}
                      </span>
                      <span className="text-sm font-bold text-gray-900 font-serif">
                        {displayGerman}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {summary.record.vocabularyItem.english}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1 italic">
                      &ldquo;{summary.record.vocabularyItem.exampleGerman}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {/* Status Change Indicator */}
                  <div className="text-xs font-medium flex items-center gap-1.5">
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                        summary.newStatus === "mastered"
                          ? "bg-emerald-100 text-emerald-800"
                          : summary.newStatus === "improving"
                          ? "bg-primary-100 text-primary-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {summary.newStatus}
                    </span>
                  </div>

                  {/* Audio */}
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={() => onSpeak(displayGerman)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"
                      title={`Listen to ${displayGerman}`}
                      aria-label={`Listen to ${displayGerman}`}
                    >
                      <Volume2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate("/practice")}
            className="text-xs sm:text-sm text-primary-700 hover:text-primary-800 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Go to Practice Engine</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onBackToList}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Back to Review Dashboard
          </button>
        </div>
      </section>
    </div>
  );
}
