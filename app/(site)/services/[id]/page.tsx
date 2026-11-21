import { ArrowLeft, BadgeCheck, CalendarX2, Clock3, CreditCard, Pencil, Sparkles, Tag, Undo2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import BookingPanel from "@/components/services/BookingPanel";
import { formatDuration, formatPrice } from "@/lib/format";
import { getServiceDetails } from "@/lib/server-api";
import { requireUser, roleOf } from "@/lib/session";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getServiceDetails(id);
  return { title: data ? data.serviceName : "Service not found" };
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { id } = await params;
  // Private page: visitors who are not signed in go to Sign In and come back here afterwards
  const user = await requireUser(`/services/${id}`);
  const { data: service, status } = await getServiceDetails(id);

  if (!service) return <ServiceProblem status={status} />;

  const role = roleOf(user);
  const facts = [
    { Icon: Tag, label: "Category", value: service.category },
    { Icon: Clock3, label: "Estimated duration", value: formatDuration(service.duration) },
    { Icon: CreditCard, label: "Price", value: formatPrice(service.price) },
  ];

  return (
    <div className="pb-20">
      <div className="container-x pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted">
          <Link href="/services" className="inline-flex items-center gap-1.5 font-semibold text-ink-3 hover:text-ink">
            <ArrowLeft className="size-4" /> All services
          </Link>
          <span>/</span>
          <Link href={`/services?category=${encodeURIComponent(service.category)}`} className="hover:text-ink">
            {service.category}
          </Link>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-12">
          <div className="min-w-0">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] bg-sand shadow-soft">
              <Image src={service.image} alt={service.serviceName} fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-ink backdrop-blur">{service.category}</span>
            </div>

            <h1 className="h-display mt-8 text-4xl leading-tight sm:text-5xl">{service.serviceName}</h1>

            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              {facts.map(({ Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-line bg-white p-4">
                  <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
                    <Icon className="size-4 text-gold" /> {label}
                  </dt>
                  <dd className="mt-1.5 font-display text-xl text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-10">
              <h2 className="font-display text-2xl text-ink">About this service</h2>
              <p className="mt-3 text-base leading-[1.8] whitespace-pre-line text-ink-3">{service.description}</p>
            </section>

            <section className="mt-10 rounded-[1.5rem] bg-sand/70 p-6">
              <h2 className="font-display text-xl text-ink">Good to know</h2>
              <ul className="mt-4 grid gap-3 text-sm text-ink-3 sm:grid-cols-2">
                <li className="flex gap-2.5">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-gold" /> A short consultation is included before we start.
                </li>
                <li className="flex gap-2.5">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold" /> Performed by a senior, certified stylist.
                </li>
                <li className="flex gap-2.5">
                  <CreditCard className="mt-0.5 size-4 shrink-0 text-gold" /> Pay online only after the salon confirms.
                </li>
                <li className="flex gap-2.5">
                  <Undo2 className="mt-0.5 size-4 shrink-0 text-gold" /> Cancel free of charge while your request is pending.
                </li>
              </ul>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            {role === "admin" ? (
              <div className="card p-6">
                <p className="eyebrow">Admin view</p>
                <h2 className="h-display mt-3 text-2xl">Admins can&apos;t book appointments</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  You&apos;re signed in with an admin account. Appointment requests are made by customers. You can update this service or review
                  incoming requests from the dashboard.
                </p>
                <div className="mt-5 grid gap-2">
                  <Link href={`/dashboard/admin/services/${service._id}/edit`} className="btn btn-dark">
                    <Pencil className="size-4" /> Edit this service
                  </Link>
                  <Link href="/dashboard/admin/appointments" className="btn btn-outline">
                    Manage appointments
                  </Link>
                </div>
              </div>
            ) : (
              <BookingPanel service={service} />
            )}
          </aside>
        </div>

        {service.related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="h-display text-3xl">More in {service.category}</h2>
              <Link href={`/services?category=${encodeURIComponent(service.category)}`} className="text-sm font-semibold text-gold-deep hover:underline">
                See all
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.related.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Friendly messages for a bad link, a hidden/deleted service or an API problem
function ServiceProblem({ status }: { status: number }) {
  const copy =
    status === 400
      ? { title: "This service link isn't valid", text: "The address looks incomplete or mistyped. Please open the service again from the menu." }
      : status === 404
        ? { title: "Service not available", text: "This service doesn't exist or is no longer offered for booking." }
        : { title: "We couldn't load this service", text: "Something went wrong while loading the service. Please try again in a moment." };
  return (
    <div className="container-x flex flex-1 flex-col items-center justify-center py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-sand text-gold">
        <CalendarX2 className="size-7" />
      </span>
      <h1 className="h-display mt-6 text-4xl">{copy.title}</h1>
      <p className="mt-3 max-w-md text-muted">{copy.text}</p>
      <Link href="/services" className="btn btn-dark mt-8">
        Browse available services
      </Link>
    </div>
  );
}
