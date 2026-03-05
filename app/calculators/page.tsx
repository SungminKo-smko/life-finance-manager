"use client";

import { useMemo, useState } from "react";
import {
  annuityLoanPayment,
  compoundAmount,
  depositMaturity,
  dividendIncome,
  installmentSavingMaturity,
  retirementTargetAsset,
  simpleInterest
} from "@/lib/calculators";

export default function CalculatorsPage() {
  const [principal, setPrincipal] = useState(10000000);
  const [rate, setRate] = useState(3.5);
  const [months, setMonths] = useState(12);

  const simple = useMemo(() => simpleInterest(principal, rate, months / 12), [principal, rate, months]);
  const compound = useMemo(() => compoundAmount(principal, rate, months / 12), [principal, rate, months]);
  const deposit = useMemo(() => depositMaturity(principal, rate, months), [principal, rate, months]);
  const saving = useMemo(() => installmentSavingMaturity(500000, rate, months), [rate, months]);
  const loanPay = useMemo(() => annuityLoanPayment(300000000, rate, 360), [rate]);
  const dividend = useMemo(() => dividendIncome(200000000, 4.2), []);
  const retire = useMemo(() => retirementTargetAsset(4000000, 4), []);

  return (
    <main className="container">
      <h1 className="h1">금융 계산기</h1>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="grid grid-2">
          <label>원금 <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} /></label>
          <label>연이율(%) <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></label>
          <label>기간(개월) <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} /></label>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">단리 이자: {simple.toLocaleString("ko-KR")}원</div>
        <div className="card">복리 만기금액: {Math.round(compound).toLocaleString("ko-KR")}원</div>
        <div className="card">예금 만기(원금+이자): {Math.round(deposit.maturity).toLocaleString("ko-KR")}원</div>
        <div className="card">적금 만기(월 50만원): {Math.round(saving.maturity).toLocaleString("ko-KR")}원</div>
        <div className="card">대출 원리금균등(3억/30년): {Math.round(loanPay).toLocaleString("ko-KR")}원/월</div>
        <div className="card">배당 연수익(2억, 4.2%): {Math.round(dividend).toLocaleString("ko-KR")}원</div>
        <div className="card">은퇴 필요자산(월400만원, SWR4%): {Math.round(retire).toLocaleString("ko-KR")}원</div>
      </div>
    </main>
  );
}
