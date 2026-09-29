import { Play, RotateCcw, TrendingUp, Trophy, AlertCircle } from "lucide-react";
import type { ReviewStats, ReviewStatus } from "../../types/mistake";
import { Button } from "../Button";

interface ReviewHeaderProps {
  stats: ReviewStats;
  currentFilter: "all" | ReviewStatus;
  onFilterChange: (filter: "all" | ReviewStatus) => void;
  onStartReview: () => void;
  onResetData?: () => void;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Vocabulary Review
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Active recall for clinical vocabulary you previously missed. Consistent
            repetition turns tricky terms into instinctive recall.
          </p>
        </div>

        {canStartReview && (
          <Button
            size="lg"
            onClick={onStartReview}
            className="shrink-0 shadow-md font-semibold cursor-pointer"
          >
            {stats.needsReview > 0 ? (
              <>
                <Play className="w-4 h-4 mr-2 fill-current" aria-hidden="true" />
                <span>Start Review ({stats.needsReview} {stats.needsReview === 1 ? "word" : "words"})</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Strengthen ({stats.improving} improving)</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Tracked */}
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === "all"
              ? "bg-gray-50 border-gray-400 ring-2 ring-gray-200 shadow-xs"
              : "bg-white border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Tracked
            </span>
            <RotateCcw className="w-4 h-4 text-gray-400" aria-hidden="true" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1 tabular-nums">
            {stats.total}
          </div>
          <span className="text-xs text-gray-500 mt-0.5 block">
            vocabulary items
          </span>
        </button>

        {/* Needs Review */}
        <button
          type="button"
          onClick={() => onFilterChange("needsReview")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === "needsReview"
              ? "bg-amber-50/70 border-amber-400 ring-2 ring-amber-200 shadow-xs"
              : "bg-white border-gray-200 hover:border-amber-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Needs Review
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" aria-hidden="true" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">
            {stats.needsReview}
          </div>
          <span className="text-xs text-amber-700 mt-0.5 block">
            requires practice
          </span>
        </button>

        {/* Improving */}
        <button
          type="button"
          onClick={() => onFilterChange("improving")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === "improving"
              ? "bg-primary-50/70 border-primary-400 ring-2 ring-primary-200 shadow-xs"
              : "bg-white border-gray-200 hover:border-primary-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-800">
              Improving
            </span>
            <TrendingUp className="w-4 h-4 text-primary-500" aria-hidden="true" />
          </div>
          <div className="text-2xl font-extrabold text-primary-700 mt-1 tabular-nums">
            {stats.improving}
          </div>
          <span className="text-xs text-primary-700 mt-0.5 block">
            2–3 successful recalls
          </span>
        </button>

        {/* Mastered */}
        <button
          type="button"
          onClick={() => onFilterChange("mastered")}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === "mastered"
              ? "bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200 shadow-xs"
              : "bg-white border-gray-200 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Mastered
            </span>
            <Trophy className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
            {stats.mastered}
          </div>
          <span className="text-xs text-emerald-700 mt-0.5 block">
            4+ successful recalls
          </span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-gray-200 pb-2 overflow-x-auto text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            currentFilter === "all"
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Items ({stats.total})
        </button>
        <button
          type="button"
          onClick={() => onFilterChange("needsReview")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            currentFilter === "needsReview"
              ? "bg-amber-600 text-white"
              : "text-amber-800 hover:bg-amber-50"
          }`}
        >
          Needs Review ({stats.needsReview})
        </button>
        <button
          type="button"
          onClick={() => onFilterChange("improving")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            currentFilter === "improving"
              ? "bg-primary-600 text-white"
              : "text-primary-800 hover:bg-primary-50"
          }`}
        >
          Improving ({stats.improving})
        </button>
        <button
          type="button"
          onClick={() => onFilterChange("mastered")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
            currentFilter === "mastered"
              ? "bg-emerald-600 text-white"
              : "text-emerald-800 hover:bg-emerald-50"
          }`}
        >
          Mastered ({stats.mastered})
        </button>
      </div>
    </div>
  );
}
