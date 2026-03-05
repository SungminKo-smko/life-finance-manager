"use client";

import { useState } from "react";

export function InsuranceForm() {
  const [form, setForm] = useState({
    insurer: "",
    productName: "",
    insuranceType: "INDEMNITY",
    purpose: "PROTECTION",
    monthlyPremium: "",
    startDate: "",
    endDate: ""
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/insurance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        monthlyPremium: Number(form.monthlyPremium)
      })
    });
    alert("보험이 등록되었습니다. 새로고침하면 목록에 표시됩니다.");
  };

  return (
    <form className="card" onSubmit={submit}>
      <h3 style={{ marginTop: 0 }}>보험 등록</h3>
      <div className="grid grid-2">
        <input placeholder="보험사" value={form.insurer} onChange={(e) => setForm({ ...form, insurer: e.target.value })} required />
        <input placeholder="상품명" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required />
        <select value={form.insuranceType} onChange={(e) => setForm({ ...form, insuranceType: e.target.value })}>
          <option value="INDEMNITY">실손</option><option value="CANCER">암</option><option value="HEALTH">건강</option><option value="TERM_LIFE">정기</option><option value="WHOLE_LIFE">종신</option><option value="ANNUITY">연금</option>
        </select>
        <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}>
          <option value="PROTECTION">보장성</option><option value="SAVING">저축성</option>
        </select>
        <input placeholder="월 보험료" type="number" value={form.monthlyPremium} onChange={(e) => setForm({ ...form, monthlyPremium: e.target.value })} required />
        <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
        <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
      </div>
      <button style={{ marginTop: 12 }}>등록</button>
    </form>
  );
}
