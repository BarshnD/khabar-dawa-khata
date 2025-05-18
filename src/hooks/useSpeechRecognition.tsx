
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

// Define the proper types for Web Speech API
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError {
  error: string;
}

interface SpeechRecognitionInterface {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

// Declare the global interfaces for TypeScript
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInterface;
    webkitSpeechRecognition?: new () => SpeechRecognitionInterface;
  }
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognitionInterface | null>(null);
  const { language: appLanguage, t } = useLanguage();

  const { 
    language = appLanguage === 'bengali' ? "bn-IN" : "en-IN", // Set based on app language
    continuous = false, 
    interimResults = true 
  } = options;

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
    } else {
      toast.error(t("আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়", "Voice input is not supported in your browser."));
      console.error("Speech recognition is not supported in this browser.");
    }
  }, [t]);

  // Update speech recognition language when app language changes
  useEffect(() => {
    if (appLanguage) {
      options.language = appLanguage === 'bengali' ? "bn-IN" : "en-IN";
    }
  }, [appLanguage, options]);

  const start = useCallback(() => {
    if (!isSupported) {
      toast.error(t("আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়", "Voice input is not supported in your browser."));
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("SpeechRecognition is not available");
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();

      recognition.lang = language;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;

      recognition.onstart = () => {
        setListening(true);
        setTranscript("");
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptResult = result[0].transcript;
        
        if (result.isFinal) {
          setTranscript(transcriptResult);
        } else {
          setTranscript(transcriptResult);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === "not-allowed") {
          toast.error(t("মাইক্রোফোনে অনুমতি দেয়া হয়নি", "Microphone permission denied"));
        } else if (event.error === "network") {
          toast.error(t("নেটওয়ার্ক সমস্যা", "Network error"));
        } else {
          toast.error(t(`ত্রুটি: ${event.error}`, `Error: ${event.error}`));
        }
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
      setRecognitionInstance(recognition);
      
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast.error(t("ভয়েস ইনপুট শুরু করতে সমস্যা হচ্ছে", "Error starting voice input"));
      setListening(false);
    }
  }, [continuous, interimResults, isSupported, language, t]);

  const stop = useCallback(() => {
    if (recognitionInstance) {
      recognitionInstance.stop();
      setListening(false);
    }
  }, [recognitionInstance]);

  return {
    isListening: listening,
    transcript,
    startListening: start,
    stopListening: stop,
    isSupported,
    resetTranscript: () => setTranscript("")
  };
};
