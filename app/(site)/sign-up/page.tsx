import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import SignUpForm from "@/components/auth/SignUpForm";
import { dashboardPath, getUser, roleOf } from "@/lib/session";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  const user = await getUser();
  if (user) redirect(dashboardPath(roleOf(user)));

  return (
    <AuthShell
      title={
        <>
          Create your <em className="font-normal text-gold-deep">account</em>
        </>
      }
      subtitle="It takes less than a minute. Book appointments and keep every visit in one place."
    >
      <Suspense>
        <SignUpForm />
      </Suspense>
    </AuthShell>
  );
}
