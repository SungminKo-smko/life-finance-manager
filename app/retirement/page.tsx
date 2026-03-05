"use client";

import { useEffect, useState } from "react";

type RetirementResponse = {
  targetRetireAge: number;
  currentAge: number;
  monthlyGap: number;
  monthlyNeed: number;
  monthlySurplus: number;
  suggestions: string[];
};

export default function RetirementPage() {
  const [data, setData] = useState<RetirementResponse | null>(null);

  useEffect(() => {
    fetch("/api/retirement/recommendation")
      .then((r) => r.json())
      .then((d) => setData(d));
  }, []);

  return (
    <main className="container">
      <h1 className="h1">은퇴 추천 리포트</h1>
      <p className="muted">현재 수입/지출/보험/저축/투자를 기준으로 목표 은퇴나이 달성 가능성을 계산합니다.</p>

      {!data ? (
        <div className="card">로딩 중...</div>
      ) : (
        <>
          <div className="grid grid-2" style={{ marginBottom: 16 }}>
            <div className="card">현재 나이: {data.currentAge}세</div>
            <div className="card">목표 은퇴 나이: {data.targetRetireAge}세</div>
            <div className="card">필요 월 준비금: {Math.round(data.monthlyNeed).toLocaleString("ko-KR")}원</div>
            <div className="card">현재 월 잉여: {Math.round(data.monthlySurplus).toLocaleString("ko-KR")}원</div>
            <div className="card">월 부족분: {Math.round(data.monthlyGap).toLocaleString("ko-KR")}원</div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>행동 추천</h3>
            <ul>
              {data.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <p className="muted">※ 본 결과는 시뮬레이션이며 투자자문이 아닙니다.</p>
          </div>
        </>
      )}
    </main>
  );
}
