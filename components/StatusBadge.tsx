import { CheckCircle2, CircleDashed, CircleSlash, CreditCard, Hourglass, XCircle } from "lucide-react";

const STYLES = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-800 ring-amber-200", Icon: Hourglass },
  confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-800 ring-emerald-200", Icon: CheckCircle2 },
  cancelled: { label: "Cancelled", cls: "bg-rose-50 text-rose-700 ring-rose-200", Icon: XCircle },
  paid: { label: "Paid", cls: "bg-emerald-600 text-white ring-emerald-600", Icon: CreditCard },
  unpaid: { label: "Unpaid", cls: "bg-stone-100 text-stone-600 ring-stone-200", Icon: CircleDashed },
  failed: { label: "Failed", cls: "bg-rose-50 text-rose-700 ring-rose-200", Icon: XCircle },
  active: { label: "Active", cls: "bg-emerald-50 text-emerald-800 ring-emerald-200", Icon: CheckCircle2 },
  inactive: { label: "Inactive", cls: "bg-stone-100 text-stone-600 ring-stone-200", Icon: CircleSlash },
  blocked: { label: "Blocked", cls: "bg-rose-50 text-rose-700 ring-rose-200", Icon: CircleSlash },
} as const;

export type BadgeStatus = keyof typeof STYLES;

export default function StatusBadge({ status, className = "" }: { status: BadgeStatus; className?: string }) {
  const { label, cls, Icon } = STYLES[status] ?? STYLES.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1 ring-inset ${cls} ${className}`}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}
