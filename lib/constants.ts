export const BRAND = {
  name: "Velora",
  tagline: "Salon & Spa",
  description:
    "A calm, modern salon in the heart of Banani. Browse our services, request a time that suits you and pay securely once we confirm.",
};

export const SALON = {
  phone: "+880 1711-482 905",
  phoneHref: "tel:+8801711482905",
  email: "hello@velora.salon",
  address: ["House 42, Road 11", "Banani, Dhaka 1213", "Bangladesh"],
  mapUrl: "https://maps.google.com/?q=Road+11+Banani+Dhaka",
  hours: [
    { days: "Every day", time: "10:00 AM – 8:00 PM" },
    { days: "Public holidays", time: "By appointment" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
};

export interface CategoryInfo {
  name: string;
  slug: string;
  blurb: string;
  image: string;
}

// The seven service categories, in the same order the API uses
export const CATEGORIES: CategoryInfo[] = [
  {
    name: "Haircut & Styling",
    slug: "haircut-styling",
    blurb: "Precision cuts, blowouts and occasion styling",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1600&h=2000&fit=crop&q=85",
  },
  {
    name: "Hair Coloring",
    slug: "hair-coloring",
    blurb: "Balayage, global color and fashion shades",
    image: "https://images.unsplash.com/photo-1707720531504-ce087725861a?w=1600&h=2000&fit=crop&q=85",
  },
  {
    name: "Hair Treatment",
    slug: "hair-treatment",
    blurb: "Keratin, scalp rituals and deep repair",
    image: "https://images.unsplash.com/photo-1712641966810-611ff1503c6d?w=1600&h=2000&fit=crop&q=85",
  },
  {
    name: "Facial & Skincare",
    slug: "facial-skincare",
    blurb: "Glow-boosting facials for every skin type",
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=1600&h=2000&fit=crop&q=85",
  },
  {
    name: "Makeup",
    slug: "makeup",
    blurb: "Bridal, party and natural day looks",
    image: "https://images.unsplash.com/photo-1613966802194-d46a163af70d?w=1600&h=2000&fit=crop&q=85",
  },
  {
    name: "Manicure & Pedicure",
    slug: "manicure-pedicure",
    blurb: "Gel, nail art and spa pedicures",
    image: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=1600&h=2000&fit=crop&q=85",
  },
  {
    name: "Spa & Massage",
    slug: "spa-massage",
    blurb: "Hot stone, aromatherapy and relief massages",
    image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=1600&h=2000&fit=crop&q=85",
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

// Clean, readable category links: /services?category=haircut-styling
export function categoryHref(name: string) {
  const slug = CATEGORIES.find((c) => c.name === name)?.slug;
  return slug ? `/services?category=${slug}` : "/services";
}

// Accepts a slug (or, for older links, the full name) and returns the category name
export function categoryFromParam(value: string | null | undefined) {
  if (!value) return null;
  return CATEGORIES.find((c) => c.slug === value || c.name === value)?.name ?? null;
}

export function categorySlug(name: string) {
  return CATEGORIES.find((c) => c.name === name)?.slug ?? "";
}

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "duration_asc", label: "Shortest first" },
];

export const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

export const BOOKING_WINDOW_DAYS = 60;

export const PROMISES = [
  { title: "Certified stylists", text: "Every artist has at least five years of salon experience and trains with us every season." },
  { title: "Honest pricing", text: "The price you see is the price you pay. No surprise add-ons at the chair." },
  { title: "Hygiene first", text: "Tools are sterilised after every guest and towels are always single use." },
  { title: "Gentle products", text: "Salon-grade, cruelty-free brands chosen for every hair and skin type." },
];

export const FAQS = [
  {
    q: "How do I book an appointment?",
    a: "Open any service, choose a date and an open time slot and send your request. You'll see it in your dashboard as Pending until the salon confirms it.",
  },
  {
    q: "When do I pay?",
    a: "Only after we confirm your appointment. A Pay Now button then appears in My Appointments and takes you to secure Stripe checkout.",
  },
  {
    q: "Can I cancel or change my request?",
    a: "Yes. You can cancel any request that is still pending from your dashboard. Once it's confirmed, please call us and we'll help.",
  },
  {
    q: "Which payment methods do you accept online?",
    a: "All major debit and credit cards through Stripe. Your card details never touch our servers.",
  },
  {
    q: "How early should I arrive?",
    a: "Around ten minutes before your slot, so we can offer you a drink and talk through what you'd like.",
  },
  {
    q: "Do you take walk-ins?",
    a: "When a chair is free, yes, but booking online is the only way to guarantee your time.",
  },
];
