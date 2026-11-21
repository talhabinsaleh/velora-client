const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export function formatPrice(value: number, currency = "usd") {
  if (currency.toLowerCase() !== "usd") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(value);
  }
  return money.format(value).replace(/\.00$/, "");
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr${h > 1 ? "s" : ""}`;
}

// Appointment dates are stored as midnight UTC of the chosen day, so read them in UTC
export function formatAppointmentDate(iso: string, style: "short" | "long" = "short") {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: style === "long" ? "long" : "short",
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function timeAgo(iso: string) {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const units: [number, string][] = [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24 * 7, "week"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
  ];
  for (const [size, name] of units) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function initials(name?: string | null) {
  return (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function shortId(id: string, keep = 10) {
  return id.length <= keep * 2 ? id : `${id.slice(0, keep)}…${id.slice(-6)}`;
}

// "YYYY-MM-DD" for a date shifted to the salon's time zone (UTC+6)
export function salonDateString(offsetDays = 0) {
  const d = new Date(Date.now() + 6 * 3_600_000 + offsetDays * 86_400_000);
  return d.toISOString().slice(0, 10);
}
