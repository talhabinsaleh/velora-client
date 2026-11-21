import type { Metadata } from "next";
import { BlockedScreen } from "@/components/dashboard/AccessScreens";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireUser, roleOf } from "@/lib/session";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s · Velora Dashboard" } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/dashboard");
  if (user.isBlocked) return <BlockedScreen />;
  return (
    <DashboardShell user={{ name: user.name, email: user.email, image: user.image, role: roleOf(user) }}>{children}</DashboardShell>
  );
}
