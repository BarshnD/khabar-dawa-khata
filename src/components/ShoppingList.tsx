
import React, { useRef, useState } from "react";
import { Check, X, ChevronRight, ShoppingBasket, Edit } from "lucide-react";
import { useShoppingList, ListItem } from "@/contexts/ShoppingListContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";

const ShoppingList: React.FC = () => {
  const { activeListId, getActiveList, toggleItemCompleted, removeItem, updateItem } = useShoppingList();
  const { t } = useLanguage();
  const activeList = getActiveList();
  const listRef = useRef<HTMLDivElement>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  if (!activeListId || !activeList) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <ShoppingBasket className="h-12 w-12 mb-2 text-bengali-orange" />
        <p className="text-xl font-medium">{t("কোন তালিকা নির্বাচন করা হয়নি", "No list selected")}</p>
        <p className="text-sm">{t("অনুগ্রহ করে একটি তালিকা নির্বাচন করুন বা নতুন তালিকা তৈরি করুন", "Please select a list or create a new one")}</p>
      </div>
    );
  }

  const completedItems = activeList.items.filter(item => item.completed);
  const incompleteItems = activeList.items.filter(item => !item.completed);

  // Group items by category
  const groupedItems = incompleteItems.reduce<Record<string, ListItem[]>>((acc, item) => {
    const category = item.category || "uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const handleEditItem = (item: ListItem) => {
    setEditingItemId(item.id);
    setEditingText(item.name);
  };

  const saveEdit = () => {
    if (editingItemId && editingText.trim() && activeListId) {
      const item = activeList.items.find(item => item.id === editingItemId);
      if (item) {
        updateItem(activeListId, { ...item, name: editingText.trim() });
      }
      setEditingItemId(null);
      setEditingText("");
    }
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditingText("");
  };

  // Handle enter key press to save edit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  return (
    <div 
      className="flex flex-col space-y-4 overflow-auto pb-2"
      ref={listRef}
      style={{ maxHeight: "calc(100vh - 280px)" }}
    >
      {/* Incomplete items */}
      {incompleteItems.length === 0 ? (
        <div className="text-center py-6 px-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("এখনও কোন আইটেম যোগ করা হয়নি", "No items added yet")}</p>
          <p className="text-sm text-gray-400">{t("মাইক বাটন ক্লিক করে কথা বলে আইটেম যোগ করুন", "Click the mic button and speak to add items")}</p>
        </div>
      ) : (
        Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-1">
            {category !== "uncategorized" && (
              <h3 className="text-sm font-medium text-gray-500 pl-2">
                {t(category, category)}
              </h3>
            )}
            <div className="space-y-1">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <button
                    onClick={() => toggleItemCompleted(activeListId, item.id)}
                    className="w-6 h-6 rounded-full border-2 border-bengali-green flex items-center justify-center flex-shrink-0"
                  >
                    <Check className="h-4 w-4 text-white" style={{ opacity: 0 }} />
                  </button>
                  
                  {editingItemId === item.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input 
                        value={editingText} 
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 h-8 py-1"
                        autoFocus
                      />
                      <button onClick={saveEdit} className="text-bengali-green">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={cancelEdit} className="text-gray-400">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span 
                        className="flex-1 text-left truncate"
                        onClick={() => handleEditItem(item)}
                      >
                        {item.name}
                      </span>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-gray-400 hover:text-bengali-blue mr-1"
                        aria-label={t("সম্পাদনা করুন", "Edit")}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeItem(activeListId, item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label={t("মুছুন", "Delete")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Completed items section */}
      {completedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <ChevronRight className="h-4 w-4 mr-1" />
            {t("সম্পূর্ণ আইটেম", "Completed items")} ({completedItems.length})
          </h3>
          <div className="space-y-1">
            {completedItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <button
                  onClick={() => toggleItemCompleted(activeListId, item.id)}
                  className="w-6 h-6 rounded-full bg-bengali-green flex items-center justify-center flex-shrink-0"
                >
                  <Check className="h-4 w-4 text-white" />
                </button>

                {editingItemId === item.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input 
                      value={editingText} 
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 h-8 py-1"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="text-bengali-green">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={cancelEdit} className="text-gray-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span 
                      className="flex-1 line-through text-gray-500 truncate"
                      onClick={() => handleEditItem(item)}
                    >
                      {item.name}
                    </span>
                    <button
                      onClick={() => handleEditItem(item)}
                      className="text-gray-400 hover:text-bengali-blue mr-1"
                      aria-label={t("সম্পাদনা করুন", "Edit")}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeItem(activeListId, item.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label={t("মুছুন", "Delete")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
