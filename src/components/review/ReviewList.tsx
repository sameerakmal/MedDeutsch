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
      <Card className="py-12 sm:py-16 px-6 text-center border-dashed border-2 border-primary-200 bg-gradient-to-b from-primary-50/30 to-white">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          You&apos;re all caught up!
        </h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
          No vocabulary items currently need review. Complete more practice
          sessions, and any medical terms you miss will automatically be
          collected here for targeted active recall.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => navigate("/practice")}
            className="w-full sm:w-auto font-semibold shadow-sm cursor-pointer"
          >
            <PenLine className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>Practice Vocabulary</span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/learn")}
            className="w-full sm:w-auto cursor-pointer"
          >
            <span>Browse Word Lists</span>
          </Button>
        </div>
      </Card>
    );
  }

  // 2. Filter-Specific Empty State: No items match selected filter (e.g. Mastered tab is empty)
  if (items.length === 0) {
    const filterLabels: Record<string, string> = {
      needsReview: "needing immediate review",
      improving: "in the improving stage",
      mastered: "marked as mastered yet",
    };

    return (
      <Card className="py-10 px-6 text-center border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
          <RotateCcw className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          No words {filterLabels[currentFilter] ?? "found"}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-4">
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
