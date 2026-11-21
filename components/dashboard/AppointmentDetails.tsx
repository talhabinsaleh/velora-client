"use client";

import { CalendarDays, Clock3, Mail, MessageSquareText, Phone, Receipt, Star, Tag, Undo2 } from "lucide-react";
import { Stars } from "@/components/Stars";
import Image from "next/image";
import type { ReactNode } from "react";
import Avatar from "@/components/Avatar";
import Modal from "@/components/Modal";
import StatusBadge from "@/components/StatusBadge";
import { formatAppointmentDate, formatDateTime, formatDuration, formatPrice } from "@/lib/format";
import type { Appointment, UserSummary } from "@/lib/types";

export function ServiceCell({ appointment }: { appointment: Appointment }) {
  const s = appointment.serviceId;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-sand">
        {s?.image && <Image src={s.image} alt="" fill sizes="48px" className="object-cover" />}
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{s?.serviceName ?? "Service removed"}</p>
        <p className="truncate text-xs text-muted">{s?.category ?? "No longer on the menu"}</p>
      </div>
    </div>
  );
}

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 text-gold">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">{label}</p>
        <div className="mt-0.5 text-sm text-ink">{children}</div>
      </div>
    </div>
  );
}

export default function AppointmentDetails({
  appointment,
  onClose,
  showCustomer = false,
  footer,
}: {
  appointment: Appointment | null;
  onClose: () => void;
  showCustomer?: boolean;
  footer?: ReactNode;
}) {
  const a = appointment;
  const customer = a && typeof a.customerId === "object" ? (a.customerId as UserSummary | null) : null;

  return (
    <Modal open={!!a} onClose={onClose} title="Appointment details" size="md" footer={footer}>
      {a && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sand/60 p-4">
            <ServiceCell appointment={a} />
            <div className="flex gap-2">
              <StatusBadge status={a.status} />
              <StatusBadge status={a.paymentStatus} />
            </div>
          </div>

          <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
            <Row icon={<CalendarDays className="size-4" />} label="Appointment date">
              {formatAppointmentDate(a.appointmentDate, "long")}
            </Row>
            <Row icon={<Clock3 className="size-4" />} label="Time slot">
              {a.timeSlot}
              {a.serviceId?.duration ? <span className="text-muted"> · {formatDuration(a.serviceId.duration)}</span> : null}
            </Row>
            <Row icon={<Tag className="size-4" />} label="Service price">
              {formatPrice(a.servicePrice)}
            </Row>
            <Row icon={<Receipt className="size-4" />} label="Requested on">
              {formatDateTime(a.createdAt)}
            </Row>
          </div>

          {showCustomer && (
            <div className="mt-3 rounded-2xl border border-line p-4">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">Customer</p>
              {customer ? (
                <div className="mt-3 flex items-center gap-3">
                  <Avatar name={customer.name} image={customer.image} size={44} />
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold text-ink">
                      {customer.name} {customer.isBlocked && <StatusBadge status="blocked" className="ml-1" />}
                    </p>
                    <p className="flex items-center gap-1.5 text-muted">
                      <Mail className="size-3.5" /> {customer.email}
                    </p>
                    {customer.phone && (
                      <p className="flex items-center gap-1.5 text-muted">
                        <Phone className="size-3.5" /> {customer.phone}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">This account no longer exists.</p>
              )}
            </div>
          )}

          <div className="mt-3 rounded-2xl border border-line p-4">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
              <MessageSquareText className="size-4 text-gold" /> Customer message
            </p>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink-3">{a.message ? a.message : <span className="text-muted italic">No message was added.</span>}</p>
          </div>

          {a.cancelRequest && (
            <div className={`mt-3 rounded-2xl border p-4 ${a.cancelRequest.status === "open" ? "border-amber-200 bg-amber-50/70" : "border-line"}`}>
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
                <Undo2 className="size-4 text-gold" /> Cancellation request ·{" "}
                <span className={a.cancelRequest.status === "open" ? "text-amber-800" : a.cancelRequest.status === "approved" ? "text-ink-3" : "text-sky-800"}>
                  {a.cancelRequest.status}
                </span>
              </p>
              <p className="mt-2 text-sm text-ink-3">“{a.cancelRequest.reason}”</p>
              {a.cancelRequest.adminNote && <p className="mt-2 text-sm text-ink-3"><strong className="text-ink">Salon reply:</strong> {a.cancelRequest.adminNote}</p>}
            </div>
          )}

          {a.review && (
            <div className="mt-3 rounded-2xl border border-line p-4">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
                <Star className="size-4 text-gold" /> Review {a.review.hidden && <span className="text-rose">(hidden)</span>}
              </p>
              <Stars value={a.review.rating} className="mt-2" />
              {a.review.comment && <p className="mt-2 text-sm text-ink-3">“{a.review.comment}”</p>}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
