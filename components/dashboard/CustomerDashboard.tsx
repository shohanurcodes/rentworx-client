"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, ReceiptText } from "lucide-react";
import { toast } from "sonner";

import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { ProfilePanel } from "@/components/dashboard/ProfilePanel";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { fetchMyBookings } from "@/lib/booking-api";
import { fetchFavorites } from "@/lib/favorites-api";
import type { BookingSummary, FeaturedEquipment } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";
import { useFavorites } from "@/providers/FavoritesProvider";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function money(value: number) {
  return `$${value.toLocaleString()}`;
}

export function CustomerDashboard() {
  const { user } = useAuth();
  const { toggleFavorite } = useFavorites();
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

  async function handleRemoveFavorite(id: string) {
    try {
      await toggleFavorite(id);
      setFavorites((current) => current.filter((item) => item.id !== id));
    } catch {
      toast.error("Unable to remove this favorite");
    }
  }

  if (loading) {
    return <PageLoader label="Loading your rentals..." />;
  }

  const paidCount = bookings.filter((item) => item.paymentStatus === "paid").length;

  const bookingColumns: DataTableColumn<BookingSummary>[] = [
    {
      key: "equipment",
      label: "Equipment Name",
      render: (booking) => (
        <span className="font-semibold">{booking.equipmentInfo.name}</span>
      ),
    },
    {
      key: "start",
      label: "Rental Start Date",
      render: (booking) => formatDate(booking.startDate),
    },
    {
      key: "end",
      label: "Rental End Date",
      render: (booking) => formatDate(booking.endDate),
    },
    {
      key: "booked",
      label: "Booking Date",
      render: (booking) => formatDate(booking.bookingDate ?? booking.createdAt),
    },
    {
      key: "total",
      label: "Total Amount",
      render: (booking) => (
        <span className="font-semibold">{money(booking.totalAmount)}</span>
      ),
    },
    {
      key: "payment",
      label: "Payment Status",
      render: (booking) => (
        <Badge
          variant={booking.paymentStatus === "paid" ? "accent" : "secondary"}
          className="capitalize"
        >
          {booking.paymentStatus}
        </Badge>
      ),
    },
    {
      key: "booking",
      label: "Booking Status",
      render: (booking) => (
        <Badge variant="outline" className="capitalize">
          {booking.bookingStatus}
        </Badge>
      ),
    },
  ];

  const favoriteColumns: DataTableColumn<FeaturedEquipment>[] = [
    {
      key: "equipment",
      label: "Equipment",
      render: (item) => (
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.location}</p>
        </div>
      ),
    },
    { key: "category", label: "Category", render: (item) => item.category },
    {
      key: "price",
      label: "Price",
      render: (item) => `${money(item.price)} / ${item.rentalType}`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/equipment/${item.id}`}>View Details</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => handleRemoveFavorite(item.id)}
          >
            Remove Favorite
          </Button>
        </div>
      ),
    },
  ];

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
            <h2 className="text-xl font-bold">My rentals</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every booking with its payment and rental status.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/all-equipment">
              Find equipment
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <DataTable
          columns={bookingColumns}
          rows={bookings}
          rowKey={(booking) => booking.id}
          empty="You have not booked any equipment yet."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold">Favorites</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Equipment you saved for later, with quick actions.
        </p>

        <DataTable
          columns={favoriteColumns}
          rows={favorites}
          rowKey={(item) => item.id}
          empty="Tap the heart on any listing to save it here."
        />
      </section>

      {user && <ProfilePanel user={user} />}
    </div>
  );
}
