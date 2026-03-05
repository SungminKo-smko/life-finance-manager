"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setUserId } from "@/lib/client-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = email.trim().toLowerCase() || "demo-user";
    setUserId(userId);
    router.push("/");
  };

  return (
    <main className="container">
      <h1 className="h1">간편 로그인</h1>
      <p className="muted">MVP용 사용자 분리 로그인입니다. 이메일 기반으로 사용자 데이터가 분리됩니다.</p>
      <form className="card" onSubmit={submit}>
        <label>이메일
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>
        <div style={{ marginTop: 12 }}>
          <button>로그인</button>
        </div>
      </form>
    </main>
  );
}
