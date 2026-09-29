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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
          <Sparkles className="w-3.5 h-3.5 text-gray-500" aria-hidden="true" />
          Ausdruck / Phrase
        </span>
      );
    }

    switch (item.article) {
      case "der":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="font-bold text-sm tracking-wide">der</span>
            <span className="text-blue-600 font-normal">· maskulin (m)</span>
          </span>
        );
      case "die":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <span className="font-bold text-sm tracking-wide">die</span>
            <span className="text-purple-600 font-normal">· feminin (f)</span>
          </span>
        );
      case "das":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="font-bold text-sm tracking-wide">das</span>
            <span className="text-amber-700 font-normal">· neutral (n)</span>
          </span>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm border border-gray-200 overflow-hidden">
      {/* Top Meta Header: Level & Article Indicator */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {getArticleBadge()}
        </div>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
          Level {item.level}
        </span>
      </div>

      {/* Main Vocabulary Word Section */}
      <div className="py-6 sm:py-8 flex flex-col items-center text-center">
        {/* Article Display if noun */}
        {item.article && (
          <span className="text-xl sm:text-2xl font-semibold text-primary-700/80 mb-1 select-none">
            {item.article}
          </span>
        )}

        {/* German Word */}
        <div className="flex items-center justify-center gap-3 w-full">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            {item.german}
          </h2>

          {/* Audio Listen Button */}
          {speechSupported ? (
            <button
              type="button"
              onClick={handleSpeakWord}
              aria-label={`Listen to German pronunciation of ${fullGermanWord}`}
              title={`Listen to ${fullGermanWord}`}
              className={`p-3 rounded-full transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 ${
                isWordSpeaking
                  ? "bg-primary-600 text-white ring-4 ring-primary-100 scale-105"
                  : "bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800"
              }`}
            >
              <Volume2
                className={`w-6 h-6 ${isWordSpeaking ? "animate-pulse" : ""}`}
                aria-hidden="true"
              />
            </button>
          ) : (
            <span
              className="p-2.5 text-gray-400"
              title="Speech synthesis not available in this browser"
              aria-label="Speech synthesis not supported"
            >
              <VolumeX className="w-5 h-5" aria-hidden="true" />
            </span>
          )}
        </div>

        {/* English Translation */}
        <div className="mt-4 pt-4 w-full border-t border-gray-100">
          <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
            English Meaning
          </span>
          <p className="text-xl sm:text-2xl font-medium text-gray-700 mt-1 capitalize">
            {item.english}
          </p>
        </div>
      </div>

      {/* Example Sentence Section */}
      <div className="bg-surface-hover/80 rounded-xl p-4 sm:p-5 border border-gray-100 mt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-800">
            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clinical Example / Beispielsatz</span>
          </div>

          {speechSupported && (
            <button
              type="button"
              onClick={handleSpeakExample}
              aria-label="Listen to example sentence in German"
              title="Listen to German sentence"
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isExampleSpeaking
                  ? "bg-primary-600 text-white"
                  : "text-primary-700 hover:bg-primary-100/70"
              }`}
            >
              <Volume2
                className={`w-4 h-4 ${isExampleSpeaking ? "animate-pulse" : ""}`}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Listen</span>
            </button>
          )}
        </div>

        {/* German Sentence */}
        <p className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
          &ldquo;{item.exampleGerman}&rdquo;
        </p>

        {/* English Translation */}
        <p className="text-sm sm:text-base text-gray-600 mt-1.5 italic">
          {item.exampleEnglish}
        </p>
      </div>
    </Card>
  );
}
