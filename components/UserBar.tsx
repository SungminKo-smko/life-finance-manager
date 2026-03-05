"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserId } from "@/lib/client-auth";

export function UserBar() {
  const [userId, setUser] = useState("demo-user");
  useEffect(() => setUser(getUserId()), []);

  return (
    <div className="card" style={{ marginBottom: 12, display: "flex", justifyContent: "space-between" }}>
      <div>현재 사용자: <b>{userId}</b></div>
      <Link href="/login">사용자 변경</Link>
    </div>
  );
}
