import { redirect } from "next/navigation";
import { dashboardPath, requireUser, roleOf } from "@/lib/session";

// /dashboard sends each person to the dashboard for their role
export default async function DashboardIndex() {
  const user = await requireUser("/dashboard");
  redirect(dashboardPath(roleOf(user)));
}
