const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "short",
  year: "numeric",
});

const shortMonthFormatter = new Intl.DateTimeFormat("de-DE", {
  month: "short",
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatDate(value: Date | string): string {
  return dateFormatter.format(new Date(value));
}

export function formatMonthLabel(month: string): string {
  const [year, m] = month.split("-").map(Number);
  return monthFormatter.format(new Date(year, m - 1, 1));
}

export function formatShortMonthLabel(month: string): string {
  const [year, m] = month.split("-").map(Number);
  return shortMonthFormatter.format(new Date(year, m - 1, 1));
}

export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function dateToInputValue(value: Date | string): string {
  return new Date(value).toISOString().slice(0, 10);
}
