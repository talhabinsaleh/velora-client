"use client";

import {
  CalendarCheck2,
  CalendarDays,
  ChevronRight,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Receipt,
  Scissors,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";
import Logo from "@/components/Logo";
import { signOutEverywhere, useSession } from "@/lib/auth-client";
import type { Role } from "@/lib/types";
import { hardNavigate } from "@/lib/navigation";

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  exact?: boolean;
}

const NAV: Record<Role, NavItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", Icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/appointments", label: "My Appointments", Icon: CalendarDays },
    { href: "/dashboard/customer/payments", label: "Payment History", Icon: CreditCard },
    { href: "/dashboard/customer/profile", label: "My Profile", Icon: UserRound },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/services", label: "Manage Services", Icon: Scissors, exact: true },
    { href: "/dashboard/admin/services/new", label: "Add Service", Icon: PlusCircle },
    { href: "/dashboard/admin/appointments", label: "Manage Appointments", Icon: CalendarCheck2 },
    { href: "/dashboard/admin/users", label: "Manage Users", Icon: Users },
    { href: "/dashboard/admin/transactions", label: "Transactions", Icon: Receipt },
    { href: "/dashboard/admin/profile", label: "My Profile", Icon: UserRound },
  ],
};

export interface ShellUser {
  name: string;
  email: string;
  image?: string | null;
  role: Role;
}

function activeFor(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href || (item.href.endsWith("/services") && /\/services\/[^/]+\/edit$/.test(pathname));
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export default function DashboardShell({ user: initial, children }: { user: ShellUser; children: ReactNode }) {
  const pathname = usePathname();
  const { data } = useSession();
  // Live session data keeps the name and photo current right after a profile update
  const user: ShellUser = data?.user
    ? { name: data.user.name, email: data.user.email, image: data.user.image, role: initial.role }
    : initial;
  const items = NAV[user.role];
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);

  async function logout() {
    await signOutEverywhere();
    toast.success("You have been signed out.");
    hardNavigate("/");
  }

  const current = items.find((i) => activeFor(pathname, i));

  const sidebar = (
    <div className="flex h-full flex-col bg-ink text-white/80">
      <div className="flex h-20 items-center justify-between px-6">
        <Logo tone="light" />
        <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="inline-flex size-9 items-center justify-center rounded-full bg-white/10 lg:hidden">
          <X className="size-5" />
        </button>
      </div>

      <div className="px-4">
        <p className="rounded-xl bg-white/[0.06] px-3 py-2 text-[11px] font-bold tracking-[0.2em] text-gold-soft uppercase">
          {user.role === "admin" ? "Admin dashboard" : "Customer dashboard"}
        </p>
      </div>

      <nav aria-label="Dashboard" className="mt-4 flex-1 space-y-1 overflow-y-auto px-4">
        {items.map((item) => {
          const active = activeFor(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active ? "bg-gold text-white shadow-[0_10px_24px_-14px_rgb(181_138_84)]" : "hover:bg-white/[0.07] hover:text-white"
              }`}
            >
              <item.Icon className={`size-[18px] ${active ? "text-white" : "text-white/50 group-hover:text-gold-soft"}`} />
              {item.label}
              {active && <ChevronRight className="ml-auto size-4" />}
            </Link>
          );
        })}

        {user.role === "customer" && (
          <Link href="/services" className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-white/15 px-3 py-2.5 text-sm font-semibold text-gold-soft hover:border-gold/60">
            <PlusCircle className="size-[18px]" /> Book a new service
          </Link>
        )}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/60 hover:bg-white/[0.07] hover:text-white">
          <ExternalLink className="size-4" /> Back to website
        </Link>
        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3">
          <Avatar name={user.name} image={user.image} size={38} className="ring-white/10" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
            <p className="truncate text-xs text-white/50">{user.email}</p>
          </div>
          <button type="button" onClick={logout} aria-label="Logout" title="Logout" className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-white/60 hover:bg-rose/80 hover:text-white">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream lg:pl-72">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-ink/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute inset-y-0 left-0 w-[min(85vw,300px)] transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>{sidebar}</aside>
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line/80 bg-cream/85 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
        <button type="button" onClick={() => setOpen(true)} aria-label="Open dashboard menu" className="inline-flex size-10 items-center justify-center rounded-full bg-sand lg:hidden">
          <Menu className="size-5" />
        </button>
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm text-muted">
          <span className="hidden sm:inline">Dashboard</span>
          <ChevronRight className="hidden size-4 sm:inline" />
          <span className="truncate font-semibold text-ink">{current?.label ?? "Dashboard"}</span>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/services" className="btn btn-outline btn-sm hidden sm:inline-flex">
            Browse services
          </Link>
          <Avatar name={user.name} image={user.image} size={34} />
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
