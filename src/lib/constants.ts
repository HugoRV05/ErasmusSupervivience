import { ExpenseCategory, PantryItem, ShoppingList } from "@/types";

// ── Default Expense Categories (user-editable seed data) ─────
export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: "cat-fixed",    name: "Fixed",         icon: "Home", color: "#6366f1" },
  { id: "cat-survival", name: "Survival",      icon: "ShoppingCart", color: "#22c55e" },
  { id: "cat-social",   name: "Erasmus/Social", icon: "PartyPopper", color: "#f59e0b" },
];

// ── Default Pantry Items ─────────────────────────────────────
export const DEFAULT_PANTRY_ITEMS: PantryItem[] = [
  { id: "pantry-1",  name: "Eggs",        icon: "Circle", currentQty: 6,  maxQty: 12, unit: "units" },
  { id: "pantry-2",  name: "Pasta",       icon: "Utensils", currentQty: 1,  maxQty: 1,  unit: "pack" },
  { id: "pantry-3",  name: "Milk",        icon: "GlassWater", currentQty: 1,  maxQty: 1,  unit: "liter" },
  { id: "pantry-4",  name: "Rice",        icon: "Wheat", currentQty: 1,  maxQty: 1,  unit: "pack" },
  { id: "pantry-5",  name: "Bread",       icon: "Loaf", currentQty: 1,  maxQty: 1,  unit: "loaf" },
  { id: "pantry-6",  name: "Chicken",     icon: "Beef", currentQty: 0,  maxQty: 1,  unit: "pack" },
  { id: "pantry-7",  name: "Tomatoes",    icon: "Cherry", currentQty: 3,  maxQty: 6,  unit: "units" },
  { id: "pantry-8",  name: "Onions",      icon: "Apple", currentQty: 2,  maxQty: 4,  unit: "units" },
];

// ── Default Shopping Lists ───────────────────────────────────
export const DEFAULT_SHOPPING_LISTS: ShoppingList[] = [
  { id: "list-super",    name: "Supermarket",       icon: "ShoppingCart", items: [] },
  { id: "list-pharmacy", name: "Pharmacy/Cleaning",  icon: "Ambulance", items: [] },
  { id: "list-special",  name: "Special/Tech",       icon: "Package", items: [] },
];

// ── Schedule Colors ──────────────────────────────────────────
export const EVENT_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f59e0b", "#22c55e", "#06b6d4", "#3b82f6",
];

// ── Reminder Categories ──────────────────────────────────────
export const REMINDER_CATEGORIES = [
  { label: "ID Card",    icon: "FileText" },
  { label: "Bank",       icon: "Landmark" },
  { label: "Landlord",   icon: "Home" },
  { label: "University", icon: "GraduationCap" },
  { label: "Health",     icon: "HeartPulse" },
  { label: "Other",      icon: "Pin" },
];
