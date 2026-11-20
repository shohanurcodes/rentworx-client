"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { BookingModal } from "@/components/booking/BookingModal";
import { FavoriteButton } from "@/components/equipment/favorite-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchEquipmentById } from "@/lib/equipment-api";
import { loadCustomerReviews } from "@/lib/home-data";
import type { CustomerReview, Equipment } from "@/lib/types";

export function EquipmentDetails({ id }: { id: string }) {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("checkout") === "cancelled") {
      toast.info("Checkout cancelled. You were not charged.");
    }
  }, []);

  useEffect(() => {
    let active = true;

    Promise.all([fetchEquipmentById(id), loadCustomerReviews()])
      .then(([equipmentResponse, reviewData]) => {
        if (!active) return;
        setEquipment(equipmentResponse.data);
        setReviews(reviewData.slice(0, 3));
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-[520px] animate-pulse rounded-3xl border border-border bg-secondary" />
      </div>
    );
  }

  if (notFound || !equipment) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-5xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold">Equipment not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This listing may have been removed or is no longer available.
        </p>
        <Button asChild className="mt-6">
          <Link href="/all-equipment">Back to all equipment</Link>
        </Button>
      </div>
    );
  }

  const specs = [
    {
      label: "Brand",
      value: equipment.brand,
    },
    {
      label: "Model",
      value: equipment.model,
    },
    {
      label: "Condition",
      value: equipment.condition,
    },
    {
      label: "Category",
      value: equipment.category,
    },
    {
      label: "Rental type",
      value: equipment.rentalType,
    },
    {
      label: "Available units",
      value: String(equipment.availableQuantity),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link
        href="/all-equipment"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to all equipment
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-secondary">
            <Image
              src={equipment.image}
              alt={equipment.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            <FavoriteButton
              equipmentId={equipment.id}
              className="absolute right-4 top-4 size-10"
            />
          </div>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold">About this equipment</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {equipment.description}
              </p>

              <h3 className="mt-7 text-sm font-bold uppercase tracking-wide">
                Specifications
              </h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="rounded-xl border border-border bg-secondary/30 p-4"
                  >
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold capitalize">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-7 text-sm font-bold uppercase tracking-wide">
                Rental terms
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {equipment.terms}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">{equipment.condition}</Badge>
                <Badge variant="secondary" className="capitalize">
                  {equipment.rentalType}
                </Badge>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {equipment.category}
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  {equipment.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {equipment.location}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Star className="size-4 fill-accent text-accent" />
                  {equipment.ratingAverage.toFixed(1)} ({equipment.reviewCount})
                </span>
              </div>

              <div className="border-t border-border pt-5">
                <p className="text-3xl font-bold text-foreground">
                  ${equipment.price.toLocaleString()}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    / {equipment.rentalType}
                  </span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Package className="size-4" />
                  {equipment.availableQuantity} available
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-4">
                <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                  {equipment.ownerInfo.image ? (
                    <Image
                      src={equipment.ownerInfo.image}
                      alt={equipment.ownerInfo.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserRound className="size-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {equipment.ownerInfo.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Verified owner</p>
                </div>
                <BadgeCheck className="ml-auto size-5 text-primary" />
              </div>

              <BookingModal equipment={equipment}>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={equipment.availableQuantity === 0}
                >
                  <CalendarDays />
                  {equipment.availableQuantity > 0
                    ? "Reserve & book"
                    : "Currently unavailable"}
                </Button>
              </BookingModal>

              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                Secure checkout powered by Stripe
              </p>
            </CardContent>
          </Card>

          {reviews.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-base font-bold">Recent renter feedback</h2>
                <div className="mt-4 space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">
                          {review.customerName}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={
                                index < review.rating
                                  ? "size-3.5 fill-accent text-accent"
                                  : "size-3.5 text-muted-foreground/40"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        “{review.comment}”
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
