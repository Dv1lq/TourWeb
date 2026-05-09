export type CurrencyCode = "RUB" | "USD" | "EUR" | "CHF" | "JPY" | "CNY" | "AED";

const RATES_TO_USD: Record<CurrencyCode, number> = {
  // Демо-курсы для локальной фильтрации в учебном проекте.
  RUB: 0.011,
  USD: 1,
  EUR: 1.08,
  CHF: 1.12,
  JPY: 0.0067,
  CNY: 0.14,
  AED: 0.27
};

const ALIASES: Record<string, CurrencyCode> = {
  RUB: "RUB",
  "₽": "RUB",
  руб: "RUB",
  USD: "USD",
  "$": "USD",
  EUR: "EUR",
  "€": "EUR",
  CHF: "CHF",
  JPY: "JPY",
  CNY: "CNY",
  AED: "AED"
};

export function normalizeCurrency(currency: string | null | undefined): CurrencyCode {
  const normalized = (currency ?? "").trim().toUpperCase();
  return ALIASES[normalized] ?? "USD";
}

export function convertMoney(amount: number, fromCurrency: string, toCurrency: string) {
  const from = normalizeCurrency(fromCurrency);
  const to = normalizeCurrency(toCurrency);
  if (!Number.isFinite(amount)) return 0;
  const usd = amount * RATES_TO_USD[from];
  return usd / RATES_TO_USD[to];
}

export function getCurrencyLabel(currency: string) {
  const code = normalizeCurrency(currency);
  const labels: Record<CurrencyCode, string> = {
    RUB: "₽",
    USD: "$",
    EUR: "€",
    CHF: "CHF",
    JPY: "¥ JPY",
    CNY: "¥ CNY",
    AED: "AED"
  };
  return labels[code];
}

export function comparePrice(tourPrice: number, tourCurrency: string, maxPrice: number, selectedCurrency: string) {
  if (!Number.isFinite(maxPrice) || maxPrice <= 0) return true;
  const convertedTourPrice = convertMoney(tourPrice, tourCurrency, selectedCurrency);
  return convertedTourPrice <= maxPrice;
}
