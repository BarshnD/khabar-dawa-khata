
import React, { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { toast } from "sonner";

type TextInputProps = {
  onItemAdded?: () => void;
};

const TextInput: React.FC<TextInputProps> = ({ onItemAdded }) => {
  const [itemName, setItemName] = useState("");
  const { activeListId, addItem } = useShoppingList();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeListId) {
      toast.error("কোন তালিকা নির্বাচন করা হয়নি");
      return;
    }
    
    if (itemName.trim()) {
      // Determine language based on simple heuristic
      // In a production app, you would use proper language detection
      const containsBengaliChars = /[\u0980-\u09FF]/.test(itemName);
      const language = containsBengaliChars ? "bengali" : "english";
      
      addItem(activeListId, itemName.trim(), undefined, language);
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
        placeholder="আইটেম নাম লিখুন..."
        className="flex-1"
      />
      <Button type="submit" disabled={!itemName.trim() || !activeListId}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default TextInput;
