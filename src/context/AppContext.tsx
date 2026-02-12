"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  Expense,
  ExpenseCategory,
  PantryItem,
  ShoppingList,
  ShoppingItem,
  ScheduleEvent,
  Reminder,
  AppData,
} from "@/types";
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_PANTRY_ITEMS,
  DEFAULT_SHOPPING_LISTS,
} from "@/lib/constants";
import { generateId } from "@/lib/utils";

// ── Context Shape ────────────────────────────────────────────
interface AppContextType {
  // Expenses
  expenses: Expense[];
  addExpense: (e: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;

  // Expense Categories
  expenseCategories: ExpenseCategory[];
  addExpenseCategory: (c: Omit<ExpenseCategory, "id">) => void;
  updateExpenseCategory: (c: ExpenseCategory) => void;
  deleteExpenseCategory: (id: string) => void;

  // Pantry
  pantryItems: PantryItem[];
  addPantryItem: (item: Omit<PantryItem, "id">) => void;
  updatePantryItem: (item: PantryItem) => void;
  deletePantryItem: (id: string) => void;
  usePantryItem: (id: string, amount: number) => void;
  refillPantryItem: (id: string) => void;

  // Shopping Lists
  shoppingLists: ShoppingList[];
  addShoppingList: (list: Omit<ShoppingList, "id" | "items">) => void;
  updateShoppingList: (id: string, name: string, emoji: string) => void;
  deleteShoppingList: (id: string) => void;
  addShoppingItem: (listId: string, item: Omit<ShoppingItem, "id" | "checked">) => void;
  toggleShoppingItem: (listId: string, itemId: string) => void;
  deleteShoppingItem: (listId: string, itemId: string) => void;
  clearCheckedItems: (listId: string) => void;

  // Schedule
  scheduleEvents: ScheduleEvent[];
  addScheduleEvent: (e: Omit<ScheduleEvent, "id">) => void;
  updateScheduleEvent: (e: ScheduleEvent) => void;
  deleteScheduleEvent: (id: string) => void;

  // Reminders
  reminders: Reminder[];
  addReminder: (r: Omit<Reminder, "id" | "done">) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  // Data portability
  exportData: () => AppData;
  importData: (data: AppData) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("erasmus-expenses", []);
  const [expenseCategories, setExpenseCategories] = useLocalStorage<ExpenseCategory[]>(
    "erasmus-expense-categories",
    DEFAULT_EXPENSE_CATEGORIES
  );
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>(
    "erasmus-pantry",
    DEFAULT_PANTRY_ITEMS
  );
  const [shoppingLists, setShoppingLists] = useLocalStorage<ShoppingList[]>(
    "erasmus-shopping-lists",
    DEFAULT_SHOPPING_LISTS
  );
  const [scheduleEvents, setScheduleEvents] = useLocalStorage<ScheduleEvent[]>(
    "erasmus-schedule",
    []
  );
  const [reminders, setReminders] = useLocalStorage<Reminder[]>("erasmus-reminders", []);

  // ── Expense CRUD ─────────────────────────────────────────
  const addExpense = useCallback(
    (e: Omit<Expense, "id">) => setExpenses((prev) => [{ ...e, id: generateId() }, ...prev]),
    [setExpenses]
  );
  const deleteExpense = useCallback(
    (id: string) => setExpenses((prev) => prev.filter((e) => e.id !== id)),
    [setExpenses]
  );

  // ── Category CRUD ────────────────────────────────────────
  const addExpenseCategory = useCallback(
    (c: Omit<ExpenseCategory, "id">) =>
      setExpenseCategories((prev) => [...prev, { ...c, id: generateId() }]),
    [setExpenseCategories]
  );
  const updateExpenseCategory = useCallback(
    (c: ExpenseCategory) =>
      setExpenseCategories((prev) => prev.map((cat) => (cat.id === c.id ? c : cat))),
    [setExpenseCategories]
  );
  const deleteExpenseCategory = useCallback(
    (id: string) => setExpenseCategories((prev) => prev.filter((c) => c.id !== id)),
    [setExpenseCategories]
  );

  // ── Pantry CRUD ──────────────────────────────────────────
  const addPantryItem = useCallback(
    (item: Omit<PantryItem, "id">) =>
      setPantryItems((prev) => [...prev, { ...item, id: generateId() }]),
    [setPantryItems]
  );
  const updatePantryItem = useCallback(
    (item: PantryItem) =>
      setPantryItems((prev) => prev.map((p) => (p.id === item.id ? item : p))),
    [setPantryItems]
  );
  const deletePantryItem = useCallback(
    (id: string) => setPantryItems((prev) => prev.filter((p) => p.id !== id)),
    [setPantryItems]
  );
  const usePantryItem = useCallback(
    (id: string, amount: number) =>
      setPantryItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, currentQty: Math.max(0, p.currentQty - amount) } : p))
      ),
    [setPantryItems]
  );
  const refillPantryItem = useCallback(
    (id: string) =>
      setPantryItems((prev) => prev.map((p) => (p.id === id ? { ...p, currentQty: p.maxQty } : p))),
    [setPantryItems]
  );

  // ── Shopping List CRUD ───────────────────────────────────
  const addShoppingList = useCallback(
    (list: Omit<ShoppingList, "id" | "items">) =>
      setShoppingLists((prev) => [...prev, { ...list, id: generateId(), items: [] }]),
    [setShoppingLists]
  );
  const updateShoppingList = useCallback(
    (id: string, name: string, emoji: string) =>
      setShoppingLists((prev) => prev.map((l) => (l.id === id ? { ...l, name, emoji } : l))),
    [setShoppingLists]
  );
  const deleteShoppingList = useCallback(
    (id: string) => setShoppingLists((prev) => prev.filter((l) => l.id !== id)),
    [setShoppingLists]
  );
  const addShoppingItem = useCallback(
    (listId: string, item: Omit<ShoppingItem, "id" | "checked">) =>
      setShoppingLists((prev) =>
        prev.map((l) =>
          l.id === listId
            ? { ...l, items: [...l.items, { ...item, id: generateId(), checked: false }] }
            : l
        )
      ),
    [setShoppingLists]
  );
  const toggleShoppingItem = useCallback(
    (listId: string, itemId: string) =>
      setShoppingLists((prev) => {
        const newList = prev.map((l) =>
          l.id === listId
            ? { ...l, items: l.items.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i)) }
            : l
        );

        // SYNC LOGIC: If an item was just checked, try to refill it in the pantry
        const list = newList.find(l => l.id === listId);
        const item = list?.items.find(i => i.id === itemId);
        
        if (item?.checked) {
          setPantryItems(prevPantry => {
            const index = prevPantry.findIndex(p => p.name.toLowerCase() === item.name.toLowerCase());
            if (index !== -1) {
              const newPantry = [...prevPantry];
              newPantry[index] = { ...newPantry[index], currentQty: newPantry[index].maxQty };
              return newPantry;
            }
            return prevPantry;
          });
        }

        return newList;
      }),
    [setShoppingLists, setPantryItems]
  );
  const deleteShoppingItem = useCallback(
    (listId: string, itemId: string) =>
      setShoppingLists((prev) =>
        prev.map((l) =>
          l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l
        )
      ),
    [setShoppingLists]
  );
  const clearCheckedItems = useCallback(
    (listId: string) =>
      setShoppingLists((prev) =>
        prev.map((l) =>
          l.id === listId ? { ...l, items: l.items.filter((i) => !i.checked) } : l
        )
      ),
    [setShoppingLists]
  );

  // ── Schedule CRUD ────────────────────────────────────────
  const addScheduleEvent = useCallback(
    (e: Omit<ScheduleEvent, "id">) =>
      setScheduleEvents((prev) => [...prev, { ...e, id: generateId() }]),
    [setScheduleEvents]
  );
  const updateScheduleEvent = useCallback(
    (e: ScheduleEvent) =>
      setScheduleEvents((prev) => prev.map((ev) => (ev.id === e.id ? e : ev))),
    [setScheduleEvents]
  );
  const deleteScheduleEvent = useCallback(
    (id: string) => setScheduleEvents((prev) => prev.filter((e) => e.id !== id)),
    [setScheduleEvents]
  );

  // ── Reminders CRUD ──────────────────────────────────────
  const addReminder = useCallback(
    (r: Omit<Reminder, "id" | "done">) =>
      setReminders((prev) => [...prev, { ...r, id: generateId(), done: false }]),
    [setReminders]
  );
  const toggleReminder = useCallback(
    (id: string) =>
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))),
    [setReminders]
  );
  const deleteReminder = useCallback(
    (id: string) => setReminders((prev) => prev.filter((r) => r.id !== id)),
    [setReminders]
  );

  // ── Data Portability ────────────────────────────────────
  const exportData = useCallback(
    (): AppData => ({
      expenses,
      expenseCategories,
      pantryItems,
      shoppingLists,
      scheduleEvents,
      reminders,
    }),
    [expenses, expenseCategories, pantryItems, shoppingLists, scheduleEvents, reminders]
  );

  const importData = useCallback(
    (data: AppData) => {
      if (data.expenses) setExpenses(data.expenses);
      if (data.expenseCategories) setExpenseCategories(data.expenseCategories);
      if (data.pantryItems) setPantryItems(data.pantryItems);
      if (data.shoppingLists) setShoppingLists(data.shoppingLists);
      if (data.scheduleEvents) setScheduleEvents(data.scheduleEvents);
      if (data.reminders) setReminders(data.reminders);
    },
    [setExpenses, setExpenseCategories, setPantryItems, setShoppingLists, setScheduleEvents, setReminders]
  );

  const resetAllData = useCallback(() => {
    setExpenses([]);
    setExpenseCategories(DEFAULT_EXPENSE_CATEGORIES);
    setPantryItems(DEFAULT_PANTRY_ITEMS);
    setShoppingLists(DEFAULT_SHOPPING_LISTS);
    setScheduleEvents([]);
    setReminders([]);
  }, [setExpenses, setExpenseCategories, setPantryItems, setShoppingLists, setScheduleEvents, setReminders]);

  return (
    <AppContext.Provider
      value={{
        expenses, addExpense, deleteExpense,
        expenseCategories, addExpenseCategory, updateExpenseCategory, deleteExpenseCategory,
        pantryItems, addPantryItem, updatePantryItem, deletePantryItem, usePantryItem, refillPantryItem,
        shoppingLists, addShoppingList, updateShoppingList, deleteShoppingList,
        addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearCheckedItems,
        scheduleEvents, addScheduleEvent, updateScheduleEvent, deleteScheduleEvent,
        reminders, addReminder, toggleReminder, deleteReminder,
        exportData, importData, resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
