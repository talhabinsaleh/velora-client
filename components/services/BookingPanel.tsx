"use client";

import { CalendarDays, CheckCircle2, Clock3, Loader2, MessageSquareText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, ApiError, errorMessage } from "@/lib/api";
import { BOOKING_WINDOW_DAYS, TIME_SLOTS } from "@/lib/constants";
import { formatAppointmentDate, formatDuration, formatPrice, salonDateString } from "@/lib/format";
import type { Availability, Service } from "@/lib/types";

const STRIP_DAYS = 14;

function dayParts(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    day: d.getUTCDate(),
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
  };
}

export default function BookingPanel({ service }: { service: Service }) {
  const today = salonDateString(0);
  const lastDay = salonDateString(BOOKING_WINDOW_DAYS);
  const strip = useMemo(() => Array.from({ length: STRIP_DAYS }, (_, i) => salonDateString(i)), []);

  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(0);
  const availabilityKey = `${refresh}|${date}`;
  const [loaded, setLoaded] = useState<{ key: string; data: Availability | null; error: string | null }>({ key: "", data: null, error: null });
  const checking = loaded.key !== availabilityKey;
  const availability = checking ? null : loaded.data;
  const availabilityError = checking ? null : loaded.error;
  const [submitting, setSubmitting] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [booked, setBooked] = useState<{ date: string; slot: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    api<Availability>(`/api/appointments/availability?serviceId=${service._id}&date=${date}`, { signal: controller.signal })
      .then((data) => {
        setLoaded({ key: availabilityKey, data, error: null });
        // Drop a selected slot that just became unavailable
        setSlot((current) => (current && (data.taken.includes(current) || data.past.includes(current)) ? "" : current));
      })
      .catch((err) => {
        if ((err as Error).name !== "AbortError") setLoaded({ key: availabilityKey, data: null, error: errorMessage(err) });
      });
    return () => controller.abort();
  }, [service._id, date, availabilityKey]);

  const blocked = new Set([...(availability?.taken ?? []), ...(availability?.past ?? [])]);
  const openCount = TIME_SLOTS.filter((s) => !blocked.has(s)).length;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!slot) {
      setSlotError("Please choose a time slot.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api<{ message: string }>("/api/appointments", {
        method: "POST",
        body: { serviceId: service._id, appointmentDate: date, timeSlot: slot, message: message.trim() },
      });
      toast.success(res.message);
      setBooked({ date, slot });
      setMessage("");
    } catch (err) {
      toast.error(errorMessage(err, "Could not send your request. Please try again."));
      // A clash means the slot list is out of date
      if (err instanceof ApiError && err.status === 409) {
        setSlot("");
        setRefresh((n) => n + 1);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (booked) {
    return (
      <div className="card animate-fade-up p-6 text-center sm:p-8">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="h-display mt-5 text-2xl">Request sent!</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          <strong className="text-ink">{service.serviceName}</strong> on {formatAppointmentDate(`${booked.date}T00:00:00Z`, "long")} at{" "}
          {booked.slot}. It&apos;s now <strong className="text-amber-700">pending</strong>. We&apos;ll confirm soon, then you can pay from your dashboard.
        </p>
        <div className="mt-6 grid gap-2">
          <Link href="/dashboard/customer/appointments" className="btn btn-dark">
            View my appointments
          </Link>
          <button
            type="button"
            onClick={() => {
              setBooked(null);
              setSlot("");
              setRefresh((n) => n + 1);
            }}
            className="btn btn-outline"
          >
            Book another time
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card min-w-0 overflow-hidden" noValidate>
      <div className="border-b border-line bg-sand/50 p-5 sm:p-6">
        <p className="text-[11px] font-bold tracking-[0.16em] text-muted uppercase">Request an appointment</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="font-display text-4xl font-medium text-ink">{formatPrice(service.price)}</p>
          <p className="flex items-center gap-1.5 pb-1 text-sm font-semibold text-ink-3">
            <Clock3 className="size-4 text-gold" /> {formatDuration(service.duration)}
          </p>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        {/* Date */}
        <fieldset>
          <legend className="label flex w-full items-center justify-between">
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4 text-gold" /> Appointment date
            </span>
            <span className="text-xs font-medium text-muted">{formatAppointmentDate(`${date}T00:00:00Z`)}</span>
          </legend>
          <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pt-1 pb-2">
            {strip.map((d, i) => {
              const p = dayParts(d);
              const active = d === date;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDate(d)}
                  aria-pressed={active}
                  className={`flex w-[4.1rem] shrink-0 cursor-pointer snap-start flex-col items-center rounded-2xl border py-2.5 transition ${
                    active ? "border-ink bg-ink text-cream shadow-soft" : "border-line bg-white text-ink hover:border-ink/40"
                  }`}
                >
                  <span className={`text-[11px] font-semibold uppercase ${active ? "text-gold-soft" : "text-muted"}`}>{i === 0 ? "Today" : p.weekday}</span>
                  <span className="font-display text-xl leading-tight">{p.day}</span>
                  <span className={`text-[11px] ${active ? "text-cream/70" : "text-muted"}`}>{p.month}</span>
                </button>
              );
            })}
          </div>
          <label className="mt-2 flex items-center gap-2 text-xs text-muted">
            Or pick another date:
            <input
              type="date"
              min={today}
              max={lastDay}
              value={date}
              onChange={(e) => e.target.value && e.target.value >= today && e.target.value <= lastDay && setDate(e.target.value)}
              className="input h-9 w-auto px-2.5 text-sm"
              aria-label="Appointment date"
            />
          </label>
        </fieldset>

        {/* Time slot */}
        <fieldset>
          <legend className="label flex w-full items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock3 className="size-4 text-gold" /> Available time slot
            </span>
            {!checking && availability && <span className="text-xs font-medium text-muted">{openCount} open</span>}
          </legend>
          {availabilityError ? (
            <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">
              {availabilityError}{" "}
              <button type="button" onClick={() => setRefresh((n) => n + 1)} className="font-semibold underline">
                Retry
              </button>
            </p>
          ) : (
            <div className="relative grid grid-cols-3 gap-2" aria-busy={checking}>
              {TIME_SLOTS.map((s) => {
                const taken = availability?.taken.includes(s);
                const past = availability?.past.includes(s);
                const disabled = checking || taken || past;
                const active = slot === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setSlot(s);
                      setSlotError(null);
                    }}
                    aria-pressed={active}
                    title={taken ? "Already booked" : past ? "This time has passed" : undefined}
                    className={`h-11 cursor-pointer rounded-xl border text-[13px] font-semibold transition disabled:cursor-not-allowed ${
                      active
                        ? "border-gold bg-gold text-white shadow-[0_8px_20px_-10px_rgb(141_101_53/0.9)]"
                        : taken || past
                          ? "border-dashed border-line bg-sand/40 text-muted/60 line-through"
                          : "border-line bg-white text-ink hover:border-gold hover:text-gold-deep"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
              {checking && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[1px]">
                  <Loader2 className="size-5 animate-spin text-gold" />
                </div>
              )}
            </div>
          )}
          {!checking && availability && openCount === 0 && (
            <p className="mt-2 text-sm text-muted">No open slots on this day. Please choose another date.</p>
          )}
          {slotError && <p className="field-error">{slotError}</p>}
        </fieldset>

        {/* Message */}
        <div>
          <label htmlFor="message" className="label flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquareText className="size-4 text-gold" /> Additional message <span className="font-normal text-muted">(optional)</span>
            </span>
            <span className="text-xs font-normal text-muted">{message.length}/500</span>
          </label>
          <textarea
            id="message"
            value={message}
            maxLength={500}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Anything your stylist should know? e.g. hair length, allergies, a reference photo you'll bring…"
            className="input min-h-24 resize-y"
          />
        </div>

        <button type="submit" disabled={submitting || checking} className="btn btn-gold btn-lg w-full">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Sending request…
            </>
          ) : (
            <>Request appointment{slot ? ` · ${slot}` : ""}</>
          )}
        </button>
        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          No payment now. You&apos;ll pay securely with Stripe after the salon confirms your appointment.
        </p>
      </div>
    </form>
  );
}
