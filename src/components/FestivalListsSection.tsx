
import React from "react";
import { Calendar } from "lucide-react";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const FestivalListsSection: React.FC = () => {
  const { getFestivalLists, setActiveListId } = useShoppingList();
  const festivalLists = getFestivalLists();
  const [open, setOpen] = React.useState(false);

  const handleSelectList = (id: string) => {
    setActiveListId(id);
    setOpen(false);
  };

  if (festivalLists.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full">
          <Calendar className="h-4 w-4" />
          <span>উৎসবের তালিকা</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>উৎসবের তালিকা</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 mt-2">
          {festivalLists.map(list => (
            <Button
              key={list.id}
              variant="outline"
              className="w-full justify-start h-auto py-3 text-left"
              onClick={() => handleSelectList(list.id)}
            >
              <div>
                <div className="font-medium">{list.name}</div>
                <div className="text-sm text-muted-foreground">
                  {list.items.length} আইটেম
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FestivalListsSection;
