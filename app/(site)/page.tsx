import { Suspense } from "react";
import Categories from "@/components/home/Categories";
import FeaturedServices, { FeaturedServicesSkeleton } from "@/components/home/FeaturedServices";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import { getCategorySummaries, getFeaturedServices } from "@/lib/server-api";
import VisitUs, { CallToAction } from "@/components/home/VisitUs";

// Always show the latest services (an admin can add or hide one at any time)
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ data: categories }, { data: featured }] = await Promise.all([getCategorySummaries(), getFeaturedServices()]);
  const serviceCount = categories ? categories.reduce((sum, c) => sum + c.count, 0) : null;
  return (
    <>
      <Hero serviceCount={serviceCount} popular={featured ?? []} />
      <Suspense fallback={<FeaturedServicesSkeleton />}>
        <FeaturedServices />
      </Suspense>
      <Suspense fallback={<div className="h-[60rem] bg-sand/60" />}>
        <Categories />
      </Suspense>
      <HowItWorks />
      <VisitUs />
      <CallToAction />
    </>
  );
}
