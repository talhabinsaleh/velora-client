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
}

export interface ServiceDetails extends Service {
  related: Service[];
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
  byCategory: { category: string; count: number }[];
  requestsByDay: { date: string; count: number }[];
  recent: Appointment[];
}

export interface Availability {
  date: string;
  taken: string[];
  past: string[];
  slots: string[];
}
