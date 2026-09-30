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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header & Navigation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Exit review session"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Exit</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-accent-700" />
            <span>Active Recall Drill</span>
          </div>

          <span className="text-xs sm:text-sm font-bold text-slate-700 tabular-nums">
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
              className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 ${
                currentSummaryItem.isCorrect
                  ? currentSummaryItem.newStatus === "mastered"
                    ? "bg-success-50 border-success-200 text-success-900"
                    : currentSummaryItem.newStatus === "improving"
                    ? "bg-primary-50 border-primary-200 text-primary-900"
                    : "bg-success-50 border-success-200 text-success-900"
                  : "bg-accent-50 border-accent-200 text-accent-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {currentSummaryItem.isCorrect ? (
                  currentSummaryItem.newStatus === "mastered" ? (
                    <Trophy className="w-4 h-4 text-success-700 shrink-0" />
                  ) : currentSummaryItem.newStatus === "improving" ? (
                    <TrendingUp className="w-4 h-4 text-primary-700 shrink-0" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-success-700 shrink-0" />
                  )
                ) : (
                  <AlertCircle className="w-4 h-4 text-accent-700 shrink-0" />
                )}
                <span>
                  {currentSummaryItem.isCorrect
                    ? currentSummaryItem.newStatus === "mastered"
                      ? "Mastery achieved! You have recalled this term 4+ times successfully."
                      : currentSummaryItem.newStatus === "improving"
                      ? `Improving! (${currentSummaryItem.record.successfulRecallCount}/${REVIEW_THRESHOLDS.MASTERED_RECALL_COUNT} successful recalls).`
                      : `Successful recall (${currentSummaryItem.record.successfulRecallCount}/${REVIEW_THRESHOLDS.MASTERED_RECALL_COUNT} toward mastery).`
                    : "Keep going! This term stays in review until mastered."}
                </span>
              </div>

              <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shrink-0">
                {currentSummaryItem.newStatus === "needsReview"
                  ? "Needs Review"
                  : currentSummaryItem.newStatus === "improving"
                  ? "Improving"
                  : "Mastered"}
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
