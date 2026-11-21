import "server-only";
import type { CategorySummary, PublicReview, Service, ServiceDetails } from "./types";

const API_URL = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");

// Server components call Express directly. These are public endpoints only.
async function get<T>(path: string): Promise<{ data: T | null; status: number }> {
  try {
    const res = await fetch(`${API_URL}/api${path}`, { cache: "no-store" });
    if (!res.ok) return { data: null, status: res.status };
    return { data: (await res.json()) as T, status: res.status };
  } catch {
    return { data: null, status: 0 };
  }
}

export async function getFeaturedServices() {
  return get<Service[]>("/services/featured");
}

export async function getCategorySummaries() {
  return get<CategorySummary[]>("/services/categories");
}

export async function getServiceDetails(id: string) {
  return get<ServiceDetails>(`/services/${encodeURIComponent(id)}`);
}

export async function getFeaturedReviews() {
  return get<{ reviews: PublicReview[]; average: number; count: number }>("/services/reviews/featured");
}
