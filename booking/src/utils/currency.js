export const formatCurrency = (amount, currency = "ETB", locale = "en-ET") =>
  new Intl.NumberFormat(locale, { style:"currency", currency }).format(amount);

export const formatCompact = (amount) =>
  amount >= 1000000 ? `Br ${(amount/1000000).toFixed(1)}M`
  : amount >= 1000  ? `Br ${(amount/1000).toFixed(0)}k`
  : `Br ${amount}`;
