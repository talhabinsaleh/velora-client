import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { EmptyState } from "@/components/States";
import { getFeaturedServices } from "@/lib/server-api";
import SectionHeading from "./SectionHeading";

export default async function FeaturedServices() {
  const { data: services } = await getFeaturedServices();

  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeading
        eyebrow="Featured services"
        title={
          <>
            Our most-loved <em className="font-normal text-gold-deep">treatments</em>
          </>
        }
        text="Hand-picked from the Velora menu. Every service is performed by senior stylists using salon-grade products."
        action={
          <Link href="/services" className="btn btn-outline shrink-0">
            View all services <span className="btn-chip"><ArrowRight /></span>
          </Link>
        }
      />

      <div className="mt-12">
        {services === null ? (
          <EmptyState
            title="Services are taking a moment"
            message="We couldn't load the service menu right now. Please refresh the page in a little while."
            action={{ href: "/services", label: "Open the full menu" }}
          />
        ) : services.length === 0 ? (
          <EmptyState title="New services coming soon" message="Our team is preparing the menu. Please check back shortly." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, i) => (
              <ServiceCard key={service._id} service={service} priority={i < 3} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function FeaturedServicesSkeleton() {
  return (
    <section className="container-x py-20 sm:py-28" aria-busy>
      <div className="skeleton h-4 w-40" />
      <div className="skeleton mt-4 h-12 w-96 max-w-full" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-xl2 border border-line/80 bg-white">
            <div className="skeleton aspect-[4/3] rounded-none" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-6 w-2/3" />
              <div className="skeleton h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
