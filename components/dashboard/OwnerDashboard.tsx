"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  CircleDollarSign,
  Clock3,
  Package,
  Pencil,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { refreshAccessToken } from "@/lib/auth-client";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/dashboard/DataTable";
import { ProfilePanel } from "@/components/dashboard/ProfilePanel";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { PageLoader } from "@/components/ui/page-loader";
import { Textarea } from "@/components/ui/textarea";
import { EQUIPMENT_CATEGORIES, RENTAL_TYPES } from "@/lib/categories";
import {
  createEquipment,
  deleteEquipment,
  fetchMyEquipment,
  fetchOwnerAnalytics,
  fetchOwnerBookings,
  updateBookingStatus,
  updateEquipment,
  uploadImage,
} from "@/lib/dashboard-api";
import type {
  BookingSummary,
  EquipmentPayload,
  ManageEquipment,
  OwnerAnalytics,
} from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";

const emptyForm: EquipmentPayload = {
  name: "",
  description: "",
  category: EQUIPMENT_CATEGORIES[0],
  location: "",
  price: 0,
  rentalType: "daily",
  quantity: 1,
  availableQuantity: 1,
  condition: "Good",
  brand: "",
  model: "",
  image: "",
  terms: "",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OwnerDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<OwnerAnalytics | null>(null);
  const [equipment, setEquipment] = useState<ManageEquipment[]>([]);
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EquipmentPayload>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    await refreshAccessToken();

    const [analyticsResponse, equipmentResponse, bookingsResponse] =
      await Promise.all([
        fetchOwnerAnalytics(),
        fetchMyEquipment(),
        fetchOwnerBookings(),
      ]);

    setAnalytics(analyticsResponse.data);
    setEquipment(equipmentResponse.data);
    setBookings(bookingsResponse.data);
  }, []);

  useEffect(() => {
    let active = true;

    load()
      .catch((error: unknown) => {
        if (active) {
          toast.error(
            error instanceof Error && error.message
              ? error.message
              : "Unable to load your owner dashboard",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [load]);

  function update<K extends keyof EquipmentPayload>(
    key: K,
    value: EquipmentPayload[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setDialogOpen(true);
  }

  function openEdit(item: ManageEquipment) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      location: item.location,
      price: item.price,
      rentalType: item.rentalType,
      quantity: item.quantity,
      availableQuantity: item.availableQuantity ?? 0,
      condition: item.condition,
      brand: item.brand,
      model: item.model,
      image: item.image,
      terms: item.terms,
    });
    setFormError("");
    setDialogOpen(true);
  }

  async function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to read the image"));
        reader.readAsDataURL(file);
      });

      const response = await uploadImage(dataUrl);
      update("image", response.data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    try {
      setSaving(true);

      if (editingId) {
        await updateEquipment(editingId, form);
        toast.success("Equipment updated");
      } else {
        await createEquipment(form);
        toast.success("Equipment submitted for admin review");
      }

      setDialogOpen(false);
      await load();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save equipment";
      setFormError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this equipment listing?")) return;

    try {
      await deleteEquipment(id);
      toast.success("Equipment deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  async function handleBookingStatus(
    id: string,
    bookingStatus: "confirmed" | "completed" | "cancelled",
  ) {
    try {
      await updateBookingStatus(id, bookingStatus);
      toast.success(`Booking marked ${bookingStatus}`);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  }

  const equipmentColumns: DataTableColumn<ManageEquipment>[] = [
    {
      key: "name",
      label: "Equipment Name",
      render: (item) => (
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.category}</p>
        </div>
      ),
    },
    { key: "category", label: "Category", render: (item) => item.category },
    {
      key: "price",
      label: "Rental Price",
      render: (item) => `$${item.price.toLocaleString()} / ${item.rentalType}`,
    },
    {
      key: "quantity",
      label: "Available Quantity",
      render: (item) => `${item.availableQuantity ?? 0} / ${item.quantity}`,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge
          variant={
            item.status === "approved"
              ? "accent"
              : item.status === "pending"
                ? "secondary"
                : "destructive"
          }
          className="capitalize"
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/equipment/${item.id}`}>View</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
            <Pencil />
            Update
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => handleDelete(item.id)}
          >
            <Trash2 />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const bookingColumns: DataTableColumn<BookingSummary>[] = [
    {
      key: "customer",
      label: "Customer Information",
      render: (booking) => (
        <div>
          <p className="font-semibold">{booking.customerInfo.name}</p>
          <p className="text-xs text-muted-foreground">
            {booking.customerInfo.email ?? "—"}
          </p>
        </div>
      ),
    },
    {
      key: "equipment",
      label: "Equipment Information",
      render: (booking) => booking.equipmentInfo.name,
    },
    {
      key: "duration",
      label: "Rental Duration",
      render: (booking) => (
        <div>
          <p>
            {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
          </p>
          <p className="text-xs text-muted-foreground">
            {booking.duration} {booking.rentalType} period(s)
          </p>
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Required Quantity",
      render: (booking) => booking.requiredQuantity,
    },
    {
      key: "amount",
      label: "Booking Amount",
      render: (booking) => `$${booking.totalAmount.toLocaleString()}`,
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
    {
      key: "actions",
      label: "Actions",
      render: (booking) =>
        booking.bookingStatus === "completed" ||
        booking.bookingStatus === "cancelled" ? (
          <span className="text-xs text-muted-foreground">Finalized</span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleBookingStatus(booking.id, "confirmed")}
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBookingStatus(booking.id, "completed")}
            >
              Complete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={() => handleBookingStatus(booking.id, "cancelled")}
            >
              Cancel
            </Button>
          </div>
        ),
    },
  ];

  if (loading) {
    return <PageLoader label="Loading owner workspace..." />;
  }

  return (
    <div className="space-y-10">
      <div id="overview" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Equipment"
          value={analytics?.equipment.total ?? equipment.length}
          hint={`${analytics?.equipment.approved ?? 0} approved`}
          icon={Package}
        />
        <StatCard
          label="Pending review"
          value={analytics?.equipment.pending ?? 0}
          hint="Awaiting admin approval"
          icon={Clock3}
        />
        <StatCard
          label="Bookings"
          value={analytics?.bookings.total ?? bookings.length}
          hint={`${analytics?.bookings.confirmed ?? 0} confirmed`}
          icon={CalendarCheck2}
        />
        <StatCard
          label="Revenue"
          value={`$${(analytics?.revenue ?? 0).toLocaleString()}`}
          hint="From paid rentals"
          icon={CircleDollarSign}
        />
      </div>

      {analytics && (
        <Card>
          <CardContent className="p-5">
            <h2 className="font-bold">Booking activity</h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              Your rental requests by current status.
            </p>
            <AnalyticsChart
              label="Bookings"
              data={[
                { name: "Pending", value: analytics.bookings.pending },
                { name: "Confirmed", value: analytics.bookings.confirmed },
                { name: "Completed", value: analytics.bookings.completed },
                { name: "Cancelled", value: analytics.bookings.cancelled },
              ]}
            />
          </CardContent>
        </Card>
      )}

      {analytics && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card id="earnings">
            <CardContent className="p-5">
              <h2 className="font-bold">Monthly earnings</h2>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                Completed Stripe payments, last 6 months.
              </p>
              <AnalyticsChart
                label="Earnings"
                prefix="$"
                data={analytics.monthlyEarnings.map((point) => ({
                  name: point.month,
                  value: point.earnings,
                }))}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h2 className="font-bold">Monthly bookings</h2>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                Rental requests for your equipment, last 6 months.
              </p>
              <AnalyticsChart
                label="Bookings"
                data={analytics.monthlyBookings.map((point) => ({
                  name: point.month,
                  value: point.bookings,
                }))}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <section id="equipment">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-bold">My equipment</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                New listings are reviewed by an admin before going live.
              </p>
            </div>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus />
                Add equipment
              </Button>
            </DialogTrigger>
          </div>

          <DataTable
            columns={equipmentColumns}
            rows={equipment}
            rowKey={(item) => item.id}
            empty="You have not listed any equipment yet."
          />
        </section>

        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit equipment" : "Add new equipment"}
            </DialogTitle>
            <DialogDescription>
              Provide accurate details so renters know exactly what they are
              booking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="equip-name">Name</Label>
                <Input
                  id="equip-name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equip-location">Location</Label>
                <Input
                  id="equip-location"
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equip-description">Description</Label>
              <Textarea
                id="equip-description"
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="equip-category">Category</Label>
                <select
                  id="equip-category"
                  value={form.category}
                  onChange={(event) => update("category", event.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {EQUIPMENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equip-rental">Rental type</Label>
                <select
                  id="equip-rental"
                  value={form.rentalType}
                  onChange={(event) =>
                    update(
                      "rentalType",
                      event.target.value as EquipmentPayload["rentalType"],
                    )
                  }
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {RENTAL_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="equip-price">Price per period</Label>
                <Input
                  id="equip-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(event) =>
                    update("price", Number(event.target.value))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equip-condition">Condition</Label>
                <Input
                  id="equip-condition"
                  value={form.condition}
                  onChange={(event) => update("condition", event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="equip-brand">Brand</Label>
                <Input
                  id="equip-brand"
                  value={form.brand}
                  onChange={(event) => update("brand", event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equip-model">Model</Label>
                <Input
                  id="equip-model"
                  value={form.model}
                  onChange={(event) => update("model", event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="equip-quantity">Total quantity</Label>
                <Input
                  id="equip-quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(event) =>
                    update("quantity", Number(event.target.value))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equip-available">Available quantity</Label>
                <Input
                  id="equip-available"
                  type="number"
                  min={0}
                  value={form.availableQuantity}
                  onChange={(event) =>
                    update("availableQuantity", Number(event.target.value))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equip-image">Image URL</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="equip-image"
                  value={form.image}
                  onChange={(event) => update("image", event.target.value)}
                  placeholder="https://..."
                  required
                />
                <Label
                  htmlFor="equip-upload"
                  className="inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 text-sm font-semibold"
                >
                  <UploadCloud className="size-4" />
                  {uploading ? "Uploading..." : "Upload"}
                </Label>
                <input
                  id="equip-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equip-terms">Rental terms</Label>
              <Textarea
                id="equip-terms"
                value={form.terms}
                onChange={(event) => update("terms", event.target.value)}
                required
              />
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
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || uploading}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Submit listing"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <section id="requests">
        <h2 className="font-heading text-xl font-bold">Rental requests</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm, complete, or cancel rentals for your equipment.
        </p>

        <DataTable
          columns={bookingColumns}
          rows={bookings}
          rowKey={(booking) => booking.id}
          empty="No rental requests yet."
        />
      </section>

      {user && <ProfilePanel user={user} />}
    </div>
  );
}
