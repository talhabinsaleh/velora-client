"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type Props = ComponentProps<typeof Link> & { href: string };

// A Link that also works for in-page sections. Clicking "/#how-it-works" while already on the
// home page always scrolls there (even if the address already ends in that #), and clicking the
// current page's own link scrolls back to the top. Other links behave like a normal Next.js Link.
export default function SmartLink({ href, onClick, ...props }: Props) {
  const pathname = usePathname();

  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const [path, hash] = href.split("#");
    const targetPath = path || pathname;
    if (targetPath !== pathname) return;

    const smooth = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (hash) {
      const section = document.getElementById(hash);
      if (!section) return;
      e.preventDefault();
      section.scrollIntoView({ behavior: smooth, block: "start" });
      window.history.pushState(null, "", `${targetPath}#${hash}`);
      return;
    }
    // Same page without a #: scroll to the top. If the address carries filters (?category=…),
    // let Next.js navigate normally so they are cleared.
    if (!href.includes("?") && !window.location.search) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: smooth });
      if (window.location.hash || window.location.search) window.history.pushState(null, "", targetPath);
    }
  }

  return <Link href={href} onClick={handle} {...props} />;
}
