import { useNavigate } from "react-router-dom";
import { CheckCircle2, RotateCcw, PenLine } from "lucide-react";
import type { MistakeRecord, ReviewStatus } from "../../types/mistake";
import { ReviewItemCard } from "./ReviewItemCard";
import { Button } from "../Button";
import { Card } from "../Card";

interface ReviewListProps {
  items: MistakeRecord[];
  totalTrackedCount: number;
  currentFilter: "all" | ReviewStatus;
  onFilterReset: () => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  speakingText: string | null;
  speechSupported: boolean;
  onRemoveItem: (itemId: string) => void;
  onReviewSingle?: (record: MistakeRecord) => void;
}

export function ReviewList({
  items,
  totalTrackedCount,
  currentFilter,
  onFilterReset,
  onSpeak,
  isSpeaking,
  speakingText,
  speechSupported,
  onRemoveItem,
  onReviewSingle,
}: ReviewListProps) {
  const navigate = useNavigate();

  // 1. Overall Empty State: User has not made any mistakes yet!
  if (totalTrackedCount === 0) {
    return (
      <Card className="py-12 sm:py-16 px-6 text-center border-slate-200 bg-white">
        <div className="w-12 h-12 rounded-xl bg-success-50 border border-success-200 text-success-700 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5">
          All Caught Up!
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
          No vocabulary items currently need review. Complete more practice quizzes, and any medical terms you miss will automatically be tracked here for targeted active recall.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => navigate("/practice")}
            className="w-full sm:w-auto font-semibold shadow-xs cursor-pointer"
          >
            <PenLine className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>Start Practice Quiz</span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/learn")}
            className="w-full sm:w-auto cursor-pointer"
          >
            <span>Browse Vocabulary</span>
          </Button>
        </div>
      </Card>
    );
  }

  // 2. Filter-Specific Empty State
  if (items.length === 0) {
    const filterLabels: Record<string, string> = {
      needsReview: "'Needs Review'",
      improving: "'Improving'",
      mastered: "'Mastered'",
    };

    return (
      <Card className="py-10 px-6 text-center border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-3">
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          No terms in {filterLabels[currentFilter] ?? "this filter"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-4">
          There are no vocabulary items in this review stage right now.
        </p>
        <Button variant="secondary" size="sm" onClick={onFilterReset}>
          Show All Words
        </Button>
      </Card>
    );
  }

  // 3. Grid of Review Item Cards
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {items.map((record) => (
        <ReviewItemCard
          key={record.itemId}
          record={record}
          onSpeak={onSpeak}
          isSpeaking={isSpeaking}
          speakingText={speakingText}
          speechSupported={speechSupported}
          onRemove={onRemoveItem}
          onReviewSingle={onReviewSingle}
        />
      ))}
    </div>
  );
}
