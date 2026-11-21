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
    { days: "Saturday – Thursday", time: "10:00 AM – 8:00 PM" },
    { days: "Friday", time: "10:00 AM – 8:00 PM" },
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
    image: "https://i.ibb.co/jvSZxTT9/salonbook-cat-haircut.jpg",
  },
  {
    name: "Hair Coloring",
    slug: "hair-coloring",
    blurb: "Balayage, global color and fashion shades",
    image: "https://i.ibb.co/1fFd5XLK/salonbook-cat-coloring.jpg",
  },
  {
    name: "Hair Treatment",
    slug: "hair-treatment",
    blurb: "Keratin, scalp rituals and deep repair",
    image: "https://i.ibb.co/V0DgcTv6/salonbook-s-repair.jpg",
  },
  {
    name: "Facial & Skincare",
    slug: "facial-skincare",
    blurb: "Glow-boosting facials for every skin type",
    image: "https://i.ibb.co/RGW4pwrp/salonbook-s-gold.jpg",
  },
  {
    name: "Makeup",
    slug: "makeup",
    blurb: "Bridal, party and natural day looks",
    image: "https://i.ibb.co/PvYdS153/salonbook-cat-makeup.jpg",
  },
  {
    name: "Manicure & Pedicure",
    slug: "manicure-pedicure",
    blurb: "Gel, nail art and spa pedicures",
    image: "https://i.ibb.co/zVkBcJtt/salonbook-s-nailart.jpg",
  },
  {
    name: "Spa & Massage",
    slug: "spa-massage",
    blurb: "Hot stone, aromatherapy and relief massages",
    image: "https://i.ibb.co/PvgdSBnH/salonbook-s-aroma.jpg",
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

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
