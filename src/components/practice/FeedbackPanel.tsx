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
      className={`rounded-2xl border p-5 sm:p-6 transition-all duration-200 ${
        isCorrect
          ? "bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-200"
          : "bg-amber-50/90 border-amber-300 ring-1 ring-amber-200"
      }`}
    >
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isCorrect
                ? "bg-emerald-600 text-white"
                : "bg-amber-600 text-white"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            ) : (
              <XCircle className="w-6 h-6" aria-hidden="true" />
            )}
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${
                isCorrect ? "text-emerald-950" : "text-amber-950"
              }`}
            >
              {isCorrect ? "Richtig! Well done." : "Not quite — keep learning!"}
            </h3>
            <p
              className={`text-xs sm:text-sm ${
                isCorrect ? "text-emerald-800" : "text-amber-800"
              }`}
            >
              {isCorrect
                ? "Your answer is correct. Review the clinical usage below."
                : "Here is the correct medical term and context:"}
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <Button
          size="md"
          onClick={onNext}
          className={`shrink-0 font-semibold shadow-sm ${
            isCorrect
              ? "bg-emerald-700 hover:bg-emerald-800 text-white focus-visible:ring-emerald-500"
              : "bg-primary-700 hover:bg-primary-800 text-white focus-visible:ring-primary-500"
          }`}
          autoFocus
        >
          <span>{isLastQuestion ? "View Results" : "Continue"}</span>
          <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
        </Button>
      </div>

      {/* Educational Breakdown */}
      <div className="mt-4 pt-4 border-t border-black/10 space-y-3">
        {/* Core Term & Translation */}
        <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3.5 sm:p-4 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
              Vocabulary Item
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900 font-serif">
                {explanation.germanText}
              </span>
              <span className="text-gray-400 font-light">=</span>
              <span className="text-base sm:text-lg text-primary-800 font-medium">
                {explanation.englishText}
              </span>
            </div>
          </div>

          {speechSupported && (
            <button
              type="button"
              onClick={() => onSpeak(spokenTerm)}
              disabled={isSpeaking}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                isTermSpeaking
                  ? "bg-primary-600 text-white animate-pulse"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100"
              }`}
              aria-label={`Listen to pronunciation of ${spokenTerm}`}
            >
              <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isTermSpeaking ? "Playing..." : "Pronounce"}</span>
            </button>
          )}
        </div>

        {/* Clinical Example Sentence */}
        <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3.5 sm:p-4 border border-black/5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
              Clinical Context
            </span>
            {speechSupported && (
              <button
                type="button"
                onClick={() => onSpeak(spokenSentence)}
                disabled={isSpeaking}
                className={`inline-flex items-center gap-1 text-xs font-medium text-primary-700 hover:text-primary-800 cursor-pointer ${
                  isSentenceSpeaking ? "font-bold underline" : ""
                }`}
                aria-label={`Listen to sentence: ${spokenSentence}`}
              >
                <Volume2 className="w-3 h-3" aria-hidden="true" />
                <span>{isSentenceSpeaking ? "Speaking sentence..." : "Listen to sentence"}</span>
              </button>
            )}
          </div>
          <p className="text-sm sm:text-base font-medium text-gray-900 italic font-serif">
            &ldquo;{explanation.exampleGerman}&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            {explanation.exampleEnglish}
          </p>
        </div>

        {/* Grammar or Clinical Tip */}
        {explanation.note && (
          <div className="text-xs text-gray-600 bg-white/50 rounded-lg px-3 py-2 border border-black/5 flex items-center gap-2">
            <span className="font-semibold text-gray-800">Grammar note:</span>
            <span>{explanation.note}</span>
          </div>
        )}
      </div>
    </div>
  );
}
