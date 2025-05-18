
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'bengali' | 'english';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (bengaliText: string, englishText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get user's preferred language from localStorage
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage === 'bengali' || savedLanguage === 'english') {
      return savedLanguage;
    }
    // Default to Bengali if no preference is saved
    return 'bengali';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferred-language', language);
  }, [language]);

  // Simple translation function that returns text based on current language
  const t = (bengaliText: string, englishText: string) => {
    return language === 'bengali' ? bengaliText : englishText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
