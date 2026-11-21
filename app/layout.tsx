import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display-face",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Velora — Salon & Spa Appointments in Dhaka",
    template: "%s · Velora Salon & Spa",
  },
  description:
    "Browse hair, skin, nail and spa services at Velora, request an appointment online in seconds and pay securely once the salon confirms.",
  openGraph: {
    title: "Velora — Salon & Spa Appointments",
    description: "Explore salon services, request a time that suits you and pay securely online.",
    images: ["/images/hero.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f1915",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{ style: { fontFamily: "var(--font-body)", borderRadius: "14px" } }}
        />
      </body>
    </html>
  );
}
