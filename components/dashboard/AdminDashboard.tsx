"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarCheck2,
  CheckCircle2,
  CircleDollarSign,
  Package,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/ui/page-loader";
import {
  changeUserRole,
  fetchAdminAnalytics,
  fetchAdminBookings,
  fetchAdminEquipment,
  fetchUsers,
  setEquipmentStatus,
  setUserActive,
} from "@/lib/dashboard-api";
import type {
  AdminAnalytics,
  AuthUser,
  BookingSummary,
  ManageEquipment,
  UserRole,
} from "@/lib/types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [equipment, setEquipment] = useState<ManageEquipment[]>([]);
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
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
      .catch(() => {
        if (active) toast.error("Unable to load the admin dashboard");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [load]);

  async function handleEquipmentStatus(id: string, status: "approved" | "rejected") {
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

  if (loading) {
    return <PageLoader label="Loading admin workspace..." />;
  }

  const pendingEquipment = equipment.filter((item) => item.status === "pending");
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()),
  );

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
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardContent className="p-5">
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
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
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
            </CardContent>
          </Card>
        </div>
      )}

      <section>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-primary" />
          <h2 className="text-xl font-bold">Approval queue</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Review newly submitted listings before they appear in the catalog.
        </p>

        {pendingEquipment.length ? (
          <div className="mt-5 space-y-3">
            {pendingEquipment.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.ownerInfo.name} · {item.category} · {item.location}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEquipmentStatus(item.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEquipmentStatus(item.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mt-5">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No listings are waiting for review.
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold">All bookings</h2>
        <div className="mt-5 space-y-3">
          {bookings.slice(0, 10).map((booking) => (
            <Card key={booking.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold">{booking.equipmentInfo.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {booking.customerInfo.name} · Owner: {booking.ownerInfo.name} ·{" "}
                    {formatDate(booking.startDate)} · $
                    {booking.totalAmount.toLocaleString()}
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
                </div>
              </CardContent>
            </Card>
          ))}
          {!bookings.length && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No bookings have been made yet.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">User management</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Change roles and disable accounts when needed.
            </p>
          </div>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users"
            className="max-w-64"
          />
        </div>

        <div className="mt-5 space-y-3">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={user.isActive ? "accent" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <select
                    aria-label={`Role for ${user.name}`}
                    value={user.role}
                    onChange={(event) =>
                      handleRole(user.id, event.target.value as UserRole)
                    }
                    className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleActive(user.id, !user.isActive)}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!filteredUsers.length && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No users matched your search.
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
