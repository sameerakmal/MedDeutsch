import { Volume2, VolumeX, Sparkles, MessageSquare } from "lucide-react";
import type { VocabularyItem } from "../../types/vocabulary";
import { Card } from "../Card";

interface VocabularyLearningCardProps {
  item: VocabularyItem;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  speakingText: string | null;
  speechSupported: boolean;
}

export function VocabularyLearningCard({
  item,
  onSpeak,
  isSpeaking,
  speakingText,
  speechSupported,
}: VocabularyLearningCardProps) {
  // Full spoken phrase for nouns includes article (e.g. "der Kopf")
  const fullGermanWord = item.article
    ? `${item.article} ${item.german}`
    : item.german;

  const isWordSpeaking = isSpeaking && speakingText === fullGermanWord;
  const isExampleSpeaking = isSpeaking && speakingText === item.exampleGerman;

  const handleSpeakWord = () => {
    onSpeak(fullGermanWord);
  };

  const handleSpeakExample = () => {
    onSpeak(item.exampleGerman);
  };

  // Gender article badge styling with text labels
  const getArticleBadge = () => {
    if (!item.article) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          Ausdruck / Phrase
        </span>
      );
    }

    switch (item.article) {
      case "der":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200">
            <span className="font-bold">der</span>
            <span className="text-blue-700 font-normal">· maskulin (m)</span>
          </span>
        );
      case "die":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-50 text-primary-900 border border-primary-200">
            <span className="font-bold">die</span>
            <span className="text-primary-700 font-normal">· feminin (f)</span>
          </span>
        );
      case "das":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            <span className="font-bold">das</span>
            <span className="text-slate-600 font-normal">· neutral (n)</span>
          </span>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Top Meta Header: Level & Article Indicator */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          {getArticleBadge()}
        </div>

        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          Level {item.level}
        </span>
      </div>

      {/* Main Vocabulary Word Section */}
      <div className="py-6 sm:py-8 flex flex-col items-center text-center">
        {/* German Word with Article */}
        <div className="w-full space-y-2">
          {item.article && (
            <span className="text-xl sm:text-2xl font-bold text-slate-500 block">
              {item.article}
            </span>
          )}

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight break-words px-2">
            {item.german}
          </h2>
        </div>

        {/* Audio Listen Button */}
        <div className="mt-4">
          {speechSupported ? (
            <button
              type="button"
              onClick={handleSpeakWord}
              aria-label={`Listen to German pronunciation of ${fullGermanWord}`}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer border ${
                isWordSpeaking
                  ? "bg-primary-700 text-white border-primary-700 shadow-xs"
                  : "bg-white text-primary-800 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
              }`}
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>{isWordSpeaking ? "Playing..." : "Listen"}</span>
            </button>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400"
              aria-label="Speech synthesis not supported in this browser"
            >
              <VolumeX className="w-4 h-4" aria-hidden="true" />
              <span>Audio unavailable</span>
            </span>
          )}
        </div>

        {/* English Translation */}
        <div className="mt-6 pt-5 w-full border-t border-slate-100">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            English Meaning
          </span>
          <p className="text-xl sm:text-2xl font-semibold text-slate-700 mt-1 capitalize">
            {item.english}
          </p>
        </div>
      </div>

      {/* Example Sentence Section */}
      <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 mt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <MessageSquare className="w-3.5 h-3.5 text-primary-700" aria-hidden="true" />
            <span>Clinical Example</span>
          </div>

          {speechSupported && (
            <button
              type="button"
              onClick={handleSpeakExample}
              aria-label="Listen to example sentence in German"
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isExampleSpeaking
                  ? "bg-primary-700 text-white border-primary-700"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isExampleSpeaking ? "Playing..." : "Listen"}</span>
            </button>
          )}
        </div>

        {/* German Sentence */}
        <p className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
          &ldquo;{item.exampleGerman}&rdquo;
        </p>

        {/* English Translation */}
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
          {item.exampleEnglish}
        </p>
      </div>
    </Card>
  );
}
