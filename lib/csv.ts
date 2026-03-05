import type { LoanScheduleRow } from "@/lib/calculators";

export function toCsv(rows: LoanScheduleRow[]) {
  const head = "month,payment,principalPaid,interestPaid,balance";
  const body = rows
    .map((r) => [r.month, r.payment, r.principalPaid, r.interestPaid, r.balance].join(","))
    .join("\n");
  return `${head}\n${body}`;
}
