
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type ListItem = {
  id: string;
  name: string;
  completed: boolean;
  category?: string;
  language?: "bengali" | "english";
  quantity?: string;
  unit?: string;
};

export type ShoppingList = {
  id: string;
  name: string;
  items: ListItem[];
  createdAt: string;
  updatedAt: string;
  type?: "custom" | "festival" | "recipe";
};

type ShoppingListContextType = {
  lists: ShoppingList[];
  activeListId: string | null;
  setActiveListId: (id: string | null) => void;
  addList: (name: string, type?: "custom" | "festival" | "recipe") => void;
  deleteList: (id: string) => void;
  addItem: (listId: string, name: string, category?: string, language?: "bengali" | "english", quantity?: string, unit?: string) => void;
  updateItem: (listId: string, item: ListItem) => void;
  removeItem: (listId: string, itemId: string) => void;
  toggleItemCompleted: (listId: string, itemId: string) => void;
  getActiveList: () => ShoppingList | undefined;
  getFestivalLists: () => ShoppingList[];
  parseRecipe: (recipe: string) => void;
};

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

// Example festival lists with Bengali cultural context
const initialFestivalLists: ShoppingList[] = [
  {
    id: "durga-puja",
    name: "দুর্গা পূজার বাজার",
    items: [
      { id: "1", name: "মাছ", completed: false, category: "protein" },
      { id: "2", name: "মিষ্টি", completed: false, category: "sweets" },
      { id: "3", name: "ফুল", completed: false, category: "decoration" },
      { id: "4", name: "ধুপ", completed: false, category: "pooja" },
      { id: "5", name: "ফল", completed: false, category: "fruits" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: "festival",
  },
  {
    id: "poila-boishakh",
    name: "পয়লা বৈশাখের বাজার",
    items: [
      { id: "1", name: "পাঁপড়", completed: false },
      { id: "2", name: "নারকেল", completed: false },
      { id: "3", name: "চিনি", completed: false },
      { id: "4", name: "চাল", completed: false },
      { id: "5", name: "মিষ্টি দই", completed: false },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: "festival",
  }
];

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    const savedLists = localStorage.getItem("shopping-lists");
    if (savedLists) {
      try {
        const parsedLists = JSON.parse(savedLists);
        return [...initialFestivalLists, ...parsedLists];
      } catch (error) {
        console.error("Error parsing saved lists:", error);
        return [...initialFestivalLists, { 
          id: "default", 
          name: "আমার তালিকা", 
          items: [], 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString(),
          type: "custom"
        }];
      }
    }
    return [...initialFestivalLists, { 
      id: "default", 
      name: "আমার তালিকা", 
      items: [], 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(),
      type: "custom"
    }];
  });

  const [activeListId, setActiveListId] = useState<string | null>(() => {
    const saved = localStorage.getItem("active-list-id");
    return saved || "default";
  });

  useEffect(() => {
    // Only save custom lists, not festival lists
    const customLists = lists.filter(list => list.type !== "festival");
    localStorage.setItem("shopping-lists", JSON.stringify(customLists));
  }, [lists]);

  useEffect(() => {
    if (activeListId) {
      localStorage.setItem("active-list-id", activeListId);
    }
  }, [activeListId]);

  const addList = (name: string, type: "custom" | "festival" | "recipe" = "custom") => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type
    };
    setLists([...lists, newList]);
    setActiveListId(newList.id);
    toast.success(`তালিকা "${name}" তৈরি হয়েছে`);
  };

  const deleteList = (id: string) => {
    // Don't allow deleting festival lists
    const listToDelete = lists.find(list => list.id === id);
    if (listToDelete?.type === "festival") {
      toast.error("পূজার তালিকা মুছতে পারবেন না");
      return;
    }
    
    setLists(lists.filter(list => list.id !== id));
    if (activeListId === id) {
      setActiveListId(lists[0]?.id || null);
    }
    toast.success("তালিকা মুছে ফেলা হয়েছে");
  };

  const addItem = (
    listId: string, 
    name: string, 
    category?: string, 
    language?: "bengali" | "english",
    quantity?: string,
    unit?: string
  ) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        // Check if item with same name already exists
        const existingItem = list.items.find(item => 
          item.name.toLowerCase() === name.toLowerCase()
        );
        
        if (existingItem) {
          toast.info(`"${name}" আগে থেকেই তালিকায় আছে`);
          return list;
        }
        
        return {
          ...list,
          items: [
            ...list.items,
            {
              id: Date.now().toString(),
              name,
              completed: false,
              category,
              language,
              quantity,
              unit
            }
          ],
          updatedAt: new Date().toISOString()
        };
      }
      return list;
    }));
  };

  const updateItem = (listId: string, updatedItem: ListItem) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          ),
          updatedAt: new Date().toISOString()
        };
      }
      return list;
    }));
  };

  const removeItem = (listId: string, itemId: string) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId),
          updatedAt: new Date().toISOString()
        };
      }
      return list;
    }));
  };

  const toggleItemCompleted = (listId: string, itemId: string) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: list.items.map(item => {
            if (item.id === itemId) {
              return { ...item, completed: !item.completed };
            }
            return item;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return list;
    }));
  };

  const getActiveList = () => {
    return lists.find(list => list.id === activeListId);
  };

  const getFestivalLists = () => {
    return lists.filter(list => list.type === "festival");
  };

  // Simple recipe parser to extract ingredients
  const parseRecipe = (recipe: string) => {
    if (!activeListId) return;
    
    // This is a very simple parser, in real app would need NLP specifically trained for Bengali recipes
    const commonIngredientIndicators = [
      "উপকরণ:", "ingredients:", "সামগ্রী:", "লাগবে:", "needed:", "required:"
    ];
    
    let ingredientsSection = recipe;
    
    // Try to find and extract the ingredients section
    for (const indicator of commonIngredientIndicators) {
      if (recipe.toLowerCase().includes(indicator.toLowerCase())) {
        const parts = recipe.toLowerCase().split(indicator.toLowerCase());
        if (parts.length > 1) {
          ingredientsSection = parts[1];
          break;
        }
      }
    }
    
    // Split by common delimiters and clean up
    let ingredients = ingredientsSection
      .split(/[,\n।-]/)
      .map(item => item.trim())
      .filter(item => item.length > 1 && !/^\d+$/.test(item));
      
    // Filter out common non-ingredient text
    const nonIngredients = ["method", "preparation", "প্রণালী", "পদ্ধতি"];
    ingredients = ingredients.filter(item => !nonIngredients.some(ni => item.toLowerCase().includes(ni)));
    
    // Limit to first 20 potential ingredients to avoid noise
    ingredients = ingredients.slice(0, 20);
    
    // Add to list
    if (ingredients.length > 0) {
      const uniqueIngredients = new Set(ingredients);
      uniqueIngredients.forEach(ingredient => {
        addItem(activeListId, ingredient);
      });
      
      toast.success(`${uniqueIngredients.size} টি উপকরণ যোগ করা হয়েছে`);
    } else {
      toast.error("কোন উপকরণ খুঁজে পাওয়া যায়নি");
    }
  };

  return (
    <ShoppingListContext.Provider
      value={{
        lists,
        activeListId,
        setActiveListId,
        addList,
        deleteList,
        addItem,
        updateItem,
        removeItem,
        toggleItemCompleted,
        getActiveList,
        getFestivalLists,
        parseRecipe
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider");
  }
  return context;
};
