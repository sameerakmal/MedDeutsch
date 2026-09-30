import { Link } from "react-router-dom";
import { BarChart3, PenLine, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { Card, Button } from "../components";
import { useLearnerProgress } from "../hooks";

export function ResultsPage() {
  const { progress, accuracy } = useLearnerProgress();
  const hasResults = progress.totalPracticeSessions > 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Quiz Results
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Overview of your practice quizzes, accuracy rates, and clinical recall performance.
        </p>
      </div>

      {hasResults ? (
        <div className="space-y-6">
          {/* Key Quiz Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="p-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Quizzes Completed
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {progress.totalPracticeSessions}
              </p>
            </Card>

            <Card className="p-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Accuracy
              </span>
              <p className="text-2xl font-bold text-primary-800 mt-1">
                {accuracy}%
              </p>
            </Card>

            <Card className="p-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Questions Answered
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {progress.totalQuestionsAttempted}
              </p>
            </Card>

            <Card className="p-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Correct Answers
              </span>
              <p className="text-2xl font-bold text-success-700 mt-1">
                {progress.totalCorrectAnswers}
              </p>
            </Card>
          </div>

          {/* Action Card */}
          <Card className="p-5 sm:p-6 border-slate-200 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Ready for another practice quiz?
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Test articles, translations, and clinical sentence completions across all medical categories.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link to="/practice">
                  <Button size="md" className="font-semibold shadow-xs">
                    <PenLine className="w-4 h-4 mr-1.5" aria-hidden="true" />
                    <span>Start Quiz</span>
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
            <Card className="p-5 border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-700" aria-hidden="true" />
                <span>Recent Quiz Sessions</span>
              </h2>
              <ul className="divide-y divide-slate-100">
                {progress.recentActivity
                  .filter((a) => a.type === "practice")
                  .slice(0, 5)
                  .map((act) => (
                    <li key={act.id} className="py-2.5 flex items-center justify-between text-sm">
                      <span className="text-slate-900 font-semibold">{act.description}</span>
                      <span className="text-xs text-slate-500 font-medium">
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
        <Card className="py-12 sm:py-16 px-6 text-center border-slate-200 bg-white">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1.5">
            No Quiz Results Yet
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            Complete a practice quiz to view your accuracy, question breakdown, and learning performance here.
          </p>
          <Link to="/practice">
            <Button size="lg" className="font-semibold shadow-xs">
              <PenLine className="w-4 h-4 mr-1.5" aria-hidden="true" />
              <span>Start First Quiz</span>
              <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
