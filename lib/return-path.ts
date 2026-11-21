// Only same-site paths are allowed after sign in, so a link can't send people to another website
export function safeRedirect(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  if (value.startsWith("/sign-in") || value.startsWith("/sign-up") || value.startsWith("/api")) return null;
  return value;
}

// Where to go after signing in: the page the user was trying to open, unless it belongs to the
// other role's dashboard, otherwise their own dashboard
export function landingFor(role: string | null | undefined, redirect: string | null | undefined) {
  const own = role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
  const target = safeRedirect(redirect);
  if (!target) return own;
  if (target.startsWith("/dashboard/admin") && role !== "admin") return own;
  if (target.startsWith("/dashboard/customer") && role === "admin") return own;
  return target;
}
