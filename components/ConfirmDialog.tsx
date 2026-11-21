"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Keep it",
  tone = "default",
  busy = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      locked={busy}
      title={title}
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </button>
          <button type="button" className={`btn ${tone === "danger" ? "btn-danger" : "btn-dark"}`} onClick={onConfirm} disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className={`flex gap-3 rounded-2xl p-4 text-sm leading-relaxed ${tone === "danger" ? "bg-rose-50 text-rose-900" : "bg-sand text-ink-3"}`}>
        <AlertTriangle className={`mt-0.5 size-5 shrink-0 ${tone === "danger" ? "text-rose" : "text-gold"}`} />
        <p>{message}</p>
      </div>
    </Modal>
  );
}
