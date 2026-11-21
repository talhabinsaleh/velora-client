import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// A fast cookie check before private pages render. The pages themselves still verify the real
// session (and role) on the server, and the API checks the JWT and role on every request.
export function proxy(request: NextRequest) {
  const target = request.nextUrl.pathname + request.nextUrl.search;
  if (!getSessionCookie(request)) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("redirect", target);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/services/:id", "/payment/:path*"],
};
