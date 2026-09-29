import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { CEFRLevel, VocabularyCategory } from "../types/vocabulary";
import type {
  PracticeSessionConfig,
  PracticeSession as PracticeSessionType,
  PracticeResult,
} from "../types/practice";
import {
  PracticeSetup,
  PracticeSession,
  PracticeComplete,
} from "../components/practice";
import { categories } from "../data/categories";
import {
  createPracticeSession,
  calculatePracticeResult,
  recordMistake,
  recordSuccessfulRecall,
  recordPracticeAnswer,
  recordPracticeSessionCompleted,
} from "../utils";
import { useSpeechSynthesis } from "../hooks";


type ViewMode = "setup" | "session" | "complete";

export function PracticePage() {
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
  const [session, setSession] = useState<PracticeSessionType | null>(null);

  // Native speech synthesis
  const {
    isSupported: speechSupported,
    isSpeaking,
    currentText: speakingText,
    speak,
    stop,
  } = useSpeechSynthesis();

  // Start a new practice session from setup configuration
  const handleStartPractice = (config: PracticeSessionConfig) => {
    stop();
    const newSession = createPracticeSession(config);
    setSession(newSession);
    setViewMode("session");
  };

  // Record answer for current question and persist mistake or recall progress
  const handleAnswer = (
    questionId: string,
    selectedOptionId: string,
    isCorrect: boolean
  ) => {
    if (!session) return;
    // Guard against duplicate answer recording on re-renders or repeated submits
    if (session.answers[questionId]) return;

    const currentQuestion = session.questions.find((q) => q.id === questionId);
    if (currentQuestion) {
      if (!isCorrect) {
        const chosenOption = currentQuestion.options.find(
          (o) => o.id === selectedOptionId
        );
        const correctOption = currentQuestion.options.find(
          (o) => o.id === currentQuestion.correctOptionId
        );
        recordMistake(
          currentQuestion.targetItem,
          currentQuestion.type,
          chosenOption?.text ?? "No answer",
          correctOption?.text ?? currentQuestion.explanation.germanText
        );
      } else {
        recordSuccessfulRecall(currentQuestion.targetItem.id);
      }
    }

    // Record persistent practice answer
    recordPracticeAnswer(isCorrect);

    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: {
            questionId,
            selectedOptionId,
            isCorrect,
            answeredAt: Date.now(),
          },
        },
      };
    });
  };

  // Advance to next question or complete session
  const handleNextQuestion = () => {
    stop();
    if (!session) return;

    if (session.currentIndex < session.questions.length - 1) {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentIndex: prev.currentIndex + 1,
        };
      });
    } else {
      // Calculate correct answers from completed session
      const answersList = Object.values(session.answers);
      const correctCount = answersList.filter((a) => a.isCorrect).length;
      const categoryLabel =
        session.config.category === "all"
          ? "All Topics"
          : categories.find((c) => c.id === session.config.category)?.label ??
            session.config.category;

      recordPracticeSessionCompleted(
        correctCount,
        session.questions.length,
        `${session.config.level} ${categoryLabel}`
      );

      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          isCompleted: true,
          completedAt: Date.now(),
        };
      });
      setViewMode("complete");
    }
  };


  // Exit back to practice setup
  const handleExit = () => {
    stop();
    setViewMode("setup");
  };

  // Re-run the practice session with the same settings
  const handlePracticeAgain = () => {
    stop();
    if (!session) {
      setViewMode("setup");
      return;
    }
    const newSession = createPracticeSession(session.config);
    setSession(newSession);
    setViewMode("session");
  };

  // Return to setup to change settings
  const handleNewSession = () => {
    stop();
    setViewMode("setup");
  };

  const results: PracticeResult | null = session
    ? calculatePracticeResult(session)
    : null;

  return (
    <div className="py-2">
      {viewMode === "setup" && (
        <PracticeSetup
          onStartPractice={handleStartPractice}
          initialLevel={initialLevel}
          initialCategory={initialCategory}
        />
      )}

      {viewMode === "session" && session && (
        <PracticeSession
          session={session}
          onAnswer={handleAnswer}
          onNextQuestion={handleNextQuestion}
          onExit={handleExit}
          onSpeak={speak}
          isSpeaking={isSpeaking}
          speakingText={speakingText}
          speechSupported={speechSupported}
        />
      )}

      {viewMode === "complete" && results && (
        <PracticeComplete
          result={results}
          onPracticeAgain={handlePracticeAgain}
          onNewSession={handleNewSession}
          onSpeak={speak}
          speechSupported={speechSupported}
        />
      )}
    </div>
  );
}
