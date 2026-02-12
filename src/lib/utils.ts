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
  const ratio = current / max;
  if (ratio <= 0.25) return "low";
  return "ok";
}

/** Get today's day of the week */
export function getTodayDayOfWeek(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

/**
 * Simple haptic feedback using navigator.vibrate
 * @param type 'light' | 'medium' | 'heavy' | 'success' | 'error'
 */
export const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 40,
      success: [10, 50, 10],
      error: [50, 50, 50],
    };
    const pattern = patterns[type];
    navigator.vibrate(pattern);
  }
};

export const getEmojiForPantryItem = (name: string): string => {
  const lower = name.toLowerCase();
  const map: Record<string, string> = {
    // Proteins
    huevo: "🥚", huevos: "🥚", tortilla: "🍳",
    leche: "🥛", yogurt: "🍦", yogur: "🍦", queso: "🧀",
    carne: "🥩", pollo: "🍗", pescado: "🐟", chulet: "🥩",
    tofu: "🧊", jamon: "🥓", salchicha: "🌭", bacon: "🥓",
    pavo: "🦃", atun: "🐟", gamba: "🍤", salmon: "🐟",
    // Vegetables
    tomate: "🍅", patata: "🥔", patatas: "🥔", cebolla: "🧅", ajo: "🧄",
    lechuga: "🥬", zanahoria: "🥕", brocoli: "🥦", pepino: "🥒",
    pimiento: "🫑", maiz: "🌽", seta: "🍄", champi: "🍄",
    calabacin: "🥒", berenjena: "🍆", aguacate: "🥑",
    // Fruits
    manzana: "🍎", platano: "🍌", naranja: "🍊", uva: "🍇", fresa: "🍓",
    limon: "🍋", pera: "🍐", piña: "🍍", sandia: "🍉", melon: "🍈",
    cereza: "🍒", melocoton: "🍑", kiwi: "🥝",
    // Carbs
    pan: "🍞", pasta: "🍝", arroz: "🍚", cereales: "🥣", galleta: "🍪",
    pizza: "🍕", burger: "🍔", hamburguesa: "🍔", taco: "🌮",
    // Drinks/Other
    agua: "💧", cafe: "☕", te: "🍵", cerveza: "🍺", vino: "🍷",
    aceite: "🛢️", sal: "🧂", azucar: "🍬", chocolate: "🍫",
    mermelada: "🍯", miel: "🍯", mantequilla: "🧈",
    leche_avena: "🥛", leche_soja: "🥛",
  };

  const entry = Object.keys(map).find(key => lower.includes(key));
  return entry ? map[entry] : "📦";
};
