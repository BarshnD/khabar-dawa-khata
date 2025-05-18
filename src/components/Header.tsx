
import React from "react";
import { Plus, BookOpen, CalendarDays } from "lucide-react";
import { useShoppingList } from "@/contexts/ShoppingListContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Header: React.FC = () => {
  const { lists, activeListId, setActiveListId, addList } = useShoppingList();
  const [newListName, setNewListName] = React.useState("");
  const [open, setOpen] = React.useState(false);
  
  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      addList(newListName);
      setNewListName("");
      setOpen(false);
    }
  };

  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveListId(e.target.value);
  };

  const activeList = lists.find(list => list.id === activeListId);

  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-bengali-red to-bengali-orange p-4 shadow-md">
      <div className="container mx-auto flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">
            বাজার তালিকা
            <span className="text-sm block font-normal opacity-80">Smart Bengali Shopping List</span>
          </h1>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white">
                <Plus className="h-4 w-4 mr-2" />
                নতুন তালিকা
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[320px] font-bengali">
              <DialogHeader>
                <DialogTitle>নতুন বাজার তালিকা তৈরি করুন</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddList} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">তালিকার নাম</Label>
                  <Input
                    id="name"
                    placeholder="উদাহরণ: সাপ্তাহিক বাজার"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="font-bengali"
                  />
                </div>
                <Button type="submit" className="w-full">তালিকা তৈরি করুন</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center gap-2 text-white">
          <select
            value={activeListId || ""}
            onChange={handleListChange}
            className="bg-white/20 border-0 rounded p-2 text-white w-full focus:ring-2 focus:ring-white focus:outline-none"
            aria-label="Select shopping list"
          >
            {lists.map(list => (
              <option key={list.id} value={list.id} className="text-black">
                {list.type === "festival" ? `🎉 ${list.name}` : list.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
