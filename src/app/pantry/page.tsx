"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { PageShell } from "@/components/layout/PageShell";
import { AnimatedPage } from "@/components/layout/AnimatedPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Minus, RotateCcw, ShoppingCart, Trash2, Edit2 } from "lucide-react";
import { cn, getStockLevel } from "@/lib/utils";
import { PantryItem } from "@/types";
import { useEffect } from "react";
import { Mascot } from "@/components/ui/Mascot";

export default function PantryPage() {
  const {
    pantryItems, addPantryItem, updatePantryItem, deletePantryItem,
    usePantryItem, refillPantryItem, shoppingLists, addShoppingItem,
  } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<PantryItem | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("📦");
  const [newMaxQty, setNewMaxQty] = useState("1");
  const [newUnit, setNewUnit] = useState("units");

  useEffect(() => setMounted(true), []);

  const handleAddItem = () => {
    if (!newName.trim()) return;
    addPantryItem({
      name: newName.trim(),
      emoji: newEmoji || "📦",
      currentQty: parseInt(newMaxQty) || 1,
      maxQty: parseInt(newMaxQty) || 1,
      unit: newUnit || "units",
    });
    setNewName("");
    setNewEmoji("📦");
    setNewMaxQty("1");
    setNewUnit("units");
    setAddDialogOpen(false);
  };

  const handleEditItem = () => {
    if (!editItem || !newName.trim()) return;
    updatePantryItem({
      ...editItem,
      name: newName.trim(),
      emoji: newEmoji || "📦",
      maxQty: parseInt(newMaxQty) || 1,
      unit: newUnit || "units",
    });
    setEditItem(null);
  };

  const addToPrimaryList = (itemName: string) => {
    const primary = shoppingLists[0];
    if (primary) {
      addShoppingItem(primary.id, { name: itemName, quantity: "1" });
    }
  };

  const openEdit = (item: PantryItem) => {
    setEditItem(item);
    setNewName(item.name);
    setNewEmoji(item.emoji);
    setNewMaxQty(String(item.maxQty));
    setNewUnit(item.unit);
  };

  if (!mounted) return null;

  return (
    <AnimatedPage>
      <PageShell
        title="Pantry"
        subtitle={`${pantryItems.length} items`}
        action={
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl gap-1.5">
                <Plus className="h-4 w-4" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl max-w-sm">
              <DialogHeader>
                <DialogTitle>New Pantry Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="flex gap-3">
                  <Input
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="w-16 text-center text-xl rounded-xl"
                    maxLength={4}
                  />
                  <Input
                    placeholder="Item name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="rounded-xl flex-1"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Max Qty</label>
                    <Input
                      type="number"
                      value={newMaxQty}
                      onChange={(e) => setNewMaxQty(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Unit</label>
                    <Input
                      placeholder="units"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <Button onClick={handleAddItem} className="w-full rounded-xl" disabled={!newName.trim()}>
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          {pantryItems.map((item) => {
            const stock = getStockLevel(item.currentQty, item.maxQty);
            const pct = item.maxQty > 0 ? (item.currentQty / item.maxQty) * 100 : 0;

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-2xl border p-4 transition-colors",
                  stock === "empty" && "border-destructive/50 bg-destructive/5",
                  stock === "low" && "border-yellow-500/50 bg-yellow-500/5",
                  stock === "ok" && "border-border/50 bg-card"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deletePantryItem(item.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {item.currentQty}/{item.maxQty} {item.unit}
                </p>

                <Progress
                  value={pct}
                  className={cn(
                    "h-1.5 mb-3",
                    stock === "empty" && "[&>div]:bg-destructive",
                    stock === "low" && "[&>div]:bg-yellow-500"
                  )}
                />

                <div className="flex gap-1.5">
                  <button
                    onClick={() => usePantryItem(item.id, 1)}
                    className="flex-1 flex items-center justify-center gap-0.5 py-1.5 rounded-lg bg-secondary text-xs font-medium hover:bg-secondary/80 transition"
                  >
                    <Minus className="h-3 w-3" /> 1
                  </button>
                  <button
                    onClick={() => usePantryItem(item.id, item.maxQty * 0.25)}
                    className="flex-1 flex items-center justify-center py-1.5 rounded-lg bg-secondary text-xs font-medium hover:bg-secondary/80 transition"
                  >
                    ¼
                  </button>
                  <button
                    onClick={() => refillPantryItem(item.id)}
                    className="flex items-center justify-center p-1.5 rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80 transition"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>
                </div>

                {stock === "empty" && (
                  <button
                    onClick={() => addToPrimaryList(item.name)}
                    className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition"
                  >
                    <ShoppingCart className="h-3 w-3" /> Add to list
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {pantryItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
            <Mascot size={180} pose="sad" />
            <p className="text-sm mt-4 font-medium">Your pantry is empty</p>
            <p className="text-xs mt-1 opacity-70">Tap &quot;Add&quot; to start tracking items</p>
          </div>
        )}

        {/* Edit Sheet */}
        <Sheet open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <SheetContent side="bottom" className="rounded-t-3xl pb-[env(safe-area-inset-bottom)] max-w-lg mx-auto">
            <SheetHeader>
              <SheetTitle>Edit Item</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="flex gap-3">
                <Input
                  value={newEmoji}
                  onChange={(e) => setNewEmoji(e.target.value)}
                  className="w-16 text-center text-xl rounded-xl"
                  maxLength={4}
                />
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rounded-xl flex-1"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Max Qty</label>
                  <Input
                    type="number"
                    value={newMaxQty}
                    onChange={(e) => setNewMaxQty(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Unit</label>
                  <Input
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Button onClick={handleEditItem} className="w-full rounded-xl">
                Save Changes
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </PageShell>
    </AnimatedPage>
  );
}
