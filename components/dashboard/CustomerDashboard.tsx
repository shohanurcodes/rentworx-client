"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  ReceiptText,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/StatCard";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/page-loader";
import { fetchMyBookings } from "@/lib/booking-api";
import { fetchFavorites } from "@/lib/favorites-api";
import type { BookingSummary, FeaturedEquipment } from "@/lib/types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CustomerDashboard() {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [favorites, setFavorites] = useState<FeaturedEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([fetchMyBookings(), fetchFavorites()])
      .then(([bookingResponse, favoriteResponse]) => {
        if (!active) return;
        setBookings(bookingResponse.data);
        setFavorites(favoriteResponse.data);
      })
      .catch(() => {
        if (active) {
          setBookings([]);
          setFavorites([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <PageLoader label="Loading your rentals..." />;
  }

  const paidCount = bookings.filter((item) => item.paymentStatus === "paid").length;

  return (
    <div className="space-y-10">
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          label="Total rentals"
          value={bookings.length}
          hint="All time bookings"
          icon={ReceiptText}
        />
        <StatCard
          label="Paid rentals"
          value={paidCount}
          hint="Confirmed with Stripe"
          icon={CheckCircle2}
        />
        <StatCard
          label="Favorites"
          value={favorites.length}
          hint="Saved equipment"
          icon={Heart}
        />
      </div>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Your recent rentals</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track payment and booking status in one place.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/all-equipment">
              Find equipment
              <ArrowRight />
            </Link>
          </Button>
        </div>

        {bookings.length ? (
          <div className="mt-5 space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <Card key={booking.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-semibold">
                      {booking.equipmentInfo.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(booking.startDate)} –{" "}
                      {formatDate(booking.endDate)} · {booking.duration}{" "}
                      {booking.rentalType} period(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        booking.paymentStatus === "paid" ? "accent" : "secondary"
                      }
                    >
                      {booking.paymentStatus}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {booking.bookingStatus}
                    </Badge>
                    <Button asChild variant="ghost" size="sm">
                      <Link
                        href={`/payment/success?bookingId=${booking.id}`}
                      >
                        Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-5">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                You have not booked any equipment yet.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold">Saved equipment</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Quick access to the gear you favorited.
        </p>
        {favorites.length ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.slice(0, 6).map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Card className="mt-5">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Tap the heart on any listing to save it here.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
