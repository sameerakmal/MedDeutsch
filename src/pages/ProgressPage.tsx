import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  PenLine,
  RotateCcw,
  Clock,
  ArrowRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { Card, Button, ProgressBar } from "../components";
import { useLearnerProgress } from "../hooks";
import { vocabulary } from "../data/vocabulary";
import { formatRelativeTime, resetLearningData } from "../utils";

export function ProgressPage() {
  const { progress, reviewStats, accuracy } = useLearnerProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalVocab = vocabulary.length;
  const studiedSet = new Set(progress.wordsStudied);
  const wordsStudiedCount = progress.wordsStudied.length;
  const remainingCount = Math.max(0, totalVocab - wordsStudiedCount);
  const studiedPercentage =
    totalVocab > 0 ? Math.round((wordsStudiedCount / totalVocab) * 100) : 0;

  // Breakdown by CEFR Level
  const a1Items = vocabulary.filter((item) => item.level === "A1");
  const a2Items = vocabulary.filter((item) => item.level === "A2");

  const a1StudiedCount = a1Items.filter((item) => studiedSet.has(item.id)).length;
  const a2StudiedCount = a2Items.filter((item) => studiedSet.has(item.id)).length;

  const a1Percentage =
    a1Items.length > 0 ? Math.round((a1StudiedCount / a1Items.length) * 100) : 0;
  const a2Percentage =
    a2Items.length > 0 ? Math.round((a2StudiedCount / a2Items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Learning Progress
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          An honest, data-backed overview of your medical German learning. All metrics reflect your actual lessons, practice quizzes, and mistake reviews.
        </p>
      </div>

      {/* 2. Vocabulary Progress Section */}
      <Card className="p-5 sm:p-6 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary-700" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-900">
                Vocabulary Coverage
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Unique clinical terms encountered across all study sessions.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-2xl font-bold text-slate-900">
              {wordsStudiedCount}
            </span>
            <span className="text-xs font-semibold text-slate-500 ml-1.5">/ {totalVocab} terms</span>
          </div>
        </div>

        {wordsStudiedCount > 0 ? (
          <div className="space-y-5">
            <div>
              <ProgressBar
                value={studiedPercentage}
                label="Overall vocabulary encountered"
                showPercent
              />
            </div>

            {/* Level breakdown cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {/* A1 Beginner */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-700">
                    A1 Foundations
                  </span>
                  <span className="font-semibold text-slate-600">
                    {a1StudiedCount} / {a1Items.length} ({a1Percentage}%)
                  </span>
                </div>
                <ProgressBar value={a1Percentage} size="sm" />
                <p className="text-xs text-slate-500">
                  Basic anatomy, common symptoms, and simple hospital routines.
                </p>
              </div>

              {/* A2 Elementary */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-700">
                    A2 Clinical Context
                  </span>
                  <span className="font-semibold text-slate-600">
                    {a2StudiedCount} / {a2Items.length} ({a2Percentage}%)
                  </span>
                </div>
                <ProgressBar value={a2Percentage} size="sm" />
                <p className="text-xs text-slate-500">
                  Vital signs, patient communication, and documentation phrasing.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>{remainingCount} terms remaining to explore</span>
              <Link
                to="/learn"
                className="font-semibold text-primary-800 hover:text-primary-900 transition-colors inline-flex items-center gap-1"
              >
                <span>Learn More Vocabulary</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center border-t border-slate-100 mt-4">
            <p className="text-sm font-semibold text-slate-800 mb-1">
              No vocabulary sessions completed yet.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Explore clinical words with articles, native pronunciation, and hospital examples to begin tracking your coverage.
            </p>
            <Link to="/learn">
              <Button size="sm">
                <span>Start A1 Vocabulary</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* 3. Practice Performance Section */}
      <Card className="p-5 sm:p-6 border-slate-200">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4 text-primary-700" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-900">
                Practice Performance
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Accuracy across interactive quizzes, German articles, and clinical comprehension.
            </p>
          </div>
        </div>

        {progress.totalQuestionsAttempted > 0 ? (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Accuracy
                </span>
                <p className="text-2xl font-bold text-slate-900 mt-1">{accuracy}%</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Questions Answered
                </span>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {progress.totalQuestionsAttempted}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Correct Answers
                </span>
                <p className="text-2xl font-bold text-success-700 mt-1">
                  {progress.totalCorrectAnswers}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Quizzes Completed
                </span>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {progress.totalPracticeSessions}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span>
                {progress.totalQuestionsAttempted - progress.totalCorrectAnswers} incorrect answer(s)
              </span>
              <Link
                to="/practice"
                className="font-semibold text-primary-800 hover:text-primary-900 transition-colors inline-flex items-center gap-1"
              >
                <span>Start Practice Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-800 mb-1">
              No quizzes completed yet.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Practice sessions test your recall through multiple choice, German articles (der/die/das), and clinical sentence completions.
            </p>
            <Link to="/practice">
              <Button size="sm">
                <span>Start Quiz</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* 4. Review Lifecycle Status Section */}
      <Card className="p-5 sm:p-6 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-primary-700" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-900">
                Mistake Review Status
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active recall lifecycle for vocabulary terms missed in practice.
            </p>
          </div>
          {reviewStats.needsReview > 0 && (
            <Link to="/review">
              <Button size="sm" variant="secondary">
                <span>Review {reviewStats.needsReview} {reviewStats.needsReview === 1 ? "term" : "terms"}</span>
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
          {/* Tier 1: Needs Review */}
          <div className="p-3.5 rounded-xl bg-accent-50/50 border border-accent-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-900">
                Needs Review
              </span>
              <span className="text-[11px] font-semibold text-accent-700">&lt; 2 recalls</span>
            </div>
            <p className="text-2xl font-bold text-accent-800 mt-1.5">
              {reviewStats.needsReview}
            </p>
            <p className="text-xs text-accent-700 mt-0.5">
              Recently missed terms requiring active recall drills.
            </p>
          </div>

          {/* Tier 2: Improving */}
          <div className="p-3.5 rounded-xl bg-primary-50/50 border border-primary-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-900">
                Improving
              </span>
              <span className="text-[11px] font-semibold text-primary-700">2–3 recalls</span>
            </div>
            <p className="text-2xl font-bold text-primary-800 mt-1.5">
              {reviewStats.improving}
            </p>
            <p className="text-xs text-primary-700 mt-0.5">
              Answered correctly in review sessions; approaching mastery.
            </p>
          </div>

          {/* Tier 3: Mastered */}
          <div className="p-3.5 rounded-xl bg-success-50/50 border border-success-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-success-900">
                Mastered
              </span>
              <span className="text-[11px] font-semibold text-success-700">4+ recalls</span>
            </div>
            <p className="text-2xl font-bold text-success-700 mt-1.5">
              {reviewStats.mastered}
            </p>
            <p className="text-xs text-success-700 mt-0.5">
              Demonstrated consistent recall over multiple reviews.
            </p>
          </div>
        </div>

        {reviewStats.total === 0 && (
          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
            No terms currently tracked. Any terms missed during quizzes will appear here automatically.
          </p>
        )}
      </Card>

      {/* 5. Complete Learning Activity History */}
      <Card className="p-5 sm:p-6 border-slate-200">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-700" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-900">
                Activity History
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of your recent study sessions and drills.
            </p>
          </div>
        </div>

        {progress.recentActivity.length > 0 ? (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            {progress.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border ${
                      activity.type === "learn"
                        ? "bg-primary-50 border-primary-200 text-primary-700"
                        : activity.type === "practice"
                        ? "bg-slate-50 border-slate-200 text-slate-700"
                        : "bg-accent-50 border-accent-200 text-accent-700"
                    }`}
                  >
                    {activity.type === "learn" && (
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    {activity.type === "practice" && (
                      <PenLine className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    {activity.type === "review" && (
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {activity.description}
                    </p>
                    <span className="text-[11px] font-medium text-slate-500 capitalize">
                      {activity.type} session
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  <span>{formatRelativeTime(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-800 mb-1">
              No activity recorded yet.
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Your session history will automatically update as you study terms, complete quizzes, and review mistakes.
            </p>
            <Link to="/learn">
              <Button size="sm" variant="secondary">
                Start Learning
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* 6. Data Management Section */}
      <Card className="p-5 sm:p-6 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Data Management
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              All learning progress is stored locally in your browser. You can reset your data at any time to start fresh.
            </p>
          </div>

          {!showResetConfirm ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
              className="text-slate-600 hover:text-error-700 hover:border-error-200 shrink-0 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              <span>Reset Learning Progress</span>
            </Button>
          ) : (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 text-error-800 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-error-600" aria-hidden="true" />
                <span>Permanently delete all study progress, quiz history, and mistakes?</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    resetLearningData();
                    setShowResetConfirm(false);
                  }}
                  className="text-xs py-1 px-2.5"
                >
                  Yes, Reset
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResetConfirm(false)}
                  className="text-slate-600 text-xs py-1 px-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
