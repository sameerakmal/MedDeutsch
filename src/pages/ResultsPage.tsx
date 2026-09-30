import { Link } from "react-router-dom";
import { BarChart3, PenLine, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { Card, Button } from "../components";
import { useLearnerProgress } from "../hooks";

export function ResultsPage() {
  const { progress, accuracy } = useLearnerProgress();
  const hasResults = progress.totalPracticeSessions > 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Quiz Results
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl">
          Overview of your practice quizzes, accuracy rates, and clinical recall performance.
        </p>
      </div>

      {hasResults ? (
        <div className="space-y-6">
          {/* Key Quiz Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Quizzes Completed
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {progress.totalPracticeSessions}
              </p>
            </Card>

            <Card className="p-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Accuracy
              </span>
              <p className="text-2xl font-bold text-primary-700 mt-1">
                {accuracy}%
              </p>
            </Card>

            <Card className="p-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Questions Answered
              </span>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {progress.totalQuestionsAttempted}
              </p>
            </Card>

            <Card className="p-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Correct Answers
              </span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {progress.totalCorrectAnswers}
              </p>
            </Card>
          </div>

          {/* Action Card */}
          <Card className="p-6 bg-gradient-to-r from-primary-50/50 via-white to-white border-primary-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Ready for another practice round?
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Test articles, translations, and clinical sentence completions across all medical categories.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link to="/practice">
                  <Button size="md">
                    <PenLine className="w-4 h-4 mr-1.5" aria-hidden="true" />
                    <span>Start Practice Quiz</span>
                  </Button>
                </Link>
                <Link to="/review">
                  <Button variant="secondary" size="md">
                    <RotateCcw className="w-4 h-4 mr-1.5" aria-hidden="true" />
                    <span>Review Mistakes</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Recent Quiz Sessions Activity */}
          {progress.recentActivity.filter((a) => a.type === "practice").length > 0 && (
            <Card className="p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-600" aria-hidden="true" />
                <span>Recent Practice Sessions</span>
              </h2>
              <ul className="divide-y divide-gray-100">
                {progress.recentActivity
                  .filter((a) => a.type === "practice")
                  .slice(0, 5)
                  .map((act) => (
                    <li key={act.id} className="py-2.5 flex items-center justify-between text-sm">
                      <span className="text-gray-800 font-medium">{act.description}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(act.timestamp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </li>
                  ))}
              </ul>
            </Card>
          )}
        </div>
      ) : (
        <Card className="py-12 sm:py-16 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-primary-50">
            <BarChart3 className="w-7 h-7" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1.5">
            No quiz results yet
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            Complete a practice quiz to view your accuracy, question breakdown, and learning performance here.
          </p>
          <Link to="/practice">
            <Button size="lg">
              <PenLine className="w-4 h-4 mr-1.5" aria-hidden="true" />
              <span>Start Practice Quiz</span>
              <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
