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
      ? "All Categories"
      : categories.find((c) => c.id === category)?.label ?? category;

  const categoryIconName =
    category === "all"
      ? "Layers"
      : categories.find((c) => c.id === category)?.icon ?? "BookOpen";

  // Evaluative messaging based on accuracy
  const getFeedbackMessage = () => {
    if (accuracy === 100) {
      return {
        title: "Perfect! Flawless round!",
        desc: "You answered every clinical question correctly. Outstanding recall of medical terms.",
        badgeColor: "bg-success-100 text-success-800 border-success-200",
      };
    }
    if (accuracy >= 80) {
      return {
        title: "Great performance!",
        desc: "You have strong command of this vocabulary. A quick review of any missed terms will ensure long-term mastery.",
        badgeColor: "bg-primary-100 text-primary-800 border-primary-200",
      };
    }
    if (accuracy >= 60) {
      return {
        title: "Good practice round!",
        desc: "You're building solid foundations. Re-practicing tricky terms will cement them into instinctive recall.",
        badgeColor: "bg-accent-100 text-accent-800 border-accent-200",
      };
    }
    return {
      title: "Keep practicing! Repetition builds recall.",
      desc: "Language learning takes repetition. Review the terms below and try another practice drill.",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    };
  };

  const feedback = getFeedbackMessage();

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      {/* Hero Completion Card */}
      <Card className="text-center py-8 px-4 sm:px-8 border-slate-200">
        <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200/80 text-primary-700 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-6 h-6" aria-hidden="true" />
        </div>

        {/* Metadata Badges */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 mb-2">
          <CategoryIcon name={categoryIconName} className="w-3.5 h-3.5 text-slate-500" />
          <span>{level}</span>
          <span>•</span>
          <span>{categoryLabel}</span>
          <span>•</span>
          <span>{totalQuestions} Questions</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {feedback.title}
        </h1>
        <p className="text-slate-600 mt-1 max-w-md mx-auto text-sm">
          {feedback.desc}
        </p>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto">
          {/* Accuracy */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {accuracy}%
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              Accuracy
            </div>
          </div>

          {/* Correct */}
          <div className="p-3.5 rounded-xl bg-success-50/50 border border-success-200 text-center">
            <div className="text-2xl font-bold text-success-700 tabular-nums">
              {correctCount}
            </div>
            <div className="text-xs font-semibold text-success-800 mt-0.5">
              Correct
            </div>
          </div>

          {/* Incorrect */}
          <div className="p-3.5 rounded-xl bg-error-50/50 border border-error-200 text-center">
            <div className="text-2xl font-bold text-error-700 tabular-nums">
              {incorrectCount}
            </div>
            <div className="text-xs font-semibold text-error-800 mt-0.5">
              To Review
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={onPracticeAgain}
            className="w-full sm:w-auto shadow-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" aria-hidden="true" />
            <span>Practice Again</span>
          </Button>

          {incorrectCount > 0 && (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/review")}
              className="w-full sm:w-auto font-medium"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-accent-700" aria-hidden="true" />
              <span>Review Mistakes ({incorrectCount})</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="lg"
            onClick={onNewSession}
            className="w-full sm:w-auto font-medium"
          >
            <BookOpen className="w-4 h-4 mr-1.5" aria-hidden="true" />
            <span>Change Topic</span>
          </Button>
        </div>
      </Card>

      {/* Session Questions Breakdown */}
      <section aria-labelledby="question-breakdown-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2
            id="question-breakdown-heading"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Questions in this Session ({totalQuestions})
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {correctCount} correct • {incorrectCount} incorrect
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
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
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle2
                        className="w-4 h-4 text-success-600"
                        aria-label="Correct"
                      />
                    ) : (
                      <XCircle
                        className="w-4 h-4 text-error-600"
                        aria-label="Incorrect"
                      />
                    )}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {q.explanation.germanText}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs sm:text-sm text-slate-600">
                        {q.explanation.englishText}
                      </span>
                    </div>

                    {/* What user answered if incorrect */}
                    {!isCorrect && selectedOpt && (
                      <p className="text-xs text-error-700 mt-1">
                        Your answer: <s>{selectedOpt.text}</s> → Correct:{" "}
                        <strong className="text-success-800">{correctOpt?.text}</strong>
                      </p>
                    )}

                    {/* Example sentence */}
                    <p className="text-xs text-slate-500 mt-1 italic">
                      &ldquo;{q.explanation.exampleGerman}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Pronounce Word Audio */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={() => onSpeak(spokenGerman)}
                    className="self-start sm:self-center p-2 rounded-lg text-slate-400 hover:text-primary-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
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
            className="text-xs sm:text-sm text-primary-800 hover:text-primary-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Learn Medical German</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </section>
    </div>
  );
}
