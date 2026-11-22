"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  CheckCircle2,
  CircleDollarSign,
  Package,
  Trash2,
  Users,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLoader } from "@/components/ui/page-loader";
import {
  changeUserRole,
  deleteEquipment,
  deleteUser,
  fetchAdminAnalytics,
  fetchAdminBookings,
  fetchAdminEquipment,
  fetchUsers,
  setEquipmentStatus,
  setUserActive,
  updateEquipment,
} from "@/lib/dashboard-api";
import type {
  AdminAnalytics,
  AuthUser,
  BookingSummary,
  ManageEquipment,
  UserRole,
} from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type EquipmentForm = {
  name: string;
  price: string;
  availableQuantity: string;
  status: ManageEquipment["status"];
};

export function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [equipment, setEquipment] = useState<ManageEquipment[]>([]);
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [originalStatus, setOriginalStatus] =
    useState<ManageEquipment["status"]>("pending");
  const [form, setForm] = useState<EquipmentForm>({
    name: "",
    price: "",
    availableQuantity: "",
    status: "pending",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    await refreshAccessToken();

    const [analyticsResponse, equipmentResponse, bookingsResponse, usersResponse] =
      await Promise.all([
        fetchAdminAnalytics(),
        fetchAdminEquipment(),
        fetchAdminBookings(),
        fetchUsers(),
      ]);

    setAnalytics(analyticsResponse.data);
    setEquipment(equipmentResponse.data);
    setBookings(bookingsResponse.data);
    setUsers(usersResponse.data);
  }, []);

  useEffect(() => {
    let active = true;

    load()
      .catch((error: unknown) => {
        if (active) {
          toast.error(
            error instanceof Error && error.message
              ? error.message
              : "Unable to load the admin dashboard",
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

  async function handleEquipmentStatus(
    id: string,
    status: "approved" | "rejected",
  ) {
    try {
      await setEquipmentStatus(id, status);
      toast.success(`Listing ${status}`);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  }

  async function handleRole(id: string, role: UserRole) {
    try {
      await changeUserRole(id, role);
      toast.success(`Role changed to ${role}`);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  }

  async function handleActive(id: string, isActive: boolean) {
    try {
      await setUserActive(id, isActive);
      toast.success(isActive ? "Account activated" : "Account deactivated");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  }

  async function handleDeleteUser(id: string) {
    if (!window.confirm("Delete this user account?")) return;

    try {
      await deleteUser(id);
      toast.success("User deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  async function handleDeleteEquipment(id: string) {
    if (!window.confirm("Delete this equipment listing?")) return;

    try {
      await deleteEquipment(id);
      toast.success("Equipment deleted");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  function openEquipmentEdit(item: ManageEquipment) {
    setEditId(item.id);
    setOriginalStatus(item.status);
    setForm({
      name: item.name,
      price: String(item.price),
      availableQuantity: String(item.availableQuantity ?? 0),
      status: item.status,
    });
    setDialogOpen(true);
  }

  async function handleEquipmentSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editId) return;

    try {
      setSaving(true);

      await updateEquipment(editId, {
        name: form.name.trim(),
        price: Number(form.price),
        availableQuantity: Number(form.availableQuantity),
      });

      if (form.status !== originalStatus && form.status !== "pending") {
        await setEquipmentStatus(editId, form.status);
      }

      toast.success("Equipment updated");
      setDialogOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PageLoader label="Loading admin workspace..." />;
  }

  const filteredUsers = users.filter((item) =>
    `${item.name} ${item.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  const equipmentColumns: DataTableColumn<ManageEquipment>[] = [
    {
      key: "name",
      label: "Equipment",
      render: (item) => (
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.category}</p>
        </div>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      render: (item) => item.ownerInfo.name,
    },
    {
      key: "price",
      label: "Price",
      render: (item) => `$${item.price.toLocaleString()} / ${item.rentalType}`,
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
          {item.status !== "approved" && (
            <Button
              size="sm"
              onClick={() => handleEquipmentStatus(item.id, "approved")}
            >
              Approve
            </Button>
          )}
          {item.status !== "rejected" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEquipmentStatus(item.id, "rejected")}
            >
              Reject
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openEquipmentEdit(item)}
          >
            Update
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive"
            onClick={() => handleDeleteEquipment(item.id)}
          >
            <Trash2 />
            Delete
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href={`/equipment/${item.id}`}>View</Link>
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
      key: "owner",
      label: "Owner Information",
      render: (booking) => booking.ownerInfo.name,
    },
    {
      key: "equipment",
      label: "Equipment Name",
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
  ];

  const userColumns: DataTableColumn<AuthUser>[] = [
    {
      key: "name",
      label: "Name",
      render: (item) => <span className="font-semibold">{item.name}</span>,
    },
    { key: "email", label: "Email", render: (item) => item.email },
    {
      key: "role",
      label: "Role",
      render: (item) => (
        <select
          aria-label={`Role for ${item.name}`}
          value={item.role}
          onChange={(event) => handleRole(item.id, event.target.value as UserRole)}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="customer">Customer</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
    {
      key: "registered",
      label: "Registration Date",
      render: (item) =>
        item.createdAt ? formatDate(item.createdAt) : "—",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <Badge variant={item.isActive ? "accent" : "destructive"}>
          {item.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleActive(item.id, !item.isActive)}
          >
            {item.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive"
            onClick={() => handleDeleteUser(item.id)}
          >
            <Trash2 />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Users"
          value={analytics?.users.total ?? users.length}
          hint={`${analytics?.users.owners ?? 0} owners`}
          icon={Users}
        />
        <StatCard
          label="Equipment"
          value={analytics?.equipment.total ?? equipment.length}
          hint={`${analytics?.equipment.pending ?? 0} pending review`}
          icon={Package}
        />
        <StatCard
          label="Bookings"
          value={analytics?.bookings.total ?? bookings.length}
          hint={`${analytics?.bookings.confirmed ?? 0} confirmed`}
          icon={CalendarCheck2}
        />
        <StatCard
          label="Platform revenue"
          value={`$${(analytics?.revenue ?? 0).toLocaleString()}`}
          hint="From paid bookings"
          icon={CircleDollarSign}
        />
      </div>

      {analytics && (
        <>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-bold">Bookings by status</h2>
            <div className="mt-4">
              <AnalyticsChart
                label="Bookings"
                data={[
                  { name: "Pending", value: analytics.bookings.pending },
                  { name: "Confirmed", value: analytics.bookings.confirmed },
                  { name: "Completed", value: analytics.bookings.completed },
                  { name: "Cancelled", value: analytics.bookings.cancelled },
                ]}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-bold">Equipment approvals</h2>
            <div className="mt-4">
              <AnalyticsChart
                label="Listings"
                data={[
                  { name: "Approved", value: analytics.equipment.approved },
                  { name: "Pending", value: analytics.equipment.pending },
                  { name: "Rejected", value: analytics.equipment.rejected },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-bold">Monthly bookings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Booking volume across the platform, last 6 months.
            </p>
            <div className="mt-4">
              <AnalyticsChart
                label="Bookings"
                data={analytics.monthlyBookings.map((point) => ({
                  name: point.month,
                  value: point.bookings,
                }))}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-bold">Monthly revenue</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Revenue from paid bookings, last 6 months.
            </p>
            <div className="mt-4">
              <AnalyticsChart
                label="Revenue"
                prefix="$"
                data={analytics.monthlyRevenue.map((point) => ({
                  name: point.month,
                  value: point.revenue,
                }))}
              />
            </div>
          </div>
        </div>
        </>
      )}

      <section>
        <div className="flex flex-wrap items-center gap-2">
          <CheckCircle2 className="size-5 text-primary" />
          <h2 className="text-xl font-bold">All equipment</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve, reject, update, or remove any listing on the platform.
        </p>

        <DataTable
          columns={equipmentColumns}
          rows={equipment}
          rowKey={(item) => item.id}
          empty="No equipment has been listed yet."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold">All rentals</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor every booking across customers, owners, and equipment.
        </p>

        <DataTable
          columns={bookingColumns}
          rows={bookings}
          rowKey={(booking) => booking.id}
          empty="No bookings have been made yet."
        />
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">All users</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Change roles and manage registered accounts.
            </p>
          </div>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users"
            className="max-w-64"
          />
        </div>

        <DataTable
          columns={userColumns}
          rows={filteredUsers}
          rowKey={(item) => item.id}
          empty="No users matched your search."
        />
      </section>

      {user && <ProfilePanel user={user} />}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Update equipment</DialogTitle>
            <DialogDescription>
              Edit listing basics and review status as an administrator.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEquipmentSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-equip-name">Equipment name</Label>
              <Input
                id="admin-equip-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-equip-price">Rental price</Label>
                <Input
                  id="admin-equip-price"
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-equip-quantity">Available quantity</Label>
                <Input
                  id="admin-equip-quantity"
                  type="number"
                  min={0}
                  value={form.availableQuantity}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      availableQuantity: event.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-equip-status">Status</Label>
              <select
                id="admin-equip-status"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as ManageEquipment["status"],
                  }))
                }
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
