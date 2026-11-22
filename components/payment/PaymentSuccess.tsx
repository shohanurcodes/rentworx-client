"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/page-loader";
import { ApiRequestError } from "@/lib/api";
import { fetchBookingStatus } from "@/lib/booking-api";
import { safeNextPath } from "@/lib/redirect";
import type { BookingSummary } from "@/lib/types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PaymentSuccess() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") ?? "";
  const sessionId = searchParams.get("session_id") ?? "";

  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needsSignIn, setNeedsSignIn] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setError("No booking reference was provided.");
      setLoading(false);
      return;
    }

    let active = true;
    let timer: number | undefined;
    let attempts = 0;

    async function load() {
      try {
        const response = await fetchBookingStatus(bookingId);

        if (!active) return;

        setBooking(response.data);
        setError("");

        // The webhook may still be processing when the browser returns.
        if (response.data.paymentStatus === "pending" && attempts < 5) {
          attempts += 1;
          timer = window.setTimeout(load, 1500);
        }
      } catch (caught) {
        if (!active) return;

        if (caught instanceof ApiRequestError && caught.status === 401) {
          setNeedsSignIn(true);
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load booking status.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
      if (timer) window.clearTimeout(timer);
    };
  }, [bookingId]);

  if (loading) {
    return <PageLoader label="Confirming your payment..." />;
  }

  if (needsSignIn) {
    const next = safeNextPath(
      `/payment/success?session_id=${encodeURIComponent(sessionId)}&bookingId=${encodeURIComponent(bookingId)}`,
      "/dashboard",
    );

    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <CreditCard className="size-10 text-primary" />
        <h1 className="mt-5 text-2xl font-bold">Sign in to see your booking</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We found your checkout reference, but you need to be signed in to view
          the booking details.
        </p>
        <Button asChild className="mt-6">
          <Link href={`/login?next=${encodeURIComponent(next)}`}>
            Sign in
            <ArrowRight />
          </Link>
        </Button>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <XCircle className="size-10 text-destructive" />
        <h1 className="mt-5 text-2xl font-bold">Could not confirm payment</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {error || "We could not find this booking."}
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    );
  }

  const paid = booking.paymentStatus === "paid";
  const cancelled =
    booking.paymentStatus === "failed" || booking.bookingStatus === "cancelled";
  const pending = !paid && !cancelled;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="text-center">
        <div
          className={`mx-auto grid size-16 place-items-center rounded-full ${
            paid
              ? "bg-primary/10 text-primary"
              : pending
                ? "bg-accent/15 text-accent"
                : "bg-destructive/10 text-destructive"
          }`}
        >
          {paid ? (
            <CheckCircle2 className="size-8" />
          ) : pending ? (
            <Clock3 className="size-8" />
          ) : (
            <XCircle className="size-8" />
          )}
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">
          {paid
            ? "Payment confirmed"
            : pending
              ? "Confirming your payment"
              : "Payment not completed"}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          {paid
            ? "Your rental is confirmed. Keep this reference for your records."
            : pending
              ? "Stripe has redirected you back. We are waiting for the payment confirmation webhook — this page updates automatically."
              : "No charge was completed for this booking. You can browse again or contact support if you were charged."}
        </p>
      </div>

      <Card className="mt-9">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Booking reference
              </p>
              <p className="mt-1 font-mono text-sm">{booking.id}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={paid ? "accent" : "secondary"}>
                {booking.paymentStatus}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {booking.bookingStatus}
              </Badge>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            {booking.equipmentInfo.image ? (
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
                <Image
                  src={booking.equipmentInfo.image}
                  alt={booking.equipmentInfo.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="grid size-20 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-muted-foreground">
                <Package className="size-8" />
              </div>
            )}

            <div>
              <p className="text-lg font-bold">{booking.equipmentInfo.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                {booking.equipmentInfo.location ?? "Location shared by owner"}
              </p>
              <p className="mt-1 text-sm capitalize text-muted-foreground">
                {booking.duration} {booking.rentalType} period(s) ·{" "}
                {booking.requiredQuantity} unit(s)
              </p>
            </div>
          </div>

          <dl className="mt-7 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Start date
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {formatDate(booking.startDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                End date
              </dt>
              <dd className="mt-1 text-sm font-semibold">
                {formatDate(booking.endDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total
              </dt>
              <dd className="mt-1 text-lg font-bold text-primary">
                ${booking.totalAmount.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Transaction ID
              </dt>
              <dd className="mt-1 break-all font-mono text-xs font-semibold">
                {booking.transactionId ?? "Pending"}
              </dd>
            </div>
          </dl>

          {paid && (
            <p className="mt-7 flex items-start gap-2 rounded-xl bg-primary/10 p-4 text-sm leading-6 text-primary">
              <CreditCard className="mt-0.5 size-4 shrink-0" />
              Payment received. The owner has been notified and will coordinate
              handover with you.
            </p>
          )}
        </CardContent>
      </Card>

      {sessionId && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Stripe session: <span className="font-mono">{sessionId}</span>
        </p>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/dashboard">
            View dashboard
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/all-equipment">Browse more equipment</Link>
        </Button>
      </div>
    </div>
  );
}
