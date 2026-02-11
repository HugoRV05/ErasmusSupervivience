import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** Format currency */
export function formatCurrency(amount: number, currency = "€"): string {
  return `${currency}${amount.toFixed(2)}`;
}

/** Format date to readable string */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

/** Format date for grouping */
export function formatDateGroup(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

/** Get current month/year */
export function getCurrentMonthYear(): string {
  return new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/** Get stock level status */
export function getStockLevel(current: number, max: number): "ok" | "low" | "empty" {
  if (current <= 0) return "empty";
  if (current / max <= 0.2) return "low";
  return "ok";
}

/** Get today's day of the week */
export function getTodayDayOfWeek(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}
