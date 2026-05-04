import { clsx, type ClassValue } from "clsx";

export const demoUserId = "demo-user";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

export function formatDuration(hours: number) {
  if (Number.isInteger(hours)) {
    return `${hours} ч`;
  }

  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return `${whole} ч ${minutes} мин`;
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    confirmed: "Подтверждено",
    pending: "Ожидает проверки",
    completed: "Завершено",
    cancelled: "Отменено"
  };

  return labels[status] ?? status;
}
