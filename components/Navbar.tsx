"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Avatar from "./Avatar";
import Logo from "./Logo";
import UserMenu, { type NavUser } from "./UserMenu";
import { signOutEverywhere } from "@/lib/auth-client";
import { toast } from "sonner";
import { hardNavigate } from "@/lib/navigation";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar({ initialUser }: { initialUser: NavUser | null }) {
  const pathname = usePathname();
  const { data, isPending } = useSession();
  // Use the server's answer until the client session store has loaded, then follow it live,
  // so signing in or out updates the navbar straight away
  const user: NavUser | null = isPending ? initialUser : (data?.user as NavUser | undefined) ?? null;

  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  // The menu remembers which page it was opened on, so it closes by itself after navigating
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const floating = overHero && !scrolled;
  const dashboard = user ? (user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer") : null;
  const links = dashboard ? [...PUBLIC_LINKS, { href: dashboard, label: "Dashboard" }] : PUBLIC_LINKS;

  return (
    <>
      {/* Over the hero the bar is open and transparent. Once you scroll (and on every other
          page) it tucks into a compact floating glass pill. */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${floating ? "px-0 pt-0" : "px-3 pt-3"}`}>
        <nav
          aria-label="Main"
          className={`relative mx-auto flex items-center justify-between gap-4 transition-all duration-500 ease-out ${
            floating
              ? "container-x h-20 border-b border-ink/[0.07] text-ink"
              : "h-[3.75rem] max-w-5xl rounded-full border border-line/70 bg-white/75 pr-2 pl-4 text-ink shadow-[0_18px_40px_-22px_rgb(31_25_21/0.55),inset_0_1px_0_rgb(255_255_255/0.8)] backdrop-blur-xl backdrop-saturate-150 sm:pl-5"
          }`}
        >
          <Logo />

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex flex-col items-center px-3.5 py-2 text-sm font-semibold transition-colors ${
                      active ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                    {/* gold dot marks the current page, a short line previews it on hover */}
                    <span
                      aria-hidden
                      className={`absolute -bottom-0.5 h-1 rounded-full bg-gold transition-all duration-300 ${
                        active ? "w-1 opacity-100" : "w-0 opacity-0 group-hover:w-4 group-hover:opacity-60"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                {user.role !== "admin" && (
                  <Link href="/services" className="btn btn-gold btn-sm hidden lg:inline-flex">
                    Book now <span className="btn-chip"><ArrowRight /></span>
                  </Link>
                )}
                <div className="hidden md:block">
                  <UserMenu user={user} light={false} />
                </div>
              </>
            ) : (
              <div className="hidden items-center gap-1 md:flex">
                <Link
                  href="/sign-in"
                  aria-current={isActive(pathname, "/sign-in") ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive(pathname, "/sign-in") ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  Sign In
                </Link>
                <Link href="/sign-up" className="btn btn-sm btn-dark">
                  Sign Up <span className="btn-chip"><ArrowRight /></span>
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={`inline-flex size-11 cursor-pointer items-center justify-center rounded-full transition md:hidden ${
                floating ? "border border-line bg-white text-ink" : "bg-ink text-cream"
              }`}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Pages without the full-screen hero start below the floating bar */}
      {!overHero && <div aria-hidden className="h-[5.25rem]" />}

      <MobileMenu open={open} onClose={() => setOpen(false)} links={links} pathname={pathname} user={user} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  links,
  pathname,
  user,
}: {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  pathname: string;
  user: NavUser | null;
}) {
  async function logout() {
    await signOutEverywhere();
    toast.success("You have been signed out. See you soon!");
    hardNavigate("/");
  }

  return (
    <div className={`fixed inset-0 z-[60] md:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col bg-cream shadow-lift transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Logo />
          <button type="button" onClick={onClose} aria-label="Close menu" className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-sand">
            <X className="size-5" />
          </button>
        </div>

        {user && (
          <div className="flex items-center gap-3 border-b border-line px-5 py-4">
            <Avatar name={user.name} image={user.image} size={44} />
            <div className="min-w-0">
              <p className="truncate font-semibold">{user.name}</p>
              <p className="truncate text-sm text-muted">{user.email}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {links.map((link, i) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ animationDelay: `${i * 50}ms` }}
                className={`flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-2xl ${open ? "animate-fade-up" : ""} ${
                  active ? "bg-white text-ink shadow-soft" : "text-ink-3"
                }`}
              >
                {link.label}
                <ArrowRight className={`size-5 ${active ? "text-gold" : "text-line"}`} />
              </Link>
            );
          })}
          {user && (
            <Link
              href={`${user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"}/profile`}
              className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-2xl text-ink-3"
            >
              My Profile
              <ArrowRight className="size-5 text-line" />
            </Link>
          )}
        </nav>

        <div className="space-y-2.5 border-t border-line p-5">
          {user ? (
            <button type="button" onClick={logout} className="btn btn-outline w-full text-rose">
              Logout
            </button>
          ) : (
            <>
              <Link href="/sign-up" className="btn btn-dark w-full">
                Create an account
              </Link>
              <Link href="/sign-in" className="btn btn-outline w-full">
                Sign In
              </Link>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
