import { StatSkeletons, TableSkeleton } from "@/components/dashboard/ui";

export default function DashboardLoading() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading dashboard">
      <div className="skeleton h-10 w-64" />
      <StatSkeletons count={4} />
      <TableSkeleton rows={5} cols={6} />
    </div>
  );
}
