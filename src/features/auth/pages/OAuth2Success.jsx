import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

/**
 * OAuth2Success
 *
 * Fix: replaced hardcoded Tailwind classes `bg-white`, `bg-slate-50`,
 * `text-slate-900`, `text-slate-500`, `border-slate-200` with CSS variable
 * equivalents so this page respects the active theme (dark/light) and never
 * flashes a white background.
 */
function OAuth2Success() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(PATHS.HOME);
  }, [navigate]);

  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Login successful
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Redirecting you to the home page...
        </p>
      </div>
    </div>
  );
}

export default OAuth2Success;
