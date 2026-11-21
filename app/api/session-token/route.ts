import { SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth, BLOCKED_MESSAGE } from "@/lib/auth";

const COOKIE = "velora_token";
const MAX_AGE = 60 * 60 * 24 * 7;

// Turns a valid Better Auth session into the signed JWT that the Express API verifies.
// The token lives in an HTTP-only cookie, so page scripts can never read it.
export async function POST() {
  const store = await cookies();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    store.delete(COOKIE);
    return NextResponse.json({ message: "Unauthorized: please sign in first." }, { status: 401 });
  }
  if (session.user.isBlocked) {
    store.delete(COOKIE);
    return NextResponse.json({ message: BLOCKED_MESSAGE }, { status: 403 });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "The server is missing its JWT secret." }, { status: 500 });
  }

  const token = await new SignJWT({ email: session.user.email, role: session.user.role ?? "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("velora")
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(new TextEncoder().encode(secret));

  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return NextResponse.json({ ok: true, role: session.user.role ?? "customer" });
}

export async function DELETE() {
  (await cookies()).delete(COOKIE);
  return NextResponse.json({ ok: true });
}
