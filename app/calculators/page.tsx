"use client";

import { useMemo, useState } from "react";
import {
  compoundAmount,
  depositMaturity,
  dividendIncome,
  installmentSavingMaturity,
  loanSchedule,
  retirementTargetAsset,
  simpleInterest,
  type LoanMethod
} from "@/lib/calculators";

export default function CalculatorsPage() {
  const [principal, setPrincipal] = useState(10000000);
  const [rate, setRate] = useState(3.5);
  const [months, setMonths] = useState(12);
  const [loanPrincipal, setLoanPrincipal] = useState(300000000);
  const [loanMonths, setLoanMonths] = useState(360);
  const [loanMethod, setLoanMethod] = useState<LoanMethod>("ANNUITY");

  const simple = useMemo(() => simpleInterest(principal, rate, months / 12), [principal, rate, months]);
  const compound = useMemo(() => compoundAmount(principal, rate, months / 12), [principal, rate, months]);
  const deposit = useMemo(() => depositMaturity(principal, rate, months), [principal, rate, months]);
  const saving = useMemo(() => installmentSavingMaturity(500000, rate, months), [rate, months]);
  const schedule = useMemo(() => loanSchedule(loanPrincipal, rate, loanMonths, loanMethod), [loanPrincipal, rate, loanMonths, loanMethod]);
  const schedulePreview = schedule.slice(0, 12);
  const totalInterest = schedule.reduce((acc, row) => acc + row.interestPaid, 0);
  const dividend = useMemo(() => dividendIncome(200000000, 4.2), []);
  const retire = useMemo(() => retirementTargetAsset(4000000, 4), []);

  return (
    <main className="container">
      <h1 className="h1">금융 계산기</h1>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>단리/복리/예적금</h3>
        <div className="grid grid-2">
          <label>원금 <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} /></label>
          <label>연이율(%) <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></label>
          <label>기간(개월) <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} /></label>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <div className="card">단리 이자: {simple.toLocaleString("ko-KR")}원</div>
        <div className="card">복리 만기금액: {Math.round(compound).toLocaleString("ko-KR")}원</div>
        <div className="card">예금 만기(원금+이자): {Math.round(deposit.maturity).toLocaleString("ko-KR")}원</div>
        <div className="card">적금 만기(월 50만원): {Math.round(saving.maturity).toLocaleString("ko-KR")}원</div>
        <div className="card">배당 연수익(2억, 4.2%): {Math.round(dividend).toLocaleString("ko-KR")}원</div>
        <div className="card">은퇴 필요자산(월400만원, SWR4%): {Math.round(retire).toLocaleString("ko-KR")}원</div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>대출 계산기 (3방식)</h3>
        <div className="grid grid-2">
          <label>대출원금 <input type="number" value={loanPrincipal} onChange={(e) => setLoanPrincipal(Number(e.target.value))} /></label>
          <label>연이율(%) <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></label>
          <label>기간(개월) <input type="number" value={loanMonths} onChange={(e) => setLoanMonths(Number(e.target.value))} /></label>
          <label>
            상환방식
            <select value={loanMethod} onChange={(e) => setLoanMethod(e.target.value as LoanMethod)}>
              <option value="ANNUITY">원리금균등상환</option>
              <option value="EQUAL_PRINCIPAL">원금균등상환</option>
              <option value="BULLET">원금만기일시상환</option>
            </select>
          </label>
        </div>

        <div className="grid grid-2" style={{ marginTop: 12 }}>
          <div className="card">총 이자: {Math.round(totalInterest).toLocaleString("ko-KR")}원</div>
          <div className="card">첫달 납입액: {Math.round(schedule[0]?.payment ?? 0).toLocaleString("ko-KR")}원</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>상환 스케줄 미리보기 (1~12회차)</h3>
        <table className="table">
          <thead>
            <tr>
              <th>회차</th>
              <th>납입액</th>
              <th>원금</th>
              <th>이자</th>
              <th>잔액</th>
            </tr>
          </thead>
          <tbody>
            {schedulePreview.map((r) => (
              <tr key={r.month}>
                <td>{r.month}</td>
                <td>{Math.round(r.payment).toLocaleString("ko-KR")}</td>
                <td>{Math.round(r.principalPaid).toLocaleString("ko-KR")}</td>
                <td>{Math.round(r.interestPaid).toLocaleString("ko-KR")}</td>
                <td>{Math.round(r.balance).toLocaleString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
