"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Modal from "@/components/Modal";
import { StarInput } from "@/components/Stars";
import { api, errorMessage } from "@/lib/api";
import { formatAppointmentDate } from "@/lib/format";
import type { Appointment } from "@/lib/types";

// Rate a paid visit
export function ReviewModal({ appointment, onClose, onDone }: { appointment: Appointment | null; onClose: () => void; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!appointment) return;
    if (!rating) {
      setError("Please choose a star rating.");
      return;
    }
    setBusy(true);
    try {
      const res = await api<{ message: string }>(`/api/appointments/${appointment._id}/review`, { method: "POST", body: { rating, comment: comment.trim() } });
      toast.success(res.message);
      setRating(0);
      setComment("");
      setError(null);
      onDone();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={!!appointment}
      onClose={onClose}
      locked={busy}
      size="md"
      title="Rate your visit"
      description={appointment ? `${appointment.serviceId?.serviceName ?? "Your service"} · ${formatAppointmentDate(appointment.appointmentDate)}` : undefined}
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={busy}>
            Not now
          </button>
          <button type="button" className="btn btn-dark" onClick={submit} disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />} Publish review
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <span className="label">Your rating</span>
          <StarInput
            value={rating}
            onChange={(v) => {
              setRating(v);
              setError(null);
            }}
          />
          {error && <p className="field-error">{error}</p>}
        </div>
        <div>
          <label htmlFor="review-comment" className="label flex justify-between">
            Tell others about it <span className="text-xs font-normal text-muted">{comment.length}/600</span>
          </label>
          <textarea
            id="review-comment"
            rows={4}
            maxLength={600}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you love? Anything we could do better?"
            className="input"
          />
          <p className="mt-1.5 text-xs text-muted">Your first name and review appear on the service page.</p>
        </div>
      </div>
    </Modal>
  );
}

// Ask the salon to cancel a confirmed appointment
export function CancelRequestModal({ appointment, onClose, onDone }: { appointment: Appointment | null; onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!appointment) return;
    if (reason.trim().length < 5) {
      setError("Please tell the salon briefly why (at least 5 characters).");
      return;
    }
    setBusy(true);
    try {
      const res = await api<{ message: string }>(`/api/appointments/${appointment._id}/cancel-request`, { method: "POST", body: { reason: reason.trim() } });
      toast.success(res.message);
      setReason("");
      setError(null);
      onDone();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={!!appointment}
      onClose={onClose}
      locked={busy}
      size="md"
      title="Request cancellation"
      description="Confirmed appointments can't be cancelled online, but you can ask the salon. They'll approve or reply with a note."
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={busy}>
            Keep appointment
          </button>
          <button type="button" className="btn btn-danger" onClick={submit} disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />} Send request
          </button>
        </>
      }
    >
      {appointment && (
        <div className="space-y-4">
          <p className="rounded-2xl bg-sand/70 p-4 text-sm text-ink-3">
            <strong className="text-ink">{appointment.serviceId?.serviceName ?? "Service"}</strong> on {formatAppointmentDate(appointment.appointmentDate, "long")} at{" "}
            {appointment.timeSlot}
          </p>
          <div>
            <label htmlFor="cancel-reason" className="label flex justify-between">
              Reason <span className="text-xs font-normal text-muted">{reason.length}/300</span>
            </label>
            <textarea
              id="cancel-reason"
              rows={3}
              maxLength={300}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError(null);
              }}
              aria-invalid={!!error || undefined}
              placeholder="e.g. I'm travelling that week and can't make it."
              className="input"
            />
            {error && <p className="field-error">{error}</p>}
          </div>
        </div>
      )}
    </Modal>
  );
}

// Small label that shows where a cancellation request stands
export function RequestBadge({ appointment }: { appointment: Appointment }) {
  const r = appointment.cancelRequest;
  if (!r) return null;
  const styles = {
    open: "bg-amber-50 text-amber-800 ring-amber-200",
    approved: "bg-stone-100 text-stone-600 ring-stone-200",
    declined: "bg-sky-50 text-sky-800 ring-sky-200",
  } as const;
  const text = { open: "Cancellation requested", approved: "Request approved", declined: "Request declined" } as const;
  return (
    <span title={r.adminNote || r.reason} className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ring-1 ring-inset ${styles[r.status]}`}>
      {text[r.status]}
    </span>
  );
}
