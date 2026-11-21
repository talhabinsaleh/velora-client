"use client";

import { use } from "react";
import ServiceForm from "@/components/dashboard/ServiceForm";
import { EmptyState, ErrorState, Spinner } from "@/components/States";
import { useApi } from "@/lib/use-api";
import type { Service } from "@/lib/types";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, error, loading, reload } = useApi<Service>(`/api/admin/services/${encodeURIComponent(id)}`);

  if (loading && !data) return <Spinner label="Loading service…" />;
  if (error) {
    return error.toLowerCase().includes("not found") || error.toLowerCase().includes("invalid") ? (
      <EmptyState title="Service not found" message={error} action={{ href: "/dashboard/admin/services", label: "Back to services" }} />
    ) : (
      <ErrorState message={error} onRetry={reload} />
    );
  }
  return data ? <ServiceForm key={data._id} service={data} /> : null;
}
