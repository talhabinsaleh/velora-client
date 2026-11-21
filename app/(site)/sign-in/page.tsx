import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import SignInForm from "@/components/auth/SignInForm";
import { dashboardPath, getUser, roleOf } from "@/lib/session";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignInPage() {
  const user = await getUser();
  if (user) redirect(dashboardPath(roleOf(user)));

  return (
    <AuthShell
      title={
        <>
          Welcome <em className="font-normal text-gold-deep">back</em>
        </>
      }
      subtitle="Sign in to request appointments, track their status and pay securely."
    >
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
