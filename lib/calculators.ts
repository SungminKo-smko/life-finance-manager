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

export type LoanMethod = "ANNUITY" | "EQUAL_PRINCIPAL" | "BULLET";

export type LoanScheduleRow = {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
};

export function loanSchedule(
  principal: number,
  annualRate: number,
  months: number,
  method: LoanMethod
): LoanScheduleRow[] {
  const r = annualRate / 100 / 12;
  const rows: LoanScheduleRow[] = [];
  let balance = principal;

  if (method === "ANNUITY") {
    const pay = annuityLoanPayment(principal, annualRate, months);
    for (let m = 1; m <= months; m++) {
      const interest = balance * r;
      const principalPaid = Math.min(pay - interest, balance);
      balance = Math.max(balance - principalPaid, 0);
      rows.push({ month: m, payment: pay, principalPaid, interestPaid: interest, balance });
    }
    return rows;
  }

  if (method === "EQUAL_PRINCIPAL") {
    const principalFixed = principal / months;
    for (let m = 1; m <= months; m++) {
      const interest = balance * r;
      const principalPaid = Math.min(principalFixed, balance);
      const payment = principalPaid + interest;
      balance = Math.max(balance - principalPaid, 0);
      rows.push({ month: m, payment, principalPaid, interestPaid: interest, balance });
    }
    return rows;
  }

  // BULLET: interest only, principal at maturity
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const principalPaid = m === months ? balance : 0;
    const payment = interest + principalPaid;
    balance = Math.max(balance - principalPaid, 0);
    rows.push({ month: m, payment, principalPaid, interestPaid: interest, balance });
  }

  return rows;
}

export function dividendIncome(totalAsset: number, dividendYieldPct: number) {
  return (totalAsset * dividendYieldPct) / 100;
}

export function retirementTargetAsset(monthlyNeed: number, safeWithdrawalRatePct: number) {
  return (monthlyNeed * 12) / (safeWithdrawalRatePct / 100);
}
