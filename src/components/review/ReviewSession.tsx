import { useState } from "react";
import { ArrowLeft, Sparkles, TrendingUp, Trophy, AlertCircle } from "lucide-react";
import type { VocabularyItem } from "../../types/vocabulary";
import type { Question, QuestionAnswer } from "../../types/practice";
import type { MistakeRecord, ReviewStatus } from "../../types/mistake";
import { REVIEW_THRESHOLDS } from "../../types/mistake";
import { generateReviewQuestions } from "../../utils/quiz";
import {
  recordMistake,
  recordSuccessfulRecall,
  getMistakeRecord,
} from "../../utils/storage";
import { QuestionCard } from "../practice/QuestionCard";
import { FeedbackPanel } from "../practice/FeedbackPanel";
import { ProgressBar } from "../ProgressBar";

export interface ReviewSessionSummaryItem {
  record: MistakeRecord;
  isCorrect: boolean;
  previousStatus: ReviewStatus;
  newStatus: ReviewStatus;
}

export interface ReviewSessionResult {
  totalReviewed: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number;
  items: ReviewSessionSummaryItem[];
}

interface ReviewSessionProps {
  targetItems: VocabularyItem[];
  onComplete: (result: ReviewSessionResult) => void;
  onExit: () => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  speakingText: string | null;
  speechSupported: boolean;
}

export function ReviewSession({
  targetItems,
  onComplete,
  onExit,
  onSpeak,
  isSpeaking,
  speakingText,
  speechSupported,
}: ReviewSessionProps) {
  // Generate active recall questions reusing practice engine
  const [questions] = useState<Question[]>(() =>
    generateReviewQuestions(targetItems)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);
  const [sessionSummary, setSessionSummary] = useState<ReviewSessionSummaryItem[]>(
    []
  );

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const existingAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isSubmitted = Boolean(existingAnswer);
  const selectedOptionId = existingAnswer
    ? existingAnswer.selectedOptionId
    : pendingOptionId;

  if (!currentQuestion) {
    return null;
  }

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercent =
    totalQuestions > 0
      ? ((currentIndex + (isSubmitted ? 1 : 0.5)) / totalQuestions) * 100
      : 0;

  const currentSummaryItem = sessionSummary.find(
    (s) => s.record.itemId === currentQuestion.targetItem.id
  );

  const handleSelectOption = (optionId: string) => {
    if (!isSubmitted) {
      setPendingOptionId(optionId);
    }
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;

    const chosenOption = currentQuestion.options.find(
      (o) => o.id === selectedOptionId
    );
    const correctOption = currentQuestion.options.find(
      (o) => o.id === currentQuestion.correctOptionId
    );
    const isCorrect = chosenOption ? chosenOption.isCorrect : false;

    // Get previous state before updating
    const prevRecord = getMistakeRecord(currentQuestion.targetItem.id);
    const prevStatus: ReviewStatus = prevRecord?.status ?? "needsReview";

    let updatedRecord: MistakeRecord;
    if (isCorrect) {
      const recalled = recordSuccessfulRecall(currentQuestion.targetItem.id);
      if (recalled) {
        updatedRecord = recalled;
      } else {
        // Fallback safety if item was missing
        updatedRecord = recordMistake(
          currentQuestion.targetItem,
          currentQuestion.type,
          "",
          correctOption?.text ?? currentQuestion.explanation.germanText
        );
      }
    } else {
      updatedRecord = recordMistake(
        currentQuestion.targetItem,
        currentQuestion.type,
        chosenOption?.text ?? "No answer",
        correctOption?.text ?? currentQuestion.explanation.germanText
      );
    }

    const answerRecord: QuestionAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId,
      isCorrect,
      answeredAt: Date.now(),
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerRecord,
    }));

    setSessionSummary((prev) => [
      ...prev,
      {
        record: updatedRecord,
        isCorrect,
        previousStatus: prevStatus,
        newStatus: updatedRecord.status,
      },
    ]);
  };

  const handleNext = () => {
    setPendingOptionId(null);
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final review result
      const correctCount = sessionSummary.filter((s) => s.isCorrect).length;
      const incorrectCount = sessionSummary.length - correctCount;
      const accuracy =
        sessionSummary.length > 0
          ? Math.round((correctCount / sessionSummary.length) * 100)
          : 0;

      onComplete({
        totalReviewed: sessionSummary.length,
        correctCount,
        incorrectCount,
        accuracy,
        items: sessionSummary,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header & Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            aria-label="Exit review session"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Exit Review</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Active Recall Review</span>
          </div>

          <span className="text-xs sm:text-sm font-bold text-gray-700 tabular-nums">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <ProgressBar value={progressPercent} size="sm" />
      </div>

      {/* Main Question Card reusing practice engine */}
      <QuestionCard
        question={currentQuestion}
        selectedOptionId={selectedOptionId}
        onSelectOption={handleSelectOption}
        onSubmit={handleSubmit}
        isSubmitted={isSubmitted}
        onSpeak={onSpeak}
        isSpeaking={isSpeaking}
        speakingText={speakingText}
        speechSupported={speechSupported}
      />

      {/* Review Feedback with Mastery Status Callout */}
      {isSubmitted && existingAnswer && (
        <div className="space-y-3">
          {/* Status Progression Callout */}
          {currentSummaryItem && (
            <div
              className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between gap-3 ${
                currentSummaryItem.isCorrect
                  ? currentSummaryItem.newStatus === "mastered"
                    ? "bg-emerald-100/80 border-emerald-300 text-emerald-950"
                    : currentSummaryItem.newStatus === "improving"
                    ? "bg-primary-100/80 border-primary-300 text-primary-950"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-amber-100/80 border-amber-300 text-amber-950"
              }`}
            >
              <div className="flex items-center gap-2">
                {currentSummaryItem.isCorrect ? (
                  currentSummaryItem.newStatus === "mastered" ? (
                    <Trophy className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : currentSummaryItem.newStatus === "improving" ? (
                    <TrendingUp className="w-4 h-4 text-primary-700 shrink-0" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                  )
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                )}
                <span>
                  {currentSummaryItem.isCorrect
                    ? currentSummaryItem.newStatus === "mastered"
                      ? "Mastery achieved! You successfully recalled this term 4+ times."
                      : currentSummaryItem.newStatus === "improving"
                      ? `Great recall! Moved to Improving (${currentSummaryItem.record.successfulRecallCount}/${REVIEW_THRESHOLDS.MASTERED_RECALL_COUNT} recalls).`
                      : `Recall recorded (${currentSummaryItem.record.successfulRecallCount}/${REVIEW_THRESHOLDS.MASTERED_RECALL_COUNT} needed for mastery).`
                    : "Keep going! This item stays in your review queue until recall improves."}
                </span>
              </div>

              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/70 border border-black/5 shrink-0">
                {currentSummaryItem.newStatus}
              </span>
            </div>
          )}

          {/* Standard Feedback Panel */}
          <FeedbackPanel
            question={currentQuestion}
            answer={existingAnswer}
            isLastQuestion={isLastQuestion}
            onNext={handleNext}
            onSpeak={onSpeak}
            isSpeaking={isSpeaking}
            speakingText={speakingText}
            speechSupported={speechSupported}
          />
        </div>
      )}
    </div>
  );
}
