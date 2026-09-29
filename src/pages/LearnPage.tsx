import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type {
  CEFRLevel,
  VocabularyCategory,
  VocabularyItem,
} from "../types/vocabulary";
import { categories } from "../data/categories";
import {
  LearningSetup,
  LearningSession,
  LearningComplete,
} from "../components/learn";
import { useSpeechSynthesis } from "../hooks";
import { recordWordsStudied, recordLearnSessionCompleted } from "../utils";


type ViewMode = "setup" | "session" | "complete";

export function LearnPage() {
  const [searchParams] = useSearchParams();

  // Validate optional level from query params
  const paramLevel = searchParams.get("level");
  const initialLevel: CEFRLevel =
    paramLevel === "A1" || paramLevel === "A2" ? paramLevel : "A1";

  // Validate optional category from query params
  const paramCat = searchParams.get("category");
  const validCategories: (VocabularyCategory | "all")[] = [
    "body",
    "symptoms",
    "patientCommunication",
    "hospital",
    "basicNursing",
    "vitalSigns",
    "all",
  ];
  const initialCategory: VocabularyCategory | "all" =
    paramCat && validCategories.includes(paramCat as VocabularyCategory | "all")
      ? (paramCat as VocabularyCategory | "all")
      : "body";

  const [viewMode, setViewMode] = useState<ViewMode>("setup");
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>(initialLevel);
  const [currentCategory, setCurrentCategory] = useState<
    VocabularyCategory | "all"
  >(initialCategory);
  const [sessionItems, setSessionItems] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Native speech synthesis hook
  const {
    isSupported: speechSupported,
    isSpeaking,
    currentText: speakingText,
    speak,
    stop,
  } = useSpeechSynthesis();

  // Automatically record each vocabulary item presented during an active learning session
  useEffect(() => {
    if (viewMode === "session" && sessionItems[currentIndex]) {
      recordWordsStudied(sessionItems[currentIndex].id);
    }
  }, [viewMode, sessionItems, currentIndex]);

  // Handler to start a new learning session
  const handleStartSession = (
    level: CEFRLevel,
    category: VocabularyCategory | "all",
    items: VocabularyItem[]
  ) => {
    stop();
    setCurrentLevel(level);
    setCurrentCategory(category);
    setSessionItems(items);
    setCurrentIndex(0);
    setViewMode("session");
  };

  // Move to next word, or complete session if at the end
  const handleNextWord = () => {
    stop();
    if (currentIndex < sessionItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const categoryLabel =
        currentCategory === "all"
          ? "All Topics"
          : categories.find((c) => c.id === currentCategory)?.label ??
            currentCategory;

      recordLearnSessionCompleted(
        sessionItems.length,
        `${currentLevel} ${categoryLabel}`
      );
      setViewMode("complete");
    }
  };


  // Move to previous word
  const handlePrevWord = () => {
    stop();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Exit back to setup
  const handleExitSession = () => {
    stop();
    setViewMode("setup");
  };

  // Restart the current set of words
  const handleRestart = () => {
    stop();
    setCurrentIndex(0);
    setViewMode("session");
  };

  // Return to topic selection
  const handleNewSession = () => {
    stop();
    setViewMode("setup");
  };

  return (
    <div className="py-2">
      {viewMode === "setup" && (
        <LearningSetup
          onStartSession={handleStartSession}
          initialLevel={currentLevel}
          initialCategory={currentCategory}
        />
      )}

      {viewMode === "session" && (
        <LearningSession
          level={currentLevel}
          category={currentCategory}
          items={sessionItems}
          currentIndex={currentIndex}
          onNext={handleNextWord}
          onPrev={handlePrevWord}
          onExit={handleExitSession}
          onSpeak={speak}
          isSpeaking={isSpeaking}
          speakingText={speakingText}
          speechSupported={speechSupported}
        />
      )}

      {viewMode === "complete" && (
        <LearningComplete
          level={currentLevel}
          category={currentCategory}
          items={sessionItems}
          onRestart={handleRestart}
          onNewSession={handleNewSession}
          onSpeak={speak}
          speechSupported={speechSupported}
        />
      )}
    </div>
  );
}
