import { ExpenseCategory, PantryItem, ShoppingList } from "@/types";

// ── Default Expense Categories (user-editable seed data) ─────
export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: "cat-fixed",    name: "Fixed",         emoji: "🏠", color: "#6366f1" },
  { id: "cat-survival", name: "Survival",      emoji: "🛒", color: "#22c55e" },
  { id: "cat-social",   name: "Erasmus/Social", emoji: "🎉", color: "#f59e0b" },
];

// ── Default Pantry Items ─────────────────────────────────────
export const DEFAULT_PANTRY_ITEMS: PantryItem[] = [
  { id: "pantry-1",  name: "Eggs",        emoji: "🥚", currentQty: 6,  maxQty: 12, unit: "units" },
  { id: "pantry-2",  name: "Pasta",       emoji: "🍝", currentQty: 1,  maxQty: 1,  unit: "pack" },
  { id: "pantry-3",  name: "Milk",        emoji: "🥛", currentQty: 1,  maxQty: 1,  unit: "liter" },
  { id: "pantry-4",  name: "Rice",        emoji: "🍚", currentQty: 1,  maxQty: 1,  unit: "pack" },
  { id: "pantry-5",  name: "Bread",       emoji: "🍞", currentQty: 1,  maxQty: 1,  unit: "loaf" },
  { id: "pantry-6",  name: "Chicken",     emoji: "🍗", currentQty: 0,  maxQty: 1,  unit: "pack" },
  { id: "pantry-7",  name: "Tomatoes",    emoji: "🍅", currentQty: 3,  maxQty: 6,  unit: "units" },
  { id: "pantry-8",  name: "Onions",      emoji: "🧅", currentQty: 2,  maxQty: 4,  unit: "units" },
];

// ── Default Shopping Lists ───────────────────────────────────
export const DEFAULT_SHOPPING_LISTS: ShoppingList[] = [
  { id: "list-super",    name: "Supermarket",       emoji: "🛒", items: [] },
  { id: "list-pharmacy", name: "Pharmacy/Cleaning",  emoji: "🧴", items: [] },
  { id: "list-special",  name: "Special/Tech",       emoji: "📦", items: [] },
];

// ── Schedule Colors ──────────────────────────────────────────
export const EVENT_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f59e0b", "#22c55e", "#06b6d4", "#3b82f6",
];

// ── Reminder Categories ──────────────────────────────────────
export const REMINDER_CATEGORIES = [
  { label: "ID Card",    emoji: "🪪" },
  { label: "Bank",       emoji: "🏦" },
  { label: "Landlord",   emoji: "🏡" },
  { label: "University", emoji: "🎓" },
  { label: "Health",     emoji: "🏥" },
  { label: "Other",      emoji: "📌" },
];
