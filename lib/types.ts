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
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
