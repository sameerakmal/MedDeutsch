import { useState, useEffect, useMemo, useCallback } from "react";
import type { MistakeRecord, ReviewStatus } from "../types/mistake";
import type { VocabularyItem } from "../types/vocabulary";
import {
  getMistakesList,
  getReviewStats,
  clearMistake,
  recordReviewSessionCompleted,
  MISTAKES_UPDATED_EVENT,
} from "../utils/storage";
import {
  ReviewHeader,
  ReviewList,
  ReviewSession,
  ReviewComplete,
  type ReviewSessionResult,
} from "../components/review";
import { useSpeechSynthesis } from "../hooks";

type ViewMode = "list" | "session" | "complete";

export function ReviewPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() =>
    getMistakesList()
  );
  const [stats, setStats] = useState(() => getReviewStats());
  const [filter, setFilter] = useState<"all" | ReviewStatus>("all");
  const [activeReviewItems, setActiveReviewItems] = useState<VocabularyItem[]>(
    []
  );
  const [sessionResult, setSessionResult] =
    useState<ReviewSessionResult | null>(null);

  // Speech synthesis
  const {
    isSupported: speechSupported,
    isSpeaking,
    currentText: speakingText,
    speak,
    stop,
  } = useSpeechSynthesis();

  // Reload state from storage
  const refreshData = useCallback(() => {
    setMistakes(getMistakesList());
    setStats(getReviewStats());
  }, []);

  // Listen for storage updates across components
  useEffect(() => {
    const handleStorageUpdate = () => {
      refreshData();
    };

    window.addEventListener(MISTAKES_UPDATED_EVENT, handleStorageUpdate);
    return () => {
      window.removeEventListener(MISTAKES_UPDATED_EVENT, handleStorageUpdate);
    };
  }, [refreshData]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (filter === "all") return mistakes;
    return mistakes.filter((m) => m.status === filter);
  }, [mistakes, filter]);

  // Start a review session
  const handleStartReviewSession = (explicitItems?: VocabularyItem[]) => {
    stop();
    if (explicitItems && explicitItems.length > 0) {
      setActiveReviewItems(explicitItems);
      setViewMode("session");
      return;
    }

    // Prioritise items that need review; if none, use improving items
    const needsReviewItems = mistakes.filter((m) => m.status === "needsReview");
    const candidates =
      needsReviewItems.length > 0
        ? needsReviewItems
        : mistakes.filter((m) => m.status === "improving");

    // Take up to 10 items for a focused review drill
    const selected = candidates.slice(0, 10).map((m) => m.vocabularyItem);

    if (selected.length === 0) return;

    setActiveReviewItems(selected);
    setViewMode("session");
  };

  // Review a single specific item from its card
  const handleReviewSingle = (record: MistakeRecord) => {
    handleStartReviewSession([record.vocabularyItem]);
  };

  // Remove a mistake item
  const handleRemoveItem = (itemId: string) => {
    clearMistake(itemId);
    refreshData();
  };

  // Review session completed
  const handleSessionComplete = (result: ReviewSessionResult) => {
    stop();
    const improvedCount = result.items.filter(
      (i) =>
        i.isCorrect &&
        (i.newStatus === "improving" || i.newStatus === "mastered")
    ).length;
    recordReviewSessionCompleted(result.totalReviewed, improvedCount);
    setSessionResult(result);
    setViewMode("complete");
    refreshData();
  };



  // Exit back to list
  const handleExitToReviewList = () => {
    stop();
    setViewMode("list");
    refreshData();
  };

  // Check if more items need review for the "Review Again" CTA
  const remainingNeedsReview = mistakes.some((m) => m.status === "needsReview");

  return (
    <div className="py-2">
      {/* 1. Review List Dashboard */}
      {viewMode === "list" && (
        <div className="space-y-6">
          <ReviewHeader
            stats={stats}
            currentFilter={filter}
            onFilterChange={setFilter}
            onStartReview={() => handleStartReviewSession()}
          />

          <ReviewList
            items={filteredItems}
            totalTrackedCount={stats.total}
            currentFilter={filter}
            onFilterReset={() => setFilter("all")}
            onSpeak={speak}
            isSpeaking={isSpeaking}
            speakingText={speakingText}
            speechSupported={speechSupported}
            onRemoveItem={handleRemoveItem}
            onReviewSingle={handleReviewSingle}
          />
        </div>
      )}

      {/* 2. Active Review Session */}
      {viewMode === "session" && activeReviewItems.length > 0 && (
        <ReviewSession
          targetItems={activeReviewItems}
          onComplete={handleSessionComplete}
          onExit={handleExitToReviewList}
          onSpeak={speak}
          isSpeaking={isSpeaking}
          speakingText={speakingText}
          speechSupported={speechSupported}
        />
      )}

      {/* 3. Review Session Complete Summary */}
      {viewMode === "complete" && sessionResult && (
        <ReviewComplete
          result={sessionResult}
          onReviewAgain={() => handleStartReviewSession()}
          onBackToList={handleExitToReviewList}
          onSpeak={speak}
          speechSupported={speechSupported}
          hasMoreToReview={remainingNeedsReview}
        />
      )}
    </div>
  );
}
