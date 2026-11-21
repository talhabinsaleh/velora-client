"use client";

import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { signOutEverywhere } from "@/lib/auth-client";
import Avatar from "./Avatar";

export interface NavUser {
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
}

export default function UserMenu({ user, light }: { user: NavUser; light: boolean }) {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const base = user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer";

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  async function logout() {
    setLeaving(true);
    await signOutEverywhere();
    toast.success("You have been signed out. See you soon!");
    // A full load clears every cached private page
    window.location.assign("/");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex cursor-pointer items-center gap-2 rounded-full py-1 pr-2.5 pl-1 transition ${
          light ? "hover:bg-white/15" : "hover:bg-sand"
        }`}
      >
        <Avatar name={user.name} image={user.image} size={34} />
        <span className="hidden max-w-28 truncate text-sm font-semibold lg:block">{user.name.split(" ")[0]}</span>
        <ChevronDown className={`size-4 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2.5 w-64 origin-top-right animate-fade-in overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-lift"
        >
          <div className="flex items-center gap-3 border-b border-line bg-sand/40 px-4 py-3.5">
            <Avatar name={user.name} image={user.image} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-bold tracking-wider text-gold-deep uppercase">
                {user.role === "admin" ? "Admin" : "Customer"}
              </span>
            </div>
          </div>
          <div className="p-1.5">
            <Link role="menuitem" href={base} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-sand">
              <LayoutDashboard className="size-4 text-muted" /> Dashboard
            </Link>
            <Link role="menuitem" href={`${base}/profile`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-sand">
              <UserRound className="size-4 text-muted" /> My Profile
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={logout}
              disabled={leaving}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose hover:bg-blush disabled:opacity-60"
            >
              <LogOut className="size-4" /> {leaving ? "Signing out…" : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
