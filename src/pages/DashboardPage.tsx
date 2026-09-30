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
    badgeColor: "amber" | "teal";
    buttonText: string;
    buttonLink: string;
    icon: React.ReactNode;
  };

  if (reviewStats.needsReview > 0) {
    primaryAction = {
      title: "Review Difficult Clinical Terms",
      description: `You have ${reviewStats.needsReview} clinical term${
        reviewStats.needsReview === 1 ? "" : "s"
      } requiring active recall. Strengthening these now prevents confusion in hospital handovers.`,
      badgeText: "Priority Review",
      badgeColor: "amber",
      buttonText: `Review ${reviewStats.needsReview} Term${
        reviewStats.needsReview === 1 ? "" : "s"
      }`,
      buttonLink: "/review",
      icon: <RotateCcw className="w-5 h-5 text-accent-700" aria-hidden="true" />,
    };
  } else if (wordsStudiedCount > 0) {
    primaryAction = {
      title: "Test Your Clinical Recall",
      description: `You have studied ${wordsStudiedCount} medical terms. Take a quick quiz to test vocabulary recall, noun genders (der/die/das), and clinical phrasing.`,
      badgeText: "Ready for Practice",
      badgeColor: "teal",
      buttonText: "Start Practice Quiz",
      buttonLink: "/practice",
      icon: <PenLine className="w-5 h-5 text-primary-700" aria-hidden="true" />,
    };
  } else {
    primaryAction = {
      title: "Begin Your First Clinical Lesson",
      description:
        "Start with essential A1 medical German vocabulary: hospital departments, vital signs, anatomy, and everyday patient communication.",
      badgeText: "First Step",
      badgeColor: "teal",
      buttonText: "Start Learning Vocabulary",
      buttonLink: "/learn",
      icon: <BookOpen className="w-5 h-5 text-primary-700" aria-hidden="true" />,
    };
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Focused medical German training for clinical environments. Build A1/A2 vocabulary, practice nursing phrasing, and reinforce missed terms.
        </p>
      </div>

      {/* 2. Primary Next Action Banner */}
      <Card
        className={`border-l-4 ${
          primaryAction.badgeColor === "amber"
            ? "border-l-accent-600 bg-white"
            : "border-l-primary-700 bg-white"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                  primaryAction.badgeColor === "amber"
                    ? "bg-accent-50 text-accent-800 border-accent-200"
                    : "bg-primary-50 text-primary-800 border-primary-200"
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
            <h2 className="text-lg font-bold text-slate-900">
              {primaryAction.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {primaryAction.description}
            </p>
          </div>
          <div className="shrink-0 pt-1 sm:pt-0">
            <Link to={primaryAction.buttonLink}>
              <Button
                variant={primaryAction.badgeColor === "amber" ? "secondary" : "primary"}
                className="w-full sm:w-auto font-semibold shadow-xs"
              >
                <span>{primaryAction.buttonText}</span>
                <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 3. Progress Summary Grid (4 key metrics) */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Learning Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Metric 1: Words Studied */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Words Studied
              </span>
              <BookOpen className="w-4 h-4 text-primary-700" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {wordsStudiedCount}
                <span className="text-xs font-medium text-slate-500 ml-1.5">
                  / {totalVocabularyCount}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
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
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Quiz Accuracy
              </span>
              <TrendingUp className="w-4 h-4 text-primary-700" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {progress.totalQuestionsAttempted > 0 ? `${accuracy}%` : "—"}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {progress.totalQuestionsAttempted > 0
                  ? `${progress.totalCorrectAnswers} of ${progress.totalQuestionsAttempted} answers correct`
                  : "No quiz questions answered"}
              </p>
            </div>
          </Card>

          {/* Metric 3: Questions Answered */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Quiz Questions
              </span>
              <PenLine className="w-4 h-4 text-primary-700" aria-hidden="true" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {progress.totalQuestionsAttempted}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Across {progress.totalPracticeSessions} quiz session
                {progress.totalPracticeSessions === 1 ? "" : "s"}
              </p>
            </div>
          </Card>

          {/* Metric 4: Items Needing Review */}
          <Card
            className={`p-4 flex flex-col justify-between ${
              reviewStats.needsReview > 0
                ? "border-accent-300 bg-accent-50/30"
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  reviewStats.needsReview > 0
                    ? "text-accent-800"
                    : "text-slate-500"
                }`}
              >
                Needs Review
              </span>
              <RotateCcw
                className={`w-4 h-4 ${
                  reviewStats.needsReview > 0
                    ? "text-accent-700"
                    : "text-slate-400"
                }`}
                aria-hidden="true"
              />
            </div>
            <div>
              <div
                className={`text-2xl font-bold tracking-tight ${
                  reviewStats.needsReview > 0
                    ? "text-accent-800"
                    : "text-slate-900"
                }`}
              >
                {reviewStats.needsReview}
              </div>
              <p className="text-xs text-slate-500 mt-1">
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

      {/* 4. Core Actions Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Vocabulary Lessons Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-200/80 flex items-center justify-center text-primary-700 shrink-0">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Learn Medical German</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore medical terms organized by clinical categories: Body Parts,
              Symptoms, Patient Communication, Hospital Departments, and Vital Signs.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              {wordsStudiedCount > 0
                ? `${wordsStudiedCount} terms encountered so far`
                : "A1/A2 nursing vocabulary"}
            </span>
            <Link to="/learn">
              <Button variant="secondary" size="sm">
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Review Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  reviewStats.needsReview > 0
                    ? "bg-accent-50 border-accent-200 text-accent-700"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Review Difficult Terms</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {reviewStats.needsReview > 0
                ? `You have ${reviewStats.needsReview} term${
                    reviewStats.needsReview === 1 ? "" : "s"
                  } flagged for spaced practice. Reinforce difficult articles and translations.`
                : reviewStats.total > 0
                ? "All missed items have been recalled successfully! Keep practicing to retain long-term mastery."
                : "No mistakes recorded. Words you miss during practice quizzes are saved here automatically for active recall."}
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {reviewStats.needsReview > 0 ? (
                <span className="text-accent-800 font-semibold">
                  {reviewStats.needsReview} item
                  {reviewStats.needsReview === 1 ? "" : "s"} need attention
                </span>
              ) : (
                <span className="text-success-700 font-semibold flex items-center gap-1">
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
                <span>{reviewStats.needsReview > 0 ? "Open Review" : "View Tracker"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 5. Recent Activity Feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Recent Activity
          </h2>
          {progress.recentActivity.length > 0 && (
            <Link
              to="/progress"
              className="text-xs font-semibold text-primary-700 hover:text-primary-900 transition-colors"
            >
              View detailed progress →
            </Link>
          )}
        </div>

        {progress.recentActivity.length > 0 ? (
          <Card className="divide-y divide-slate-100 p-0 overflow-hidden" noPadding>
            {progress.recentActivity.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="p-3.5 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
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
          </Card>
        ) : (
          <Card className="py-8 px-4 text-center">
            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              No recent activity yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Your completed lessons, quizzes, and mistake reviews will appear here as you study.
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/learn" className="block group">
            <Card className="p-4 transition-all hover:border-slate-300 hover:shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-700 group-hover:border-primary-200 transition-colors">
                  <BookOpen className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-800 transition-colors">
                    Learn Vocabulary
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Browse clinical terms with pronunciation
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/practice" className="block group">
            <Card className="p-4 transition-all hover:border-slate-300 hover:shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-700 group-hover:border-primary-200 transition-colors">
                  <PenLine className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-800 transition-colors">
                    Practice Quizzes
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Test comprehension and articles
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/review" className="block group">
            <Card className="p-4 transition-all hover:border-slate-300 hover:shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:text-primary-700 group-hover:border-primary-200 transition-colors">
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-800 transition-colors">
                    Review Difficult Terms
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
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
