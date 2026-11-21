"use client";

import { useState } from "react";
import { initials } from "@/lib/format";

interface AvatarProps {
  name?: string | null;
  image?: string | null;
  size?: number;
  className?: string;
}

// Profile photos can come from any URL a user pasted, so a plain <img> is used with an
// initials fallback if the picture fails to load
export default function Avatar({ name, image, size = 36, className = "" }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size, fontSize: Math.max(11, size * 0.36) };

  if (image && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ? `${name}'s photo` : "Profile photo"}
        style={style}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`shrink-0 rounded-full object-cover ring-2 ring-white ${className}`}
      />
    );
  }
  return (
    <span
      style={style}
      aria-label={name ?? "User"}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-sand-2 font-semibold text-gold-deep ring-2 ring-white ${className}`}
    >
      {initials(name)}
    </span>
  );
}
