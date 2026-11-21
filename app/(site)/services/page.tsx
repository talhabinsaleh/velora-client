import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { ServiceGridSkeleton } from "@/components/ServiceCard";
import ServiceBrowser from "@/components/services/ServiceBrowser";

export const metadata: Metadata = {
  title: "Browse Services",
  description: "Search Velora's hair, skin, nail, makeup and spa services, filter by category and sort by price.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Velora menu"
        title={
          <>
            Browse <em className="font-normal text-gold-deep">salon services</em>
          </>
        }
        text="Search by name, filter by category and sort by price. Open any service to see the details and request an appointment."
        crumbs={[{ label: "Browse Services" }]}
      />
      <div className="container-x">
        <Suspense fallback={<div className="py-8"><ServiceGridSkeleton count={9} /></div>}>
          <ServiceBrowser />
        </Suspense>
      </div>
    </>
  );
}
