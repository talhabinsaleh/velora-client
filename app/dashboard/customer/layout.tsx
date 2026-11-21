import { AccessDenied } from "@/components/dashboard/AccessScreens";
import { dashboardPath, requireUser, roleOf } from "@/lib/session";

// Only customers may open these pages. The API checks the role again on every request.
export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/dashboard/customer");
  const role = roleOf(user);
  if (role !== "customer") return <AccessDenied home={dashboardPath(role)} />;
  return children;
}
