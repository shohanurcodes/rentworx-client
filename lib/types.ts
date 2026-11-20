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
