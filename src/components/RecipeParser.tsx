
import React, { useState } from "react";
import { Book, X, Check } from "lucide-react";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DialogTrigger } from "@radix-ui/react-dialog";

const RecipeParser: React.FC = () => {
  const [recipeText, setRecipeText] = useState("");
  const [open, setOpen] = useState(false);
  const { parseRecipe } = useShoppingList();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipeText.trim()) {
      parseRecipe(recipeText);
      setOpen(false);
      setRecipeText("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full">
          <Book className="h-4 w-4" />
          <span>রেসিপি থেকে উপকরণ যোগ করুন</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle>রেসিপি থেকে উপকরণ যোগ করুন</DialogTitle>
          <DialogDescription>
            রেসিপি পেস্ট করুন বা টাইপ করুন। আমরা উপকরণগুলি আপনার তালিকায় যোগ করব।
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={recipeText}
            onChange={(e) => setRecipeText(e.target.value)}
            placeholder="এখানে রেসিপি পেস্ট করুন..."
            className="min-h-[200px]"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              বাতিল
            </Button>
            <Button type="submit">
              <Check className="h-4 w-4 mr-2" />
              উপকরণ যোগ করুন
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeParser;
