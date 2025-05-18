
import React, { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

type TextInputProps = {
  onItemAdded?: () => void;
};

const TextInput: React.FC<TextInputProps> = ({ onItemAdded }) => {
  const [itemName, setItemName] = useState("");
  const { activeListId, addItem } = useShoppingList();
  const { language, t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeListId) {
      toast.error(t("কোন তালিকা নির্বাচন করা হয়নি", "No list selected"));
      return;
    }
    
    if (itemName.trim()) {
      // Determine language based on simple heuristic
      // In a production app, you would use proper language detection
      const containsBengaliChars = /[\u0980-\u09FF]/.test(itemName);
      const itemLanguage = containsBengaliChars ? "bengali" : "english";
      
      addItem(activeListId, itemName.trim(), undefined, itemLanguage);
      setItemName("");
      
      if (onItemAdded) {
        onItemAdded();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder={t("আইটেম নাম লিখুন...", "Enter item name...")}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={!itemName.trim() || !activeListId}
        aria-label={t("যোগ করুন", "Add")}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default TextInput;
