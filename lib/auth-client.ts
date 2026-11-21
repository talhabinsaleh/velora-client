import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, useSession } = authClient;

// Ends the Better Auth session and removes the API token cookie
export async function signOutEverywhere() {
  await Promise.allSettled([authClient.signOut(), fetch("/api/session-token", { method: "DELETE" })]);
}
