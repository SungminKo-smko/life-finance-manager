"use client";

export const USER_KEY = "lfm_user_id";

export function getUserId() {
  if (typeof window === "undefined") return "demo-user";
  return localStorage.getItem(USER_KEY) || "demo-user";
}

export function setUserId(userId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, userId);
}
