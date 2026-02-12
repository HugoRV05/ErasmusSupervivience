"use client";

import { useAppContext } from "@/context/AppContext";
import { PageShell } from "@/components/layout/PageShell";
import { AnimatedPage } from "@/components/layout/AnimatedPage";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickAddExpense } from "@/components/expenses/QuickAddExpense";
import { DonutChart } from "@/components/expenses/DonutChart";
import { formatCurrency, formatDateGroup, getCurrentMonthYear } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/ui/Mascot";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export default function ExpensesPage() {
  const { expenses, expenseCategories, deleteExpense } = useAppContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Current month expenses
  const now = new Date();
  const monthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category for chart
  const chartData = expenseCategories.map((cat) => ({
    name: cat.name,
    icon: cat.icon,
    value: monthExpenses
      .filter((e) => e.categoryId === cat.id)
      .reduce((sum, e) => sum + e.amount, 0),
    color: cat.color,
  })).filter((d) => d.value > 0);

  // Group expenses by date
  const grouped = monthExpenses.reduce<Record<string, typeof expenses>>((acc, exp) => {
    const key = formatDateGroup(exp.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(exp);
    return acc;
  }, {});

  const getCategoryById = (id: string) =>
    expenseCategories.find((c) => c.id === id);

  if (!mounted) return null;

  return (
    <AnimatedPage>
      <PageShell 
        title="Expenses" 
        subtitle={getCurrentMonthYear()}
        action={
          <Button size="sm" variant="outline" className="rounded-xl gap-1.5" onClick={() => (document.querySelector('[data-state="closed"] button') as HTMLButtonElement)?.click()}>
            <Plus className="h-4 w-4" /> Expense
          </Button>
        }
      >
        {/* Total + Chart */}
        <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 p-5 mb-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Total this month</p>
          <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalSpent)}</p>

          {chartData.length > 0 && (
            <div className="mt-4">
              <DonutChart data={chartData} />
            </div>
          )}
        </div>

        {/* Expense List */}
        {Object.entries(grouped).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
            <Mascot size={180} pose="expenses" />
            <p className="text-sm mt-4 font-medium">No expenses yet this month</p>
            <p className="text-xs mt-1 opacity-70">Tap + to add your first expense</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {date}
              </h3>
              <div className="space-y-2">
                {items.map((exp) => {
                  const cat = getCategoryById(exp.categoryId);
                  return (
                    <div
                      key={exp.id}
                      className="flex items-center gap-4 rounded-xl bg-card/60 backdrop-blur-md border border-border/50 p-4 group shadow-sm active:scale-[0.98] transition-all"
                    >
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat?.color}20`, color: cat?.color }}>
                        <DynamicIcon name={cat?.icon || "FileText"} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {exp.description || cat?.name || "Expense"}
                        </p>
                        <p className="text-xs text-muted-foreground">{cat?.name}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(exp.amount)}</p>
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        <QuickAddExpense />
      </PageShell>
    </AnimatedPage>
  );
}
