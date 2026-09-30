import { CheckCircle2, XCircle, Volume2, ArrowRight } from "lucide-react";
import type { Question, QuestionAnswer } from "../../types/practice";
import { Button } from "../Button";

interface FeedbackPanelProps {
  question: Question;
  answer: QuestionAnswer;
  isLastQuestion: boolean;
  onNext: () => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  speakingText: string | null;
  speechSupported: boolean;
}

export function FeedbackPanel({
  question,
  answer,
  isLastQuestion,
  onNext,
  onSpeak,
  isSpeaking,
  speakingText,
  speechSupported,
}: FeedbackPanelProps) {
  const isCorrect = answer.isCorrect;
  const explanation = question.explanation;

  const spokenTerm = explanation.germanText;
  const spokenSentence = explanation.exampleGerman;

  const isTermSpeaking = isSpeaking && speakingText === spokenTerm;
  const isSentenceSpeaking = isSpeaking && speakingText === spokenSentence;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-xl border p-5 sm:p-6 transition-all duration-150 ${
        isCorrect
          ? "bg-success-50 border-success-200"
          : "bg-error-50 border-error-200"
      }`}
    >
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
              isCorrect
                ? "bg-success-600 border-success-700 text-white"
                : "bg-error-600 border-error-700 text-white"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            ) : (
              <XCircle className="w-5 h-5" aria-hidden="true" />
            )}
          </div>
          <div>
            <h3
              className={`text-base font-bold ${
                isCorrect ? "text-success-900" : "text-error-900"
              }`}
            >
              {isCorrect ? "Correct! Well done." : "Not quite — keep practicing!"}
            </h3>
            <p
              className={`text-xs sm:text-sm mt-0.5 ${
                isCorrect ? "text-success-800" : "text-error-800"
              }`}
            >
              {isCorrect
                ? "Your answer is correct. Here is the clinical context:"
                : "Correct medical term and context:"}
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <Button
          size="md"
          variant={isCorrect ? "primary" : "secondary"}
          onClick={onNext}
          className="shrink-0 font-semibold shadow-xs"
          autoFocus
        >
          <span>{isLastQuestion ? "View Results" : "Continue"}</span>
          <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
        </Button>
      </div>

      {/* Educational Breakdown */}
      <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-3">
        {/* Core Term & Translation */}
        <div className="bg-white rounded-lg p-3.5 sm:p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-0.5">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Vocabulary Item
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900">
                {explanation.germanText}
              </span>
              <span className="text-slate-400 font-light">=</span>
              <span className="text-sm sm:text-base text-primary-800 font-semibold">
                {explanation.englishText}
              </span>
            </div>
          </div>

          {speechSupported && (
            <button
              type="button"
              onClick={() => onSpeak(spokenTerm)}
              disabled={isSpeaking}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer border shrink-0 ${
                isTermSpeaking
                  ? "bg-primary-700 text-white border-primary-700"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
              aria-label={`Listen to pronunciation of ${spokenTerm}`}
            >
              <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isTermSpeaking ? "Playing..." : "Listen"}</span>
            </button>
          )}
        </div>

        {/* Clinical Example Sentence */}
        <div className="bg-white rounded-lg p-3.5 sm:p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Clinical Context
            </span>
            {speechSupported && (
              <button
                type="button"
                onClick={() => onSpeak(spokenSentence)}
                disabled={isSpeaking}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-900 cursor-pointer"
                aria-label={`Listen to sentence: ${spokenSentence}`}
              >
                <Volume2 className="w-3 h-3" aria-hidden="true" />
                <span>{isSentenceSpeaking ? "Playing..." : "Listen"}</span>
              </button>
            )}
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
            &ldquo;{explanation.exampleGerman}&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {explanation.exampleEnglish}
          </p>
        </div>

        {/* Grammar or Clinical Tip */}
        {explanation.note && (
          <div className="text-xs text-slate-700 bg-white rounded-lg px-3 py-2 border border-slate-200 flex items-center gap-2">
            <span className="font-bold text-slate-900">Grammar note:</span>
            <span>{explanation.note}</span>
          </div>
        )}
      </div>
    </div>
  );
}
