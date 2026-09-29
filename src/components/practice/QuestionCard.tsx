import { useEffect } from "react";
import {
  Volume2,
  Check,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import type { Question } from "../../types/practice";
import { Button } from "../Button";
import { Card } from "../Card";

interface QuestionCardProps {
  question: Question;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onSubmit: () => void;
  isSubmitted: boolean;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  speakingText: string | null;
  speechSupported: boolean;
}

const OPTION_KEYS = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  selectedOptionId,
  onSelectOption,
  onSubmit,
  isSubmitted,
  onSpeak,
  isSpeaking,
  speakingText,
  speechSupported,
}: QuestionCardProps) {
  // Determine if there's German audio we can pronounce for the prompt
  const promptGermanAudio =
    question.type === "germanToEnglish"
      ? question.explanation.germanText
      : question.type === "sentenceCompletion"
      ? question.explanation.exampleGerman
      : null;

  const isAudioSpeaking =
    isSpeaking && promptGermanAudio && speakingText === promptGermanAudio;

  // Keyboard shortcut support:
  // Keys 1-4 or A-D select options before submission.
  // Enter submits if an option is selected.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is inside an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (!isSubmitted) {
        const key = e.key.toUpperCase();
        let targetIndex = -1;

        if (key === "1" || key === "A") targetIndex = 0;
        else if (key === "2" || key === "B") targetIndex = 1;
        else if (key === "3" || key === "C") targetIndex = 2;
        else if (key === "4" || key === "D") targetIndex = 3;

        if (targetIndex >= 0 && targetIndex < question.options.length) {
          e.preventDefault();
          onSelectOption(question.options[targetIndex].id);
          return;
        }

        if (e.key === "Enter" && selectedOptionId) {
          e.preventDefault();
          onSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitted, question.options, selectedOptionId, onSelectOption, onSubmit]);

  const getQuestionTypeLabel = () => {
    switch (question.type) {
      case "germanToEnglish":
        return "German → English";
      case "englishToGerman":
        return "English → German";
      case "sentenceCompletion":
        return "Sentence Completion";
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      {/* Question Type Header & Pronunciation */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-800 border border-primary-200/60">
          <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{getQuestionTypeLabel()}</span>
        </span>

        {speechSupported && promptGermanAudio && (
          <button
            type="button"
            onClick={() => onSpeak(promptGermanAudio)}
            disabled={isSpeaking}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isAudioSpeaking
                ? "bg-primary-600 text-white animate-pulse"
                : "text-primary-700 bg-primary-50 hover:bg-primary-100"
            }`}
            title="Listen to German pronunciation"
            aria-label="Listen to German pronunciation"
          >
            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isAudioSpeaking ? "Playing..." : "Listen"}</span>
          </button>
        )}
      </div>

      {/* Question Prompt */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
          {question.prompt}
        </h2>

        {/* Specialized display for Sentence Completion */}
        {question.type === "sentenceCompletion" && question.promptContext && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-lg sm:text-xl font-medium text-slate-900 font-serif tracking-wide">
              {question.promptContext}
            </p>
            {question.promptContextTranslation && (
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Context meaning: &ldquo;{question.promptContextTranslation}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div
        role="radiogroup"
        aria-label="Answer options"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
      >
        {question.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === question.correctOptionId;
          const optionKey = OPTION_KEYS[idx] ?? `${idx + 1}`;

          // Styling logic for pre- and post-submission states
          let containerStyle =
            "border-gray-200 bg-white hover:border-primary-400 hover:bg-gray-50/70";
          let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";

          if (!isSubmitted) {
            if (isSelected) {
              containerStyle =
                "border-primary-600 bg-primary-50/70 ring-2 ring-primary-200 shadow-xs";
              badgeStyle = "bg-primary-600 text-white border-primary-600";
            }
          } else {
            // Post-submission states
            if (isSelected && isCorrect) {
              // Learner was correct
              containerStyle =
                "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200 shadow-xs";
              badgeStyle = "bg-emerald-600 text-white border-emerald-600";
            } else if (isSelected && !isCorrect) {
              // Learner was wrong
              containerStyle =
                "border-rose-500 bg-rose-50 ring-2 ring-rose-200 shadow-xs";
              badgeStyle = "bg-rose-600 text-white border-rose-600";
            } else if (isCorrect) {
              // The correct answer that user didn't pick
              containerStyle =
                "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-200";
              badgeStyle = "bg-emerald-600 text-white border-emerald-600";
            } else {
              // Other unselected options
              containerStyle = "border-gray-200 bg-gray-50/50 opacity-40";
              badgeStyle = "bg-gray-200 text-gray-500 border-gray-200";
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isSubmitted}
              onClick={() => onSelectOption(option.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 relative cursor-pointer disabled:cursor-default ${containerStyle}`}
            >
              {/* Option Key (A, B, C, D) */}
              <span
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${badgeStyle}`}
              >
                {optionKey}
              </span>

              {/* Option Text */}
              <div className="min-w-0 flex-1 pr-6">
                <span className="text-base sm:text-lg font-medium text-gray-900 block break-words">
                  {option.text}
                </span>

                {/* Post-submission status indicators */}
                {isSubmitted && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
                    {isSelected && isCorrect && (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        Your answer • Correct
                      </span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="text-rose-700 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        Your answer • Incorrect
                      </span>
                    )}
                    {!isSelected && isCorrect && (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Correct answer
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Radio indicator or feedback icon */}
              <div className="shrink-0 pt-0.5">
                {!isSubmitted && (
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                )}
                {isSubmitted && isCorrect && (
                  <CheckCircle2
                    className="w-5 h-5 text-emerald-600"
                    aria-hidden="true"
                  />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <XCircle
                    className="w-5 h-5 text-rose-600"
                    aria-hidden="true"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Row before submission */}
      {!isSubmitted && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 order-2 sm:order-1">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">1</kbd>–<kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">4</kbd> or <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">A</kbd>–<kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">D</kbd> to select, <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Enter</kbd> to submit
          </p>
          <Button
            size="lg"
            onClick={onSubmit}
            disabled={!selectedOptionId}
            className="w-full sm:w-auto font-semibold shadow-sm order-1 sm:order-2"
          >
            Submit Answer
          </Button>
        </div>
      )}
    </Card>
  );
}
