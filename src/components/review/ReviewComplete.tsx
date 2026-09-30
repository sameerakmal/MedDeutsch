import { useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Volume2,
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
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      {/* Hero Summary Card */}
      <Card className="text-center py-8 px-4 sm:px-8 border-slate-200">
        <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200/80 text-primary-700 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-accent-700" />
          <span>Review Drill Complete</span>
          <span>•</span>
          <span>{totalReviewed} {totalReviewed === 1 ? "term" : "terms"} reviewed</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Review Session Finished!
        </h1>
        <p className="text-slate-600 mt-1 max-w-md mx-auto text-sm">
          Targeted revision builds strong neural pathways for fast clinical communication in the ward.
        </p>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {accuracy}%
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              Accuracy
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-success-50/50 border border-success-200 text-center">
            <div className="text-2xl font-bold text-success-700 tabular-nums">
              {correctCount}
            </div>
            <div className="text-xs font-semibold text-success-800 mt-0.5">
              Recalled
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-accent-50/50 border border-accent-200 text-center">
            <div className="text-2xl font-bold text-accent-800 tabular-nums">
              {incorrectCount}
            </div>
            <div className="text-xs font-semibold text-accent-800 mt-0.5">
              Needs Practice
            </div>
          </div>
        </div>

        {/* Progression Highlights */}
        {(newlyMastered > 0 || newlyImproving > 0) && (
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800">
            {newlyMastered > 0 && (
              <span className="flex items-center gap-1 text-success-800">
                <Trophy className="w-3.5 h-3.5 text-success-600" />
                {newlyMastered} {newlyMastered === 1 ? "term" : "terms"} now Mastered!
              </span>
            )}
            {newlyMastered > 0 && newlyImproving > 0 && <span className="text-slate-300">•</span>}
            {newlyImproving > 0 && (
              <span className="flex items-center gap-1 text-primary-800">
                <TrendingUp className="w-3.5 h-3.5 text-primary-700" />
                {newlyImproving} {newlyImproving === 1 ? "term" : "terms"} improving!
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onBackToList}
            className="w-full sm:w-auto shadow-xs font-semibold cursor-pointer"
          >
            <span>Back to Review List</span>
          </Button>

          {hasMoreToReview && (
            <Button
              variant="secondary"
              size="lg"
              onClick={onReviewAgain}
              className="w-full sm:w-auto font-medium cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              <span>Review More Terms</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate("/practice")}
            className="w-full sm:w-auto font-medium cursor-pointer"
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            <span>Practice New Words</span>
          </Button>
        </div>
      </Card>

      {/* Breakdown of Reviewed Items */}
      <section aria-labelledby="review-breakdown-heading" className="space-y-3">
        <h2
          id="review-breakdown-heading"
          className="text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          Terms in this Session ({totalReviewed})
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {items.map((summary, idx) => {
            const displayGerman = formatGermanTerm(summary.record.vocabularyItem);

            return (
              <div
                key={summary.record.itemId}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {summary.isCorrect ? (
                      <CheckCircle2
                        className="w-4 h-4 text-success-600"
                        aria-label="Recalled"
                      />
                    ) : (
                      <XCircle
                        className="w-4 h-4 text-accent-700"
                        aria-label="Needs Practice"
                      />
                    )}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        #{idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {displayGerman}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs sm:text-sm text-slate-600">
                        {summary.record.vocabularyItem.english}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5 italic">
                      &ldquo;{summary.record.vocabularyItem.exampleGerman}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {/* Status Change Indicator */}
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <span className="text-slate-400">Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        summary.newStatus === "mastered"
                          ? "bg-success-50 text-success-800 border-success-200"
                          : summary.newStatus === "improving"
                          ? "bg-primary-50 text-primary-800 border-primary-200"
                          : "bg-accent-50 text-accent-800 border-accent-200"
                      }`}
                    >
                      {summary.newStatus === "needsReview"
                        ? "Needs Review"
                        : summary.newStatus === "improving"
                        ? "Improving"
                        : "Mastered"}
                    </span>
                  </div>

                  {/* Audio */}
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={() => onSpeak(displayGerman)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-primary-800 hover:bg-slate-100 transition-colors cursor-pointer"
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
      </section>
    </div>
  );
}
