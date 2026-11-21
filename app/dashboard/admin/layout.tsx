import { AccessDenied } from "@/components/dashboard/AccessScreens";
import { dashboardPath, requireUser, roleOf } from "@/lib/session";

// Only admins may open these pages. The API checks the role again on every request.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("/dashboard/admin");
  const role = roleOf(user);
  if (role !== "admin") return <AccessDenied home={dashboardPath(role)} />;
  return children;
}
