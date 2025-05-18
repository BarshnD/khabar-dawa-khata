
import React, { useRef } from "react";
import Header from "@/components/Header";
import ShoppingList from "@/components/ShoppingList";
import VoiceInput from "@/components/VoiceInput";
import TextInput from "@/components/TextInput";
import RecipeParser from "@/components/RecipeParser";
import FestivalListsSection from "@/components/FestivalListsSection";
import LanguageToggle from "@/components/LanguageToggle";
import { ShoppingListProvider } from "@/contexts/ShoppingListContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ShoppingListProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-3 py-3 flex flex-col max-w-md">
          {/* Language toggle */}
          <div className="flex justify-end mb-2">
            <LanguageToggle />
          </div>
          
          {/* Shopping list */}
          <div className="flex-1 overflow-auto mb-3">
            <ShoppingList />
          </div>

          {/* Tools section */}
          <div className="space-y-2 py-2">
            <div className="flex gap-2">
              <RecipeParser />
              <FestivalListsSection />
            </div>
          </div>

          {/* Voice input section */}
          <div className="bg-white p-3 rounded-lg shadow-sm border mt-2">
            <VoiceInput onItemAdded={scrollToBottom} />
          </div>

          {/* Text input */}
          <div className="mt-2" ref={listRef}>
            <TextInput onItemAdded={scrollToBottom} />
          </div>

          {/* Bandwidth-saving footer */}
          <footer className="mt-4 text-center text-xs text-gray-400 pb-2">
            <p>{t("বাংলা স্মার্ট বাজার তালিকা © 2025", "Bengali Smart Shopping List © 2025")}</p>
          </footer>
        </main>
      </div>
    </ShoppingListProvider>
  );
};

export default Index;
