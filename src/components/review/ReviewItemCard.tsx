import {
  Volume2,
  AlertCircle,
  TrendingUp,
  Trophy,
  Trash2,
  Clock,
  Sparkles,
} from "lucide-react";
import type { MistakeRecord } from "../../types/mistake";
import { formatGermanTerm } from "../../utils/quiz";
import { categories } from "../../data/categories";
import { CategoryIcon } from "../learn/CategoryIcon";
import { REVIEW_THRESHOLDS } from "../../types/mistake";

interface ReviewItemCardProps {
  record: MistakeRecord;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  speakingText: string | null;
  speechSupported: boolean;
  onRemove: (itemId: string) => void;
  onReviewSingle?: (record: MistakeRecord) => void;
}

/**
 * Human-friendly relative time string.
 */
function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function ReviewItemCard({
  record,
  onSpeak,
  isSpeaking,
  speakingText,
  speechSupported,
  onRemove,
  onReviewSingle,
}: ReviewItemCardProps) {
  const {
    itemId,
    vocabularyItem,
    mistakeCount,
    successfulRecallCount,
    lastAttemptedAt,
    status,
    incorrectAnswer,
    correctAnswer,
  } = record;

  const displayGerman = formatGermanTerm(vocabularyItem);
  const isWordSpeaking = isSpeaking && speakingText === displayGerman;
  const isSentenceSpeaking =
    isSpeaking && speakingText === vocabularyItem.exampleGerman;

  const categoryMeta = categories.find((c) => c.id === vocabularyItem.category);
  const categoryLabel = categoryMeta?.label ?? vocabularyItem.category;
  const categoryIconName = categoryMeta?.icon ?? "BookOpen";

  // Status Badge Configuration
  const getStatusBadge = () => {
    switch (status) {
      case "needsReview":
        return {
          label: "Needs Review",
          color: "bg-accent-50 text-accent-800 border-accent-200",
          icon: <AlertCircle className="w-3.5 h-3.5 text-accent-700" aria-hidden="true" />,
        };
      case "improving":
        return {
          label: `Improving (${successfulRecallCount}/${REVIEW_THRESHOLDS.MASTERED_RECALL_COUNT})`,
          color: "bg-primary-50 text-primary-800 border-primary-200",
          icon: <TrendingUp className="w-3.5 h-3.5 text-primary-700" aria-hidden="true" />,
        };
      case "mastered":
        return {
          label: "Mastered",
          color: "bg-success-50 text-success-800 border-success-200",
          icon: <Trophy className="w-3.5 h-3.5 text-success-700" aria-hidden="true" />,
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-4">
      {/* Top Meta Header: Status & Level/Category Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${statusBadge.color}`}
          >
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </span>

          {/* CEFR Level & Category */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <CategoryIcon name={categoryIconName} className="w-3 h-3 text-slate-500" />
            <span>{vocabularyItem.level}</span>
            <span>•</span>
            <span>{categoryLabel}</span>
          </span>
        </div>

        {/* Last Attempted Timestamp */}
        <span
          className="text-xs text-slate-400 inline-flex items-center gap-1 font-medium"
          title={`Last attempted ${new Date(lastAttemptedAt).toLocaleString()}`}
        >
          <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
          <span>{formatRelativeTime(lastAttemptedAt)}</span>
        </span>
      </div>

      {/* Main Term & English Translation */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {displayGerman}
            </span>
            <span className="text-slate-400 font-light">—</span>
            <span className="text-base sm:text-lg text-primary-800 font-semibold">
              {vocabularyItem.english}
            </span>
          </div>

          {/* Pronunciation Audio Button */}
          {speechSupported && (
            <button
              type="button"
              onClick={() => onSpeak(displayGerman)}
              disabled={isSpeaking}
              className={`p-2 rounded-lg transition-colors cursor-pointer border shrink-0 ${
                isWordSpeaking
                  ? "bg-primary-700 text-white border-primary-700"
                  : "text-slate-500 bg-white border-slate-200 hover:text-primary-800 hover:bg-slate-50"
              }`}
              title={`Listen to ${displayGerman}`}
              aria-label={`Listen to ${displayGerman}`}
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Clinical Example Sentence */}
        {vocabularyItem.exampleGerman && (
          <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm">
            <div className="flex items-start justify-between gap-2">
              <p className="text-slate-800 font-semibold leading-relaxed">
                &ldquo;{vocabularyItem.exampleGerman}&rdquo;
              </p>
              {speechSupported && (
                <button
                  type="button"
                  onClick={() => onSpeak(vocabularyItem.exampleGerman)}
                  disabled={isSpeaking}
                  className={`p-1 rounded transition-colors cursor-pointer shrink-0 ${
                    isSentenceSpeaking ? "text-primary-800 font-bold" : "text-slate-400 hover:text-primary-800"
                  }`}
                  title="Listen to clinical sentence"
                  aria-label="Listen to clinical sentence"
                >
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
            {vocabularyItem.exampleEnglish && (
              <p className="text-slate-500 mt-1 text-xs">
                {vocabularyItem.exampleEnglish}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 4-Pip Recall Mastery Stepped Indicator */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" title={`${successfulRecallCount} of 4 successful recalls for mastery`}>
            <span className="text-slate-500 font-medium">Recall:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((step) => {
                const filled = successfulRecallCount >= step;
                return (
                  <span
                    key={step}
                    className={`w-2.5 h-2.5 rounded-full border ${
                      filled
                        ? status === "mastered"
                        : "bg-primary-700 border-primary-700"
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-slate-600 font-semibold tabular-nums ml-1">
              {successfulRecallCount}/4
            </span>
          </div>

          <span className="text-slate-300">•</span>

          <span className="text-slate-500">
            Missed: <strong className="text-slate-800">{mistakeCount}x</strong>
          </span>
        </div>

        {/* Actions: Review single or Dismiss */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onReviewSingle && status !== "mastered" && (
            <button
              type="button"
              onClick={() => onReviewSingle(record)}
              className="text-xs text-primary-800 hover:text-primary-900 font-semibold px-2 py-1 rounded bg-primary-50 border border-primary-200/80 hover:bg-primary-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-primary-700" aria-hidden="true" />
              <span>Practice Word</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(itemId)}
            className="text-xs text-slate-400 hover:text-error-700 px-2 py-1 rounded hover:bg-error-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
            title="Remove from review list"
            aria-label={`Remove ${vocabularyItem.german} from review list`}
          >
            <Trash2 className="w-3 h-3" aria-hidden="true" />
            <span>Dismiss</span>
          </button>
        </div>
      </div>

      {/* Contextual Note about previous mistake if helpful */}
      {incorrectAnswer && incorrectAnswer !== "No answer" && (
        <div className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200">
          Previously missed: <s className="text-error-700">{incorrectAnswer}</s>{" "}
          → Correct: <strong className="text-success-800">{correctAnswer}</strong>
        </div>
      )}
    </div>
  );
}
