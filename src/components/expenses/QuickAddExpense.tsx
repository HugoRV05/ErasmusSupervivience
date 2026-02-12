"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export function QuickAddExpense() {
  const { expenseCategories, addExpense } = useAppContext();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(expenseCategories[0]?.id || "");

  const handleSubmit = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0 || !categoryId) return;

    addExpense({
      amount: num,
      description,
      categoryId,
      date: new Date().toISOString(),
    });

    try {
      const { hapticFeedback } = await import("@/lib/utils");
      hapticFeedback('success');
    } catch (e) {
      // Ignore vibration errors
    }

    setAmount("");
    setDescription("");
    setCategoryId(expenseCategories[0]?.id || "");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 active:scale-95 transition-transform">
          <Plus className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl pb-[env(safe-area-inset-bottom)] max-w-lg mx-auto">
        <SheetHeader>
          <SheetTitle>Add Expense</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Amount Input */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Amount (€)
            </label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold h-14 rounded-xl"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Description (optional)
            </label>
            <Input
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {expenseCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
                    categoryId === cat.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card/60 backdrop-blur-md text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <DynamicIcon name={cat.icon || "Tag"} size={16} />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full h-12 rounded-xl text-base font-semibold"
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Save Expense
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
