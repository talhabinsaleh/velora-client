import { LogoMark } from "@/components/Logo";

export default function Loading() {
  return (
    <div role="status" className="flex flex-1 flex-col items-center justify-center gap-4 py-32">
      <LogoMark className="size-12 animate-pulse text-ink" />
      <p className="text-sm font-medium text-muted">Loading…</p>
    </div>
  );
}
