import { useState, useEffect, useCallback, useRef } from "react";

export interface SpeechSynthesisHook {
  /** Whether the Web Speech API is supported in the current environment */
  isSupported: boolean;
  /** Whether speech synthesis is currently active */
  isSpeaking: boolean;
  /** The text that is currently being spoken, or null if idle */
  currentText: string | null;
  /** Speak a German word or sentence */
  speak: (text: string, lang?: string) => void;
  /** Stop any active speech synthesis */
  stop: () => void;
}

/**
 * Custom hook to provide native browser speech synthesis.
 * Configured by default for standard German (`de-DE`).
 * Gracefully degrades if Web Speech API is unsupported or blocked.
 */
export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [isSupported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const isSpeakingRef = useRef(false);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore any browser-level cancel errors
      }
    }
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setCurrentText(null);
  }, []);

  const speak = useCallback(
    (text: string, lang = "de-DE") => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }

      if (!text || text.trim() === "") {
        return;
      }

      try {
        // Cancel any pending/ongoing speech before starting a new utterance
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        // Moderate speaking rate (0.88) for clearer articulation for language learners
        utterance.rate = 0.88;
        utterance.pitch = 1.0;

        // Try to select a German voice if voices are populated
        const voices = window.speechSynthesis.getVoices();
        const germanVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("de") ||
            v.lang.toLowerCase().includes("de-de")
        );
        if (germanVoice) {
          utterance.voice = germanVoice;
        }

        utterance.onstart = () => {
          isSpeakingRef.current = true;
          setIsSpeaking(true);
          setCurrentText(text);
        };

        utterance.onend = () => {
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          setCurrentText(null);
        };

        utterance.onerror = () => {
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          setCurrentText(null);
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback safely if browser refuses speech call
        isSpeakingRef.current = false;
        setIsSpeaking(false);
        setCurrentText(null);
      }
    },
    []
  );

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // Ignore cancel error on unmount
        }
      }
    };
  }, []);

  return {
    isSupported,
    isSpeaking,
    currentText,
    speak,
    stop,
  };
}
