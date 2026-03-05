export function simpleInterest(principal: number, annualRate: number, years: number) {
  return principal * (annualRate / 100) * years;
}

export function compoundAmount(principal: number, annualRate: number, years: number, compoundsPerYear = 12) {
  return principal * Math.pow(1 + annualRate / 100 / compoundsPerYear, compoundsPerYear * years);
}

export function depositMaturity(principal: number, annualRate: number, months: number) {
  const interest = principal * (annualRate / 100) * (months / 12);
  return { interest, maturity: principal + interest };
}

export function installmentSavingMaturity(monthly: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12;
  let total = 0;
  for (let i = 0; i < months; i++) total += monthly * (1 + r * (months - i));
  return { maturity: total, principal: monthly * months, interest: total - monthly * months };
}

export function annuityLoanPayment(principal: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function dividendIncome(totalAsset: number, dividendYieldPct: number) {
  return (totalAsset * dividendYieldPct) / 100;
}

export function retirementTargetAsset(monthlyNeed: number, safeWithdrawalRatePct: number) {
  return (monthlyNeed * 12) / (safeWithdrawalRatePct / 100);
}
