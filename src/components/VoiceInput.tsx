
import React, { useState, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

type VoiceInputProps = {
  onItemAdded?: () => void;
};

const VoiceInput: React.FC<VoiceInputProps> = ({ onItemAdded }) => {
  const { language, t } = useLanguage();
  const [speechLang, setSpeechLang] = useState<"bn-IN" | "en-IN">(language === "bengali" ? "bn-IN" : "en-IN");
  
  const { startListening, stopListening, isListening, transcript, resetTranscript, isSupported } = 
    useSpeechRecognition({ language: speechLang, continuous: false });
  
  const { activeListId, addItem } = useShoppingList();
  const [processing, setProcessing] = useState(false);

  // Update speech recognition language when app language changes
  useEffect(() => {
    setSpeechLang(language === "bengali" ? "bn-IN" : "en-IN");
  }, [language]);

  useEffect(() => {
    if (!isListening && transcript) {
      handleProcessVoiceInput();
    }
  }, [isListening, transcript]);

  const handleProcessVoiceInput = async () => {
    if (!transcript || !activeListId) return;
    
    setProcessing(true);
    
    try {
      // Simple processing logic - in a real app, you might want to use NLP
      const processedText = transcript.trim();
      
      if (processedText.length > 0) {
        // Add the item to the active list
        addItem(activeListId, processedText, undefined, language);
        toast.success(t(`"${processedText}" যোগ করা হয়েছে`, `"${processedText}" added`));
        
        if (onItemAdded) {
          onItemAdded();
        }
      }
    } catch (error) {
      console.error("Error processing voice input:", error);
      toast.error(t("ভয়েস ইনপুট প্রক্রিয়াকরণে সমস্যা", "Error processing voice input"));
    } finally {
      resetTranscript();
      setProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        <p>{t("আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়। অনুগ্রহ করে ক্রোম বা সাফারি ব্যবহার করুন।", 
          "Voice input is not supported in your browser. Please use Chrome or Safari.")}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-2">
        <Button 
          onClick={toggleListening} 
          variant={isListening ? "destructive" : "default"}
          size="lg"
          className={`rounded-full p-3 w-14 h-14 ${isListening ? 'bg-red-500' : 'bg-bengali-green'}`}
          disabled={processing}
          aria-label={isListening ? t("বন্ধ করুন", "Stop") : t("শুরু করুন", "Start")}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" />
          ) : processing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">
            {isListening 
              ? t("বলুন...", "Speak...") 
              : t("বাজার তালিকায় যোগ করতে শুরু করুন", "Start to add to your shopping list")}
          </p>
          <p className="text-xs opacity-70">
            {language === "bengali" ? t("বাংলা", "Bengali") : t("ইংরেজি", "English")}
          </p>
        </div>
      </div>
      
      {isListening && (
        <div className="px-4 py-3 bg-white rounded-lg border animate-pulse-light">
          {transcript || t("আপনার কথা শোনা হচ্ছে...", "Listening to your voice...")}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
