
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const { 
    language = "bn-IN", // Bengali (India) as default
    continuous = false, 
    interimResults = true 
  } = options;

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
    } else {
      toast.error("আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়");
      console.error("Speech recognition is not supported in this browser.");
    }
  }, []);

  const start = useCallback(() => {
    if (!isSupported) {
      toast.error("আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়");
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = language;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;

      recognition.onstart = () => {
        setListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const transcriptResult = result[0].transcript;
        
        if (result.isFinal) {
          setTranscript(transcriptResult);
        } else {
          setTranscript(transcriptResult);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === "not-allowed") {
          toast.error("মাইক্রোফোনে অনুমতি দেয়া হয়নি");
        } else if (event.error === "network") {
          toast.error("নেটওয়ার্ক সমস্যা");
        } else {
          toast.error(`ত্রুটি: ${event.error}`);
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
      toast.error("ভয়েস ইনপুট শুরু করতে সমস্যা হচ্ছে");
      setListening(false);
    }
  }, [continuous, interimResults, isSupported, language]);

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
