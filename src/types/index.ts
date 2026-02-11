// ── Expense Tracker ──────────────────────────────────────────
export interface ExpenseCategory {
  id: string;
  name: string;
  emoji: string;
  color: string; // tailwind-compatible color or hex
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: string; // ISO string
}

// ── Pantry ───────────────────────────────────────────────────
export interface PantryItem {
  id: string;
  name: string;
  emoji: string;
  currentQty: number;
  maxQty: number;
  unit: string; // "units", "pack", "liters", etc.
}

// ── Shopping Lists ───────────────────────────────────────────
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  emoji: string;
  items: ShoppingItem[];
}

// ── Schedule ─────────────────────────────────────────────────
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface ScheduleEvent {
  id: string;
  title: string;
  day: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  location?: string;
  color: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string; // ISO string
  category: string;
  emoji: string;
  done: boolean;
}

// ── App Data (for export/import) ─────────────────────────────
export interface AppData {
  expenses: Expense[];
  expenseCategories: ExpenseCategory[];
  pantryItems: PantryItem[];
  shoppingLists: ShoppingList[];
  scheduleEvents: ScheduleEvent[];
  reminders: Reminder[];
}
