"use client";

// Lightweight client-side "auth" for the static demo (no real backend).
const KEY = "aura_demo_session";

export function demoLogin(role: "merchant" | "admin" = "merchant") {
  if (typeof window !== "undefined") localStorage.setItem(KEY, role);
}

export function demoLogout() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export function demoRole(): "merchant" | "admin" | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(KEY) as "merchant" | "admin" | null) ?? null;
}

export function isLoggedIn() {
  return demoRole() !== null;
}
