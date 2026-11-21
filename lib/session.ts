import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "./auth";
import type { Role } from "./types";

export const getSession = cache(async () => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
});

export async function getUser() {
  return (await getSession())?.user ?? null;
}

export function roleOf(user: { role?: string | null } | null | undefined): Role {
  return user?.role === "admin" ? "admin" : "customer";
}

// For private pages: sends visitors without a session to Sign In, then back here afterwards
export async function requireUser(returnTo: string) {
  const user = await getUser();
  if (!user) redirect(`/sign-in?redirect=${encodeURIComponent(returnTo)}`);
  return user;
}

export function dashboardPath(role: Role) {
  return role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
}
