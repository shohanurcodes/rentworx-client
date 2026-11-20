"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, CreditCard, Loader2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCheckoutSession } from "@/lib/booking-api";
import { useAuth } from "@/providers/AuthProvider";
import type { Equipment } from "@/lib/types";

const checkoutSchema = z
  .object({
    startDate: z.string().min(1, "Choose a start date"),
    endDate: z.string().min(1, "Choose an end date"),
    requiredQuantity: z.coerce.number().int().positive(),
    contactNumber: z.string().trim().min(6, "Enter a valid contact number"),
    deliveryAddress: z.string().trim().min(3, "Enter a delivery address"),
    notes: z.string().trim().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after the start date",
      });
    }
  });

function calculateDuration(
  startDate: string,
  endDate: string,
  rentalType: Equipment["rentalType"],
) {
  if (!startDate || !endDate) return 0;

  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();

  if (!Number.isFinite(diff) || diff <= 0) return 0;

  const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
  const divisor = rentalType === "weekly" ? 7 : rentalType === "monthly" ? 30 : 1;

  return Math.max(1, Math.ceil(days / divisor));
}

export function BookingModal({
  equipment,
  children,
}: {
  equipment: Equipment;
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    startDate: "",
    endDate: "",
    requiredQuantity: 1,
    contactNumber: user?.phone ?? "",
    deliveryAddress: user?.address ?? "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  const duration = useMemo(
    () =>
      calculateDuration(values.startDate, values.endDate, equipment.rentalType),
    [values.startDate, values.endDate, equipment.rentalType],
  );

  const estimate = useMemo(
    () =>
      Math.round(equipment.price * duration * values.requiredQuantity * 100) /
      100,
    [equipment.price, duration, values.requiredQuantity],
  );

  const update = <K extends keyof typeof values>(key: K, value: (typeof values)[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const parsed = checkoutSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};

      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        nextErrors[key] = issue.message;
      }

      setErrors(nextErrors);
      return;
    }

    try {
      setSubmitting(true);
      const response = await createCheckoutSession({
        equipmentId: equipment.id,
        ...parsed.data,
      });

      if (!response.data.url) {
        throw new Error("No checkout URL was returned");
      }

      window.location.assign(response.data.url);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reserve {equipment.name}</DialogTitle>
          <DialogDescription>
            Choose your rental dates and contact details. You will be redirected
            to Stripe to complete payment securely.
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="rounded-xl border border-border bg-secondary/50 p-5 text-center">
            <p className="text-sm font-medium">Sign in to create a booking.</p>
            <Button asChild className="mt-4">
              <Link
                href={`/login?next=${encodeURIComponent(`/equipment/${equipment.id}`)}`}
              >
                Sign in to continue
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start date</Label>
                <Input
                  id="start-date"
                  type="date"
                  min={today}
                  value={values.startDate}
                  onChange={(event) => update("startDate", event.target.value)}
                />
                {errors.startDate && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End date</Label>
                <Input
                  id="end-date"
                  type="date"
                  min={values.startDate || today}
                  value={values.endDate}
                  onChange={(event) => update("endDate", event.target.value)}
                />
                {errors.endDate && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={equipment.availableQuantity}
                value={values.requiredQuantity}
                onChange={(event) =>
                  update("requiredQuantity", Number(event.target.value))
                }
              />
              <p className="text-xs text-muted-foreground">
                {equipment.availableQuantity} unit(s) currently available
              </p>
              {errors.requiredQuantity && (
                <p className="text-xs font-medium text-destructive">
                  {errors.requiredQuantity}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-number">Contact number</Label>
                <Input
                  id="contact-number"
                  value={values.contactNumber}
                  onChange={(event) =>
                    update("contactNumber", event.target.value)
                  }
                  placeholder="+1 555 0100"
                />
                {errors.contactNumber && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.contactNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-address">Delivery address</Label>
                <Input
                  id="delivery-address"
                  value={values.deliveryAddress}
                  onChange={(event) =>
                    update("deliveryAddress", event.target.value)
                  }
                  placeholder="Where should the equipment be delivered?"
                />
                {errors.deliveryAddress && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.deliveryAddress}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-notes">Notes (optional)</Label>
              <Textarea
                id="booking-notes"
                value={values.notes}
                onChange={(event) => update("notes", event.target.value)}
                placeholder="Anything the owner should know"
              />
            </div>

            <div className="rounded-xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" />
                  {duration > 0
                    ? `${duration} ${equipment.rentalType} period(s)`
                    : "Select valid dates"}
                </span>
                <span className="font-semibold">
                  ${equipment.price.toLocaleString()} / {equipment.rentalType}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-semibold">Estimated total</span>
                <span className="text-2xl font-bold text-primary">
                  ${estimate.toLocaleString()}
                </span>
              </div>
            </div>

            {formError && (
              <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {formError}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CreditCard />
                )}
                {submitting ? "Redirecting..." : "Continue to payment"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
