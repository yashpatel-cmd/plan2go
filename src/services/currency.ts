export function formatINR(amount: number): string {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }
}


// Simple converter with a default fallback rate. Prefer passing an explicit rate.
export function usdToInr(amountUsd: number, rate: number = 88.19): number {
  if (!isFinite(amountUsd)) return 0;
  if (!isFinite(rate) || rate <= 0) rate = 88.19;
  return Math.round(amountUsd * rate);
}

export function formatUsdAsInr(amountUsd: number, rate?: number): string {
  return formatINR(usdToInr(amountUsd, rate));
}





