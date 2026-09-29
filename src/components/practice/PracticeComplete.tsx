import { useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Volume2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { PracticeResult } from "../../types/practice";
import { categories } from "../../data/categories";
import { Button } from "../Button";
import { Card } from "../Card";
import { CategoryIcon } from "../learn/CategoryIcon";

interface PracticeCompleteProps {
  result: PracticeResult;
  onPracticeAgain: () => void;
  onNewSession: () => void;
  onSpeak: (text: string) => void;
  speechSupported: boolean;
}

export function PracticeComplete({
  result,
  onPracticeAgain,
  onNewSession,
  onSpeak,
  speechSupported,
}: PracticeCompleteProps) {
  const navigate = useNavigate();

  const {
    totalQuestions,
    correctCount,
    incorrectCount,
    accuracy,
    level,
    category,
    questions,
    answers,
  } = result;

  const categoryLabel =
    category === "all"
      ? "All Topics"
      : categories.find((c) => c.id === category)?.label ?? category;

  const categoryIconName =
    category === "all"
      ? "Layers"
      : categories.find((c) => c.id === category)?.icon ?? "BookOpen";

  // Evaluative messaging based on accuracy
  const getFeedbackMessage = () => {
    if (accuracy === 100) {
      return {
        title: "Perfekt! Flawless Session!",
        desc: "You answered every clinical question correctly. Your medical German recall in this area is outstanding.",
        badgeColor: "bg-emerald-100 text-emerald-800",
      };
    }
    if (accuracy >= 80) {
      return {
        title: "Ausgezeichnet! Great Performance!",
        desc: "You have strong command of this vocabulary. A quick review of any missed terms will make you even stronger.",
        badgeColor: "bg-primary-100 text-primary-800",
      };
    }
    if (accuracy >= 60) {
      return {
        title: "Good Practice Session!",
        desc: "You're building solid foundations. Re-practising these terms will cement them into long-term recall.",
        badgeColor: "bg-amber-100 text-amber-800",
      };
    }
    return {
      title: "Keep Going! Practice Makes Perfect",
      desc: "Language learning takes repetition. Review the terms below and try another practice drill.",
      badgeColor: "bg-rose-100 text-rose-800",
    };
  };

  const feedback = getFeedbackMessage();

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Hero Completion Card */}
      <Card className="text-center py-8 sm:py-10 px-4 sm:px-8 border-primary-200 bg-gradient-to-b from-primary-50/50 via-white to-white shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-primary-50">
          <Trophy className="w-8 h-8" aria-hidden="true" />
        </div>

        {/* Metadata Badges */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100/80 text-primary-800 mb-3">
          <CategoryIcon name={categoryIconName} className="w-3.5 h-3.5" />
          <span>Level {level}</span>
          <span>•</span>
          <span>{categoryLabel}</span>
          <span>•</span>
          <span>{totalQuestions} Questions</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {feedback.title}
        </h1>
        <p className="text-gray-600 mt-2 max-w-lg mx-auto text-sm sm:text-base">
          {feedback.desc}
        </p>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
          {/* Accuracy */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-primary-700 tabular-nums">
              {accuracy}%
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">
              Accuracy
            </div>
          </div>

          {/* Correct */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums">
              {correctCount}
            </div>
            <div className="text-xs font-medium text-emerald-800 mt-0.5">
              Correct
            </div>
          </div>

          {/* Incorrect */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-rose-50/60 border border-rose-100">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 tabular-nums">
              {incorrectCount}
            </div>
            <div className="text-xs font-medium text-rose-800 mt-0.5">
              To Review
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onPracticeAgain}
            className="w-full sm:w-auto shadow-sm"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Practice Again
          </Button>

          {incorrectCount > 0 && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/review")}
              className="w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-primary-600" aria-hidden="true" />
              Review Mistakes
            </Button>
          )}

          <Button
            variant="ghost"
            size="lg"
            onClick={onNewSession}
            className="w-full sm:w-auto"
          >
            <BookOpen className="w-4 h-4 mr-1.5" aria-hidden="true" />
            Change Topic
          </Button>
        </div>
      </Card>

      {/* Session Questions Breakdown */}
      <section aria-labelledby="question-breakdown-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            id="question-breakdown-heading"
            className="text-sm font-bold uppercase tracking-wider text-gray-700"
          >
            Questions In This Session ({totalQuestions})
          </h2>
          <span className="text-xs text-gray-500">
            {correctCount} correct • {incorrectCount} incorrect
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
          {questions.map((q, index) => {
            const answer = answers[q.id];
            const isCorrect = answer?.isCorrect ?? false;
            const selectedOpt = q.options.find(
              (o) => o.id === answer?.selectedOptionId
            );
            const correctOpt = q.options.find(
              (o) => o.id === q.correctOptionId
            );
            const spokenGerman = q.explanation.germanText;

            return (
              <div
                key={q.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2
                        className="w-5 h-5 text-emerald-600"
                        aria-label="Correct"
                      />
                    ) : (
                      <XCircle
                        className="w-5 h-5 text-rose-600"
                        aria-label="Incorrect"
                      />
                    )}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-bold text-gray-900 font-serif">
                        {q.explanation.germanText}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {q.explanation.englishText}
                      </span>
                    </div>

                    {/* What user answered if incorrect */}
                    {!isCorrect && selectedOpt && (
                      <p className="text-xs text-rose-700 mt-1">
                        Your answer: <s>{selectedOpt.text}</s> → Correct:{" "}
                        <strong>{correctOpt?.text}</strong>
                      </p>
                    )}

                    {/* Example sentence */}
                    <p className="text-xs text-gray-500 mt-1 italic">
                      &ldquo;{q.explanation.exampleGerman}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Pronounce Word Audio */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={() => onSpeak(spokenGerman)}
                    className="self-start sm:self-center p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer shrink-0"
                    title={`Listen to ${spokenGerman}`}
                    aria-label={`Listen to ${spokenGerman}`}
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Back to Learn or Dashboard links */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate("/learn")}
            className="text-xs sm:text-sm text-primary-700 hover:text-primary-800 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Learn more medical vocabulary</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    </div>
  );
}
