import { Link } from "react-router-dom";
import {
  BookOpen,
  PenLine,
  RotateCcw,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, Button } from "../components";
import { useLearnerProgress } from "../hooks";
import { vocabulary } from "../data/vocabulary";
import { formatRelativeTime } from "../utils";

export function DashboardPage() {
  const { progress, reviewStats, accuracy } = useLearnerProgress();
  const totalVocabularyCount = vocabulary.length;
  const wordsStudiedCount = progress.wordsStudied.length;

  // Determine the primary dynamic next action
  let primaryAction: {
    title: string;
    description: string;
    badgeText: string;
    badgeColor: "amber" | "teal" | "blue";
    buttonText: string;
    buttonLink: string;
    icon: React.ReactNode;
  };

  if (reviewStats.needsReview > 0) {
    primaryAction = {
      title: "Review Difficult Terms",
      description: `You have ${reviewStats.needsReview} clinical term${
        reviewStats.needsReview === 1 ? "" : "s"
      } requiring active recall. Strengthening these now prevents confusion in hospital routines.`,
      badgeText: "Priority Review",
      badgeColor: "amber",
      buttonText: `Review ${reviewStats.needsReview} Term${
        reviewStats.needsReview === 1 ? "" : "s"
      }`,
      buttonLink: "/review",
      icon: <RotateCcw className="w-5 h-5 text-amber-600" aria-hidden="true" />,
    };
  } else if (wordsStudiedCount > 0) {
    primaryAction = {
      title: "Test Your Knowledge",
      description: `You have studied ${wordsStudiedCount} medical terms. Take a quick practice quiz to test recall, articles, and clinical comprehension.`,
      badgeText: "Ready for Practice",
      badgeColor: "teal",
      buttonText: "Start Practice Quiz",
      buttonLink: "/practice",
      icon: <PenLine className="w-5 h-5 text-primary-600" aria-hidden="true" />,
    };
  } else {
    primaryAction = {
      title: "Begin Your First Lesson",
      description:
        "Start with essential A1 medical German vocabulary: hospital departments, vital signs, anatomy, and everyday patient communication.",
      badgeText: "Getting Started",
      badgeColor: "teal",
      buttonText: "Start Learning Vocabulary",
      buttonLink: "/learn",
      icon: <BookOpen className="w-5 h-5 text-primary-600" aria-hidden="true" />,
    };
  }

  return (
    <div className="space-y-6">
      {/* 1. Welcome / Header Section */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Continue your German practice
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
          Focused medical German learning for clinical environments. Build A1/A2
          vocabulary, practice medical phrasing, and reinforce missed terms.
        </p>
      </div>

      {/* 2. Primary Next Action Banner */}
      <Card className="border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50/50 via-white to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  primaryAction.badgeColor === "amber"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-primary-100 text-primary-800 border border-primary-200"
                }`}
              >
                {primaryAction.badgeColor === "amber" ? (
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                {primaryAction.badgeText}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {primaryAction.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {primaryAction.description}
            </p>
          </div>
          <div className="shrink-0 pt-2 sm:pt-0">
            <Link to={primaryAction.buttonLink}>
              <Button
                variant={
                  primaryAction.badgeColor === "amber" ? "secondary" : "primary"
                }
                className="w-full sm:w-auto shadow-sm"
              >
                {primaryAction.buttonText}
                <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 3. Progress Summary Grid (4 key metrics) */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Learning Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Words Studied */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wide">
                Words Studied
              </span>
              <BookOpen className="w-4 h-4 text-primary-600" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {wordsStudiedCount}
                <span className="text-xs font-normal text-gray-500 ml-1">
                  / {totalVocabularyCount}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {wordsStudiedCount > 0
                  ? `${Math.round(
                      (wordsStudiedCount / totalVocabularyCount) * 100
                    )}% of dictionary encountered`
                  : "No lessons completed yet"}
              </p>
            </div>
          </Card>

          {/* Metric 2: Practice Accuracy */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wide">
                Practice Accuracy
              </span>
              <TrendingUp className="w-4 h-4 text-primary-600" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {progress.totalQuestionsAttempted > 0 ? `${accuracy}%` : "—"}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {progress.totalQuestionsAttempted > 0
                  ? `${progress.totalCorrectAnswers} of ${progress.totalQuestionsAttempted} answers correct`
                  : "No quiz questions answered"}
              </p>
            </div>
          </Card>

          {/* Metric 3: Questions Answered */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wide">
                Quiz Questions
              </span>
              <PenLine className="w-4 h-4 text-primary-600" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight">
                {progress.totalQuestionsAttempted}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Across {progress.totalPracticeSessions} quiz session
                {progress.totalPracticeSessions === 1 ? "" : "s"}
              </p>
            </div>
          </Card>

          {/* Metric 4: Items Needing Review */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wide">
                Needs Review
              </span>
              <RotateCcw
                className={`w-4 h-4 ${
                  reviewStats.needsReview > 0
                    ? "text-amber-600"
                    : "text-gray-400"
                }`}
                aria-hidden="true"
              />
            </div>
            <div>
              <div
                className={`text-2xl font-bold tracking-tight ${
                  reviewStats.needsReview > 0
                    ? "text-amber-700"
                    : "text-gray-900"
                }`}
              >
                {reviewStats.needsReview}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {reviewStats.needsReview > 0
                  ? `${reviewStats.total} total mistake${
                      reviewStats.total === 1 ? "" : "s"
                    } tracked`
                  : reviewStats.total > 0
                  ? "All tracked mistakes improving"
                  : "No missed words recorded"}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Core Actions Section (Continue Learning & Review Card) */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Continue Learning Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-primary-700" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-gray-900">Vocabulary Lessons</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Explore medical terms organized by clinical categories: Body Parts,
              Symptoms, Patient Communication, Hospital Departments, and Vital Signs.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {wordsStudiedCount > 0
                ? `${wordsStudiedCount} terms encountered so far`
                : "A1/A2 nursing vocabulary"}
            </span>
            <Link to="/learn">
              <Button variant="secondary" size="sm">
                Continue Learning
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Review Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  reviewStats.needsReview > 0 ? "bg-amber-100" : "bg-gray-100"
                }`}
              >
                <RotateCcw
                  className={`w-4 h-4 ${
                    reviewStats.needsReview > 0
                      ? "text-amber-700"
                      : "text-gray-600"
                  }`}
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-semibold text-gray-900">Mistake Review</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {reviewStats.needsReview > 0
                ? `You have ${reviewStats.needsReview} term${
                    reviewStats.needsReview === 1 ? "" : "s"
                  } flagged for spaced practice. Reinforce difficult articles and translations.`
                : reviewStats.total > 0
                ? "All missed items have been recalled successfully! Keep up the practice to retain mastery."
                : "No mistakes currently recorded. Words you miss during practice quizzes are saved here automatically."}
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {reviewStats.needsReview > 0 ? (
                <span className="text-amber-700 font-medium">
                  {reviewStats.needsReview} item
                  {reviewStats.needsReview === 1 ? "" : "s"} need attention
                </span>
              ) : (
                <span className="text-green-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  All caught up
                </span>
              )}
            </span>
            <Link to="/review">
              <Button
                variant={reviewStats.needsReview > 0 ? "primary" : "secondary"}
                size="sm"
              >
                {reviewStats.needsReview > 0 ? "Open Review" : "View Tracker"}
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 5. Recent Activity Feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Recent Learning Activity
          </h2>
          {progress.recentActivity.length > 0 && (
            <Link
              to="/progress"
              className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors"
            >
              View detailed progress
            </Link>
          )}
        </div>

        {progress.recentActivity.length > 0 ? (
          <Card className="divide-y divide-gray-100 overflow-hidden">
            {progress.recentActivity.slice(0, 6).map((activity) => (
              <div
                key={activity.id}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activity.type === "learn"
                        ? "bg-primary-100 text-primary-700"
                        : activity.type === "practice"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {activity.type === "learn" && (
                      <BookOpen className="w-4 h-4" aria-hidden="true" />
                    )}
                    {activity.type === "practice" && (
                      <PenLine className="w-4 h-4" aria-hidden="true" />
                    )}
                    {activity.type === "review" && (
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.description}
                    </p>
                    <span className="text-xs text-gray-400 capitalize">
                      {activity.type} session
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{formatRelativeTime(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </Card>
        ) : (
          <Card className="py-8 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              No recent activity yet
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
              Your completed lessons, quizzes, and mistake reviews will appear here
              as you study.
            </p>
            <Link to="/learn">
              <Button size="sm" variant="secondary">
                Start First Lesson
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* 6. Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/learn" className="block group">
            <Card className="p-4 transition-all hover:border-primary-300 hover:shadow-xs group-focus-visible:ring-2">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    Learn Vocabulary
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Browse clinical terms with pronunciation
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/practice" className="block group">
            <Card className="p-4 transition-all hover:border-primary-300 hover:shadow-xs group-focus-visible:ring-2">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                  <PenLine className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    Practice Quizzes
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Test comprehension and articles
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/review" className="block group">
            <Card className="p-4 transition-all hover:border-primary-300 hover:shadow-xs group-focus-visible:ring-2">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    Review Mistakes
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Reinforce missed questions
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
