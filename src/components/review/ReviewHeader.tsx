import { Play, RotateCcw, TrendingUp, Trophy, AlertCircle } from "lucide-react";
import type { ReviewStats, ReviewStatus } from "../../types/mistake";
import { Button } from "../Button";

interface ReviewHeaderProps {
  stats: ReviewStats;
  currentFilter: "all" | ReviewStatus;
  onFilterChange: (filter: "all" | ReviewStatus) => void;
  onStartReview: () => void;
}

export function ReviewHeader({
  stats,
  currentFilter,
  onFilterChange,
  onStartReview,
}: ReviewHeaderProps) {
  const reviewableCount = stats.needsReview > 0 ? stats.needsReview : stats.improving;
  const canStartReview = reviewableCount > 0;

  return (
    <div className="space-y-6">
      {/* Top Banner and Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Review Difficult Terms
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-xl">
            Active recall for clinical vocabulary you previously missed. Consistent repetition turns difficult articles and medical terms into instinctive recall.
          </p>
        </div>

        {canStartReview && (
          <Button
            size="lg"
            onClick={onStartReview}
            className="shrink-0 shadow-xs font-semibold cursor-pointer"
          >
            {stats.needsReview > 0 ? (
              <>
                <Play className="w-4 h-4 mr-2 fill-current" aria-hidden="true" />
                <span>Start Review ({stats.needsReview} {stats.needsReview === 1 ? "term" : "terms"})</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Review ({stats.improving} improving)</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Metric Filter Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Tracked */}
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === "all"
              ? "bg-slate-50 border-slate-400 ring-1 ring-slate-400 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total
            </span>
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.total}
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">
            Terms tracked
          </span>
        </button>

        {/* Needs Review */}
        <button
          type="button"
          onClick={() => onFilterChange("needsReview")}
          className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === "needsReview"
              ? "bg-accent-50/60 border-accent-600 ring-1 ring-accent-600 shadow-xs"
              : "bg-white border-slate-200 hover:border-accent-300 hover:bg-accent-50/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-800">
              Needs Review
            </span>
            <AlertCircle className="w-3.5 h-3.5 text-accent-700" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-accent-800 mt-1 tabular-nums">
            {stats.needsReview}
          </div>
          <span className="text-xs text-accent-700 mt-0.5 block font-medium">
            Priority (&lt; 2 recalls)
          </span>
        </button>

        {/* Improving */}
        <button
          type="button"
          onClick={() => onFilterChange("improving")}
          className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === "improving"
              ? "bg-primary-50/60 border-primary-700 ring-1 ring-primary-700 shadow-xs"
              : "bg-white border-slate-200 hover:border-primary-300 hover:bg-primary-50/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-800">
              Improving
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-primary-700" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-primary-800 mt-1 tabular-nums">
            {stats.improving}
          </div>
          <span className="text-xs text-primary-700 mt-0.5 block font-medium">
            2–3 successful recalls
          </span>
        </button>

        {/* Mastered */}
        <button
          type="button"
          onClick={() => onFilterChange("mastered")}
          className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === "mastered"
              ? "bg-success-50/60 border-success-600 ring-1 ring-success-600 shadow-xs"
              : "bg-white border-slate-200 hover:border-success-300 hover:bg-success-50/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-success-800">
              Mastered
            </span>
            <Trophy className="w-3.5 h-3.5 text-success-700" aria-hidden="true" />
          </div>
          <div className="text-2xl font-bold text-success-700 mt-1 tabular-nums">
            {stats.mastered}
          </div>
          <span className="text-xs text-success-700 mt-0.5 block font-medium">
            4+ successful recalls
          </span>
        </button>
      </div>
    </div>
  );
}
