import { api } from "@/lib/api";
import type { CustomerReview, FeaturedEquipment } from "@/lib/types";

const fallbackEquipment: FeaturedEquipment[] = [
  {
    id: "demo-excavator",
    name: "CAT 320 Hydraulic Excavator",
    category: "Construction Equipment",
    location: "Dhaka, Bangladesh",
    price: 420,
    rentalType: "daily",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    condition: "Excellent",
    ratingAverage: 4.9,
    reviewCount: 18,
  },
  {
    id: "demo-camera",
    name: "Sony FX6 Cinema Camera Kit",
    category: "Photography Equipment",
    location: "Chattogram, Bangladesh",
    price: 180,
    rentalType: "daily",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    condition: "Like New",
    ratingAverage: 4.8,
    reviewCount: 24,
  },
  {
    id: "demo-van",
    name: "Toyota HiAce Commuter Van",
    category: "Vehicles & Transportation",
    location: "Dhaka, Bangladesh",
    price: 95,
    rentalType: "daily",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
    condition: "Good",
    ratingAverage: 4.7,
    reviewCount: 12,
  },
  {
    id: "demo-tractor",
    name: "John Deere 5050D Tractor",
    category: "Agriculture Equipment",
    location: "Khulna, Bangladesh",
    price: 130,
    rentalType: "daily",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
    condition: "Good",
    ratingAverage: 4.6,
    reviewCount: 9,
  },
  {
    id: "demo-macbook",
    name: "MacBook Pro 16 Studio",
    category: "Electronics",
    location: "Sylhet, Bangladesh",
    price: 55,
    rentalType: "weekly",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    condition: "Excellent",
    ratingAverage: 4.9,
    reviewCount: 31,
  },
  {
    id: "demo-led-wall",
    name: "LED Wall & Stage Lighting Package",
    category: "Event Equipment",
    location: "Dhaka, Bangladesh",
    price: 750,
    rentalType: "daily",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    condition: "Excellent",
    ratingAverage: 4.8,
    reviewCount: 15,
  },
];

const fallbackReviews: CustomerReview[] = [
  {
    id: "demo-review-1",
    customerName: "Nusrat Jahan",
    rating: 5,
    comment:
      "The excavator arrived on time and the owner was very responsive. The platform made the whole booking simple.",
    createdAt: "2026-10-18T00:00:00.000Z",
  },
  {
    id: "demo-review-2",
    customerName: "Tanvir Ahmed",
    rating: 5,
    comment:
      "Rented a cinema camera for a three-day commercial. Everything was clean, tested, and exactly as described.",
    createdAt: "2026-10-12T00:00:00.000Z",
  },
  {
    id: "demo-review-3",
    customerName: "Maya Chowdhury",
    rating: 4,
    comment:
      "Great pricing and clear rental terms. Payment confirmation was quick and the support team answered my questions.",
    createdAt: "2026-10-05T00:00:00.000Z",
  },
];

export async function loadFeaturedEquipment(): Promise<FeaturedEquipment[]> {
  try {
    const response = await api.get<FeaturedEquipment[]>(
      "/equipment/featured?limit=6",
      { auth: false },
    );
    return response.data.length ? response.data : fallbackEquipment;
  } catch {
    return fallbackEquipment;
  }
}

export async function loadCustomerReviews(): Promise<CustomerReview[]> {
  try {
    const response = await api.get<CustomerReview[]>("/reviews?limit=3", {
      auth: false,
    });
    return response.data.length ? response.data : fallbackReviews;
  } catch {
    return fallbackReviews;
  }
}
