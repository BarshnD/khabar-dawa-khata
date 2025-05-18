
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'bengali' | 'english';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (bengaliText: string, englishText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('bengali');

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
