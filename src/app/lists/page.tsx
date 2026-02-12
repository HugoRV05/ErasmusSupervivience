"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { PageShell } from "@/components/layout/PageShell";
import { AnimatedPage } from "@/components/layout/AnimatedPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Check, Trash2, Edit2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mascot } from "@/components/ui/Mascot";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export default function ListsPage() {
  const {
    shoppingLists, addShoppingList, updateShoppingList, deleteShoppingList,
    addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearCheckedItems,
  } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [activeListId, setActiveListId] = useState(shoppingLists[0]?.id || "");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("");
  const [newListOpen, setNewListOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListIcon, setNewListIcon] = useState("ShoppingCart");
  const [editingList, setEditingList] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (shoppingLists.length > 0 && !shoppingLists.find((l) => l.id === activeListId)) {
      setActiveListId(shoppingLists[0].id);
    }
  }, [shoppingLists, activeListId]);

  const activeList = shoppingLists.find((l) => l.id === activeListId);

  const handleAddItem = () => {
    if (!newItemName.trim() || !activeListId) return;
    addShoppingItem(activeListId, {
      name: newItemName.trim(),
      quantity: newItemQty.trim() || "1",
    });
    setNewItemName("");
    setNewItemQty("");
  };

  const handleAddList = () => {
    if (!newListName.trim()) return;
    addShoppingList({ name: newListName.trim(), icon: newListIcon || "ShoppingCart" });
    setNewListName("");
    setNewListIcon("ShoppingCart");
    setNewListOpen(false);
  };

  const startEditList = (id: string, name: string, icon: string) => {
    setEditingList(id);
    setEditName(name);
    setEditIcon(icon);
  };

  const saveEditList = () => {
    if (editingList && editName.trim()) {
      updateShoppingList(editingList, editName.trim(), editIcon);
      setEditingList(null);
    }
  };

  if (!mounted) return null;

  const checkedCount = activeList?.items.filter((i) => i.checked).length || 0;

  return (
    <AnimatedPage>
      <PageShell
        title="Shopping Lists"
        subtitle={`${shoppingLists.length} lists`}
        action={
          <Dialog open={newListOpen} onOpenChange={setNewListOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl gap-1.5">
                <Plus className="h-4 w-4" /> List
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-sm">
              <DialogHeader>
                <DialogTitle>New List</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex gap-3">
                  <Input
                    value={newListIcon}
                    onChange={(e) => setNewListIcon(e.target.value)}
                    className="w-32 rounded-xl"
                  />
                  <Input
                    placeholder="List name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="rounded-xl flex-1"
                  />
                </div>
                <Button onClick={handleAddList} className="w-full rounded-xl" disabled={!newListName.trim()}>
                  Create List
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      >
        {/* List Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide mb-4">
          {shoppingLists.map((list) => (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border shrink-0",
                activeListId === list.id
                  ? "border-primary bg-primary/10 text-foreground shadow-sm"
                  : "border-border/50 bg-card/60 backdrop-blur-md text-muted-foreground hover:text-foreground"
              )}
            >
              <DynamicIcon name={list.icon || "ShoppingCart"} size={16} />
              <span>{list.name}</span>
              {list.items.length > 0 && (
                <span className="ml-1 text-xs bg-secondary px-1.5 py-0.5 rounded-full">
                  {list.items.filter((i) => !i.checked).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeList && (
          <>
            {/* List Header with Edit/Delete */}
            <div className="flex items-center justify-between mb-4">
              {editingList === activeList.id ? (
                <div className="flex gap-2 items-center flex-1">
                  <Input
                    value={editIcon}
                    onChange={(e) => setEditIcon(e.target.value)}
                    className="w-32 rounded-lg"
                  />
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="rounded-lg flex-1"
                  />
                  <Button size="sm" onClick={saveEditList} className="rounded-lg">
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingList(null)} className="rounded-lg">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditList(activeList.id, activeList.name, activeList.icon)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {shoppingLists.length > 1 && (
                    <button
                      onClick={() => deleteShoppingList(activeList.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {checkedCount > 0 && editingList !== activeList.id && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => clearCheckedItems(activeListId)}
                  className="text-xs text-muted-foreground"
                >
                  Clear checked ({checkedCount})
                </Button>
              )}
            </div>

            {/* Add Item Input */}
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add item..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                className="rounded-xl flex-1"
              />
              <Input
                placeholder="Qty"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                className="rounded-xl w-16"
              />
              <Button onClick={handleAddItem} size="icon" className="rounded-xl shrink-0" disabled={!newItemName.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {activeList.items
                .sort((a, b) => Number(a.checked) - Number(b.checked))
                .map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 transition-all",
                      item.checked
                        ? "border-border/10 opacity-50"
                        : "border-border/50 bg-card/60 backdrop-blur-md shadow-sm"
                    )}
                  >
                    <button
                      onClick={() => toggleShoppingItem(activeListId, item.id)}
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
                        item.checked
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {item.checked && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        item.checked && "line-through text-muted-foreground"
                      )}
                    >
                      {item.name}
                    </span>
                    {item.quantity && (
                      <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                    )}
                    <button
                      onClick={() => deleteShoppingItem(activeListId, item.id)}
                      className="p-1 text-muted-foreground hover:text-destructive transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
            </div>

            {activeList.items.length === 0 && (
              <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
                <Mascot size={150} pose="success" />
                <p className="text-sm mt-4 font-medium italic">Everything is under control</p>
              </div>
            )}
          </>
        )}

        {shoppingLists.length === 0 && (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
            <Mascot size={180} pose="lists" />
            <p className="text-sm mt-4 font-medium">No lists yet</p>
            <p className="text-xs mt-1 opacity-70">Tap &quot;+ List&quot; to create one</p>
          </div>
        )}
      </PageShell>
    </AnimatedPage>
  );
}
