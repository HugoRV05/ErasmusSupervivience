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
import { cn, getStockLevel, getEmojiForPantryItem } from "@/lib/utils";
import { PantryItem } from "@/types";
import { useEffect } from "react";
import { Mascot } from "@/components/ui/Mascot";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { hapticFeedback } from "@/lib/utils";

export default function PantryPage() {
  const {
    pantryItems, addPantryItem, updatePantryItem, deletePantryItem,
    usePantryItem, refillPantryItem, shoppingLists, addShoppingItem,
  } = useAppContext();
  const [mounted, setMounted] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<PantryItem | null>(null);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("Package");
  const [newMaxQty, setNewMaxQty] = useState("1");
  const [newUnit, setNewUnit] = useState("units");
  const [catSearch, setCatSearch] = useState(""); // For icon searching

  useEffect(() => setMounted(true), []);

  const handleAddItem = () => {
    if (!newName.trim()) return;
    addPantryItem({
      name: newName.trim(),
      icon: newIcon || "Package",
      currentQty: parseInt(newMaxQty) || 1,
      maxQty: parseInt(newMaxQty) || 1,
      unit: newUnit || "units",
    });
    hapticFeedback('success');
    setNewName("");
    setNewIcon("Package");
    setNewMaxQty("1");
    setNewUnit("units");
    setAddDialogOpen(false);
  };

  const handleEditItem = () => {
    if (!editItem || !newName.trim()) return;
    updatePantryItem({
      ...editItem,
      name: newName.trim(),
      icon: newIcon || "Package",
      maxQty: parseInt(newMaxQty) || 1,
      unit: newUnit || "units",
    });
    hapticFeedback('light');
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
    setNewIcon(item.icon);
    setNewMaxQty(String(item.maxQty));
    setNewUnit(item.unit);
    setAddDialogOpen(true); // Reuse the same dialog state logic or a separate one, let's use separate for clarity if needed, but UI should be same.
  };

  // Simplified dialog closer
  const closeDialog = () => {
    setAddDialogOpen(false);
    setEditItem(null);
    setNewName("");
    setNewIcon("Package");
    setNewMaxQty("1");
    setNewUnit("units");
  };

  const handleAction = () => {
    if (editItem) handleEditItem();
    else handleAddItem();
  };

  if (!mounted) return null;

  return (
    <AnimatedPage>
      <PageShell
        title="Pantry"
        subtitle={`${pantryItems.length} items`}
        action={
          <Dialog open={addDialogOpen || !!editItem} onOpenChange={(open) => !open && closeDialog()}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="rounded-xl gap-1.5 border-primary/20 hover:bg-primary/5">
                <Plus className="h-4 w-4 text-primary" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl max-w-sm p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {editItem ? "Edit Item" : "New Pantry Item"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-12 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0 border border-border/50">
                      <DynamicIcon name={newIcon || "Package"} size={22} className="text-primary/60" />
                    </div>
                    <Input
                      placeholder="Item name (e.g. Eggs)"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="rounded-xl h-12 flex-1 font-medium"
                    />
                  </div>
                  
                  <Input
                    placeholder="Icon name (Package, Apple, etc.)"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="rounded-xl h-10 text-xs text-muted-foreground"
                  />
                  
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1.5 ml-1 block">Max Quantity</label>
                      <Input
                        type="number"
                        value={newMaxQty}
                        onChange={(e) => setNewMaxQty(e.target.value)}
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1.5 ml-1 block">Unit</label>
                      <Input
                        placeholder="L, Kg, Units..."
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleAction} 
                  className="w-full h-12 rounded-2xl font-bold shadow-lg shadow-primary/20" 
                  disabled={!newName.trim()}
                >
                  {editItem ? "Save Changes" : "Add to Pantry"}
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
                  "rounded-2xl border p-4 transition-all glass active:scale-[0.98] shadow-sm",
                  stock === "empty" && "border-destructive/30 bg-destructive/5",
                  stock === "low" && "border-yellow-500/30 bg-yellow-500/5",
                  stock === "ok" && "border-border/50 bg-card/60 backdrop-blur-md"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center relative">
                    <DynamicIcon name={item.icon || "Package"} className="text-foreground/40" size={20} />
                    <span className="absolute text-xl">{getEmojiForPantryItem(item.name)}</span>
                  </div>
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

                <div className="h-10 mt-auto pt-3">
                  {stock !== "ok" && (
                    <button
                      onClick={() => {
                        addToPrimaryList(item.name);
                        hapticFeedback('medium');
                      }}
                      className={cn(
                        "w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold transition-all shadow-sm",
                        stock === "empty" 
                          ? "bg-destructive text-destructive-foreground" 
                          : "bg-yellow-500 text-white"
                      )}
                    >
                      <ShoppingCart className="h-3 w-3" /> 
                      {stock === "empty" ? "RESTOCK NOW" : "BUY SOON"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {pantryItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
            <Mascot size={180} pose="pantry-empty" />
            <p className="text-sm mt-4 font-medium">Your pantry is empty</p>
            <p className="text-xs mt-1 opacity-70">Tap &quot;Add&quot; to start tracking items</p>
          </div>
        )}


      </PageShell>
    </AnimatedPage>
  );
}
