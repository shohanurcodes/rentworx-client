export type UserRole = "customer" | "owner" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export interface FeaturedEquipment {
  id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  rentalType: "daily" | "weekly" | "monthly";
  image: string;
  condition: string;
  ratingAverage: number;
  reviewCount: number;
  availableQuantity?: number;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: "daily" | "weekly" | "monthly";
  quantity: number;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  image: string;
  terms: string;
  ratingAverage: number;
  reviewCount: number;
  ownerInfo: {
    name: string;
    image?: string;
  };
}

export interface EquipmentQuery {
  search?: string;
  location?: string;
  category?: string;
  rentalType?: string;
  minPrice?: string;
  maxPrice?: string;
  available?: boolean;
  sort?: "recent" | "priceAsc" | "priceDesc" | "rating";
  page?: number;
  limit?: number;
}

export interface BookingCheckoutPayload {
  equipmentId: string;
  startDate: string;
  endDate: string;
  requiredQuantity: number;
  contactNumber: string;
  deliveryAddress: string;
  notes?: string;
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
  bookingId: string;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface BookingSummary {
  id: string;
  equipmentInfo: {
    name: string;
    image?: string;
    location?: string;
    category?: string;
    email?: string;
  };
  startDate: string;
  endDate: string;
  rentalType: string;
  duration: number;
  requiredQuantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  transactionId?: string;
  stripeSessionId?: string;
  bookingDate: string;
  createdAt: string;
  customerInfo: {
    name: string;
    email?: string;
    image?: string;
  };
  ownerInfo: {
    name: string;
    email?: string;
    image?: string;
  };
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ManageEquipment extends FeaturedEquipment {
  ownerInfo: {
    name: string;
    email?: string;
    image?: string;
  };
  status: "pending" | "approved" | "rejected";
  description: string;
  quantity: number;
  brand: string;
  model: string;
  terms: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentPayload {
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: "daily" | "weekly" | "monthly";
  quantity: number;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  image: string;
  terms: string;
}

export interface OwnerAnalytics {
  equipment: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  revenue: number;
}

export interface AdminAnalytics {
  users: {
    total: number;
    customers: number;
    owners: number;
    admins: number;
  };
  equipment: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  revenue: number;
}

export interface UploadResponse {
  url: string;
  deleteUrl?: string;
}
