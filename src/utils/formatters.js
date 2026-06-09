// ─── Display formatters ───────────────────────────────────────────────────────
// Converts raw backend values into human-readable display strings.

import { ORDER_STATUS_LABELS } from "./constants";

// ── Date & time ───────────────────────────────────────────────────────────────

/**
 * Formats an ISO date string to a readable date.
 * formatDate("2025-06-09T14:30:00Z") → "9 Jun 2025"
 */
export function formatDate(isoString) {
  if (!isoString) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoString));
}

/**
 * Formats an ISO date string to date + time.
 * formatDateTime("2025-06-09T14:30:00Z") → "9 Jun 2025, 8:00 pm"
 */
export function formatDateTime(isoString) {
  if (!isoString) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(isoString));
}

/**
 * Returns a relative time string.
 * formatRelativeTime("2025-06-08T14:30:00Z") → "1 day ago"
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return "—";

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMs = new Date(isoString).getTime() - Date.now();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffSecs) < 60) return rtf.format(diffSecs, "second");
  if (Math.abs(diffMins) < 60) return rtf.format(diffMins, "minute");
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  return rtf.format(diffDays, "day");
}

// ── User / Auth ───────────────────────────────────────────────────────────────

/**
 * Returns "firstName lastName" or falls back gracefully.
 * formatFullName({ firstName: "Raj", lastName: "Das" }) → "Raj Das"
 */
export function formatFullName(user) {
  if (!user) return "Guest";
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : user.email ?? "User";
}

/**
 * Returns user initials for avatars.
 * formatInitials({ firstName: "Raj", lastName: "Das" }) → "RD"
 */
export function formatInitials(user) {
  if (!user) return "?";
  const first = user.firstName?.[0]?.toUpperCase() ?? "";
  const last = user.lastName?.[0]?.toUpperCase() ?? "";
  return first + last || user.email?.[0]?.toUpperCase() || "?";
}

// ── Orders ────────────────────────────────────────────────────────────────────

/**
 * Returns the display label for an order status.
 * formatOrderStatus("PENDING") → "Pending"
 */
export function formatOrderStatus(status) {
  return ORDER_STATUS_LABELS[status] ?? status ?? "—";
}

/**
 * Formats a full address object into a single line string.
 * formatAddress({ line1: "12 MG Road", city: "Kolkata", state: "WB", zip: "700001", country: "India" })
 * → "12 MG Road, Kolkata, WB 700001, India"
 */
export function formatAddress(address) {
  if (!address) return "—";
  const parts = [
    address.line1,
    address.city,
    address.state && address.zip ? `${address.state} ${address.zip}` : address.state || address.zip,
    address.country,
  ].filter(Boolean);
  return parts.join(", ");
}

// ── Products ──────────────────────────────────────────────────────────────────

/**
 * Truncates a long product name for list/card views.
 * truncateName("Very Long Product Name That Goes On", 20) → "Very Long Product Nam…"
 */
export function truncateName(text, maxLength = 40) {
  if (!text) return "";
  return text.length <= maxLength ? text : text.slice(0, maxLength).trimEnd() + "…";
}

// ── Reviews ───────────────────────────────────────────────────────────────────

/**
 * Converts a numeric rating into a star string for non-icon fallback.
 * formatStars(4) → "★★★★☆"
 */
export function formatStars(rating) {
  const filled = Math.round(Number(rating) || 0);
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}