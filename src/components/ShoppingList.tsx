
import React, { useRef } from "react";
import { Check, X, ChevronRight, ShoppingBasket } from "lucide-react";
import { useShoppingList, ListItem } from "@/contexts/ShoppingListContext";

const ShoppingList: React.FC = () => {
  const { activeListId, getActiveList, toggleItemCompleted, removeItem } = useShoppingList();
  const activeList = getActiveList();
  const listRef = useRef<HTMLDivElement>(null);

  if (!activeListId || !activeList) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
        <ShoppingBasket className="h-12 w-12 mb-2 text-bengali-orange" />
        <p className="text-xl font-medium">কোন তালিকা নির্বাচন করা হয়নি</p>
        <p className="text-sm">অনুগ্রহ করে একটি তালিকা নির্বাচন করুন বা নতুন তালিকা তৈরি করুন</p>
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

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  return (
    <div 
      className="flex flex-col space-y-4 overflow-auto"
      ref={listRef}
      style={{ maxHeight: "calc(100vh - 240px)" }}
    >
      {/* Incomplete items */}
      {incompleteItems.length === 0 ? (
        <div className="text-center py-6 px-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">এখনও কোন আইটেম যোগ করা হয়নি</p>
          <p className="text-sm text-gray-400">মাইক বাটন ক্লিক করে কথা বলে আইটেম যোগ করুন</p>
        </div>
      ) : (
        Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-1">
            {category !== "uncategorized" && (
              <h3 className="text-sm font-medium text-gray-500 pl-2">{category}</h3>
            )}
            <div className="space-y-1">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <button
                    onClick={() => toggleItemCompleted(activeListId, item.id)}
                    className="w-6 h-6 rounded-full border-2 border-bengali-green flex items-center justify-center"
                  >
                    <Check className="h-4 w-4 text-white" style={{ opacity: 0 }} />
                  </button>
                  <span className="flex-1 text-left">{item.name}</span>
                  <button
                    onClick={() => removeItem(activeListId, item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
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
            সম্পূর্ণ আইটেম ({completedItems.length})
          </h3>
          <div className="space-y-1">
            {completedItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <button
                  onClick={() => toggleItemCompleted(activeListId, item.id)}
                  className="w-6 h-6 rounded-full bg-bengali-green flex items-center justify-center"
                >
                  <Check className="h-4 w-4 text-white" />
                </button>
                <span className="flex-1 line-through text-gray-500">{item.name}</span>
                <button
                  onClick={() => removeItem(activeListId, item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
