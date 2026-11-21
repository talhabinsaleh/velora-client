import Reveal from "@/components/Reveal";
import { getCategorySummaries } from "@/lib/server-api";
import CategoryAccordion from "./CategoryAccordion";
import SectionHeading from "./SectionHeading";

export default async function Categories() {
  const { data } = await getCategorySummaries();

  return (
    <section className="relative overflow-hidden bg-sand/60 py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Service categories"
            title={
              <>
                Explore by <em className="font-normal text-gold-deep">what you need</em>
              </>
            }
            text="From a quick fringe trim to a full bridal look. Hover a category to open it, then dive into its services."
          />
        </Reveal>
        <Reveal delay={120} className="mt-12">
          <CategoryAccordion summaries={data ?? []} />
        </Reveal>
      </div>
    </section>
  );
}
