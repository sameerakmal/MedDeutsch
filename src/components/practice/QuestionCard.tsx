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

  // Keyboard shortcut support: 1-4 or A-D select options before submission. Enter submits.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    <Card className="p-5 sm:p-7 space-y-5 border-slate-200">
      {/* Question Type Header & Pronunciation */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>{getQuestionTypeLabel()}</span>
        </span>

        {speechSupported && promptGermanAudio && (
          <button
            type="button"
            onClick={() => onSpeak(promptGermanAudio)}
            disabled={isSpeaking}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
              isAudioSpeaking
                ? "bg-primary-700 text-white border-primary-700"
                : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
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
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          {question.prompt}
        </h2>

        {/* Specialized display for Sentence Completion */}
        {question.type === "sentenceCompletion" && question.promptContext && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-base sm:text-lg font-semibold text-slate-900 tracking-wide">
              {question.promptContext}
            </p>
            {question.promptContextTranslation && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Context: &ldquo;{question.promptContextTranslation}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div
        role="radiogroup"
        aria-label="Answer options"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
      >
        {question.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === question.correctOptionId;
          const optionKey = OPTION_KEYS[idx] ?? `${idx + 1}`;

          // Styling logic for pre- and post-submission states
          let containerStyle =
            "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50";
          let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";

          if (!isSubmitted) {
            if (isSelected) {
              containerStyle =
                "border-primary-700 bg-primary-50/40 ring-1 ring-primary-700 shadow-xs";
              badgeStyle = "bg-primary-700 text-white border-primary-700";
            }
          } else {
            // Post-submission states
            if (isSelected && isCorrect) {
              containerStyle =
                "border-success-600 bg-success-50/50 ring-1 ring-success-600 shadow-xs";
              badgeStyle = "bg-success-600 text-white border-success-600";
            } else if (isSelected && !isCorrect) {
              containerStyle =
                "border-error-600 bg-error-50/50 ring-1 ring-error-600 shadow-xs";
              badgeStyle = "bg-error-600 text-white border-error-600";
            } else if (isCorrect) {
              containerStyle =
                "border-success-600 bg-success-50/30 ring-1 ring-success-600/70";
              badgeStyle = "bg-success-600 text-white border-success-600";
            } else {
              containerStyle = "border-slate-200 bg-slate-50/50 opacity-50";
              badgeStyle = "bg-slate-200 text-slate-500 border-slate-200";
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
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all flex items-start gap-3 relative cursor-pointer min-h-[52px] disabled:cursor-default ${containerStyle}`}
            >
              {/* Option Key (A, B, C, D) */}
              <span
                className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 border ${badgeStyle}`}
              >
                {optionKey}
              </span>

              {/* Option Text */}
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-sm sm:text-base font-semibold text-slate-900 block break-words">
                  {option.text}
                </span>

                {/* Post-submission status indicators */}
                {isSubmitted && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold">
                    {isSelected && isCorrect && (
                      <span className="text-success-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        Your answer • Correct
                      </span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="text-error-700 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        Your answer • Incorrect
                      </span>
                    )}
                    {!isSelected && isCorrect && (
                      <span className="text-success-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Correct answer
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Status Indicator */}
              <div className="shrink-0 pt-0.5">
                {!isSubmitted && (
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-primary-700 bg-primary-700 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                )}
                {isSubmitted && isCorrect && (
                  <CheckCircle2
                    className="w-4 h-4 text-success-600"
                    aria-hidden="true"
                  />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <XCircle
                    className="w-4 h-4 text-error-600"
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
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <p className="text-xs text-slate-400 order-2 sm:order-1 hidden sm:block">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono">1</kbd>–<kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono">4</kbd> or <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono">A</kbd>–<kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono">D</kbd> to select, <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono">Enter</kbd> to submit.
          </p>
          <Button
            size="lg"
            onClick={onSubmit}
            disabled={!selectedOptionId}
            className="w-full sm:w-auto font-semibold shadow-xs order-1 sm:order-2"
          >
            <span>Submit Answer</span>
          </Button>
        </div>
      )}
    </Card>
  );
}
