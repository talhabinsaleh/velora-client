export type Role = "customer" | "admin";
export type ServiceStatus = "active" | "inactive";
export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid";

export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt?: string;
  rating?: number;
  reviewCount?: number;
}

export interface PublicReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string | null;
  customer: { name: string; image: string | null };
  service: { _id: string; serviceName: string; category: string } | null;
}

export interface ServiceDetails extends Service {
  related: Service[];
  reviews: PublicReview[];
}

export interface Review {
  rating: number;
  comment: string;
  hidden?: boolean;
  createdAt: string;
}

export interface CancelRequest {
  reason: string;
  status: "open" | "approved" | "declined";
  requestedAt: string;
  resolvedAt?: string;
  adminNote?: string;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export interface CategorySummary {
  name: string;
  count: number;
  minPrice: number | null;
}

export interface UserSummary {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  role?: Role;
  isBlocked?: boolean;
  createdAt?: string;
}

export interface Appointment {
  _id: string;
  // Populated by the API. null when the service has since been deleted.
  serviceId: Pick<Service, "_id" | "serviceName" | "category" | "image" | "duration" | "price" | "status"> | null;
  customerId: UserSummary | string | null;
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  paymentStatus: PaymentStatus;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt?: string;
  review?: Review;
  cancelRequest?: CancelRequest;
}

export interface Transaction {
  _id: string;
  appointmentId:
    | (Pick<Appointment, "_id" | "appointmentDate" | "timeSlot" | "status"> & {
        serviceId: Pick<Service, "_id" | "serviceName" | "category" | "image"> | null;
      })
    | null;
  customerId: UserSummary | null;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
}

export interface CustomerStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  awaitingPayment: number;
  awaitingReview: number;
  reviewsGiven: number;
  openRequests: number;
  totalSpent: number;
  upcoming: Appointment[];
}

export interface AdminStats {
  totalCustomers: number;
  activeServices: number;
  totalAppointments: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  successfulPayments: number;
  revenue: number;
  range: {
    days: number;
    monthly: boolean;
    revenue: number;
    revenueChange: number;
    bookings: number;
    bookingsChange: number;
    payments: number;
    newCustomers: number;
  };
  series: { key: string; revenue: number; payments: number; bookings: number }[];
  topServices: { _id: string; name: string; image: string; category: string; bookings: number; revenue: number }[];
  byCategory: { category: string; count: number }[];
  today: Appointment[];
  openCancelRequests: number;
  rating: { average: number; count: number };
  recent: Appointment[];
}

export interface Availability {
  date: string;
  taken: string[];
  past: string[];
  slots: string[];
}
