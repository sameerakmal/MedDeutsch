import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { PracticeSession as PracticeSessionType } from "../../types/practice";
import { categories } from "../../data/categories";
import { ProgressBar } from "../ProgressBar";
import { CategoryIcon } from "../learn/CategoryIcon";
import { QuestionCard } from "./QuestionCard";
import { FeedbackPanel } from "./FeedbackPanel";

interface PracticeSessionProps {
  session: PracticeSessionType;
  onAnswer: (
    questionId: string,
    selectedOptionId: string,
    isCorrect: boolean
  ) => void;
  onNextQuestion: () => void;
  onExit: () => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  speakingText: string | null;
  speechSupported: boolean;
}

export function PracticeSession({
  session,
  onAnswer,
  onNextQuestion,
  onExit,
  onSpeak,
  isSpeaking,
  speakingText,
  speechSupported,
}: PracticeSessionProps) {
  const { questions, currentIndex, answers, config } = session;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const existingAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const [pendingOptionId, setPendingOptionId] = useState<string | null>(null);

  const isSubmitted = !!existingAnswer;
  const selectedOptionId = existingAnswer
    ? existingAnswer.selectedOptionId
    : pendingOptionId;

  if (!currentQuestion) {
    return null;
  }

  const progressPercent =
    totalQuestions > 0 ? ((currentIndex + (isSubmitted ? 1 : 0.5)) / totalQuestions) * 100 : 0;

  const categoryLabel =
    config.category === "all"
      ? "All Topics"
      : categories.find((c) => c.id === config.category)?.label ??
        config.category;

  const categoryIconName =
    config.category === "all"
      ? "Layers"
      : categories.find((c) => c.id === config.category)?.icon ?? "BookOpen";

  const isLastQuestion = currentIndex === totalQuestions - 1;

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
    const isCorrect = chosenOption ? chosenOption.isCorrect : false;

    onAnswer(currentQuestion.id, selectedOptionId, isCorrect);
  };

  const handleNext = () => {
    setPendingOptionId(null);
    onNextQuestion();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Session Navigation & Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {/* Back/Exit Button */}
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            aria-label="Exit practice session and return to setup"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Exit Practice</span>
          </button>

          {/* Level & Category Info */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-800 border border-primary-100">
            <CategoryIcon name={categoryIconName} className="w-3.5 h-3.5" />
            <span>{config.level}</span>
            <span>•</span>
            <span className="truncate max-w-[150px] sm:max-w-none">
              {categoryLabel}
            </span>
          </div>

          {/* Question Counter */}
          <span className="text-xs sm:text-sm font-bold text-gray-700 tabular-nums">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Progress Bar */}
        <ProgressBar value={progressPercent} size="sm" />
      </div>

      {/* Main Question Card */}
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

      {/* Immediate Educational Feedback Panel */}
      {isSubmitted && existingAnswer && (
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
      )}
    </div>
  );
}
