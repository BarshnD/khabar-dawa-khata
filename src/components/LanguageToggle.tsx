
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'bengali' ? 'english' : 'bengali');
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={toggleLanguage}
      className="gap-1 text-xs border-bengali-blue text-bengali-blue hover:bg-bengali-blue/10"
    >
      <Languages className="h-3.5 w-3.5" />
      {t('EN', 'বাং')}
    </Button>
  );
};

export default LanguageToggle;
