"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchMe, updateProfile } from "@/lib/dashboard-api";
import type { AuthUser } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";

type ProfileForm = {
  name: string;
  image: string;
  phone: string;
  address: string;
};

function toForm(user: AuthUser): ProfileForm {
  return {
    name: user.name ?? "",
    image: user.image ?? "",
    phone: user.phone ?? "",
    address: user.address ?? "",
  };
}

export function ProfilePanel({ user }: { user: AuthUser }) {
  const { refresh } = useAuth();
  const [profile, setProfile] = useState<AuthUser>(user);
  const [form, setForm] = useState<ProfileForm>(() => toForm(user));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    fetchMe()
      .then((response) => {
        if (!active) return;
        setProfile(response.data);
        setForm(toForm(response.data));
      })
      .catch(() => {
        // Keep the session user as a fallback.
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function update<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    if (form.image.trim() && !/^https?:\/\//i.test(form.image.trim())) {
      toast.error("Profile image must be a valid URL");
      return;
    }

    try {
      setSaving(true);

      const response = await updateProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        image: form.image.trim() || undefined,
      });

      setProfile(response.data);
      setForm(toForm(response.data));
      await refresh();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update profile",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-primary/10 text-primary">
          {profile.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.image}
              alt={profile.name}
              className="size-full object-cover"
            />
          ) : (
            <UserRound className="size-7" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">My profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep your contact details current so owners and renters can reach you.
          </p>
        </div>
      </div>

      <Card className="mt-5">
        <CardContent className="p-6">
          {loading ? (
            <div className="h-64 animate-pulse rounded-xl bg-secondary" />
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email address</Label>
                <Input id="profile-email" value={profile.email} disabled />
                <p className="text-xs text-muted-foreground">
                  Email is managed by your sign-in provider.
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profile-image">Profile image URL</Label>
                <Input
                  id="profile-image"
                  value={form.image}
                  onChange={(event) => update("image", event.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone number</Label>
                <Input
                  id="profile-phone"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  placeholder="+1 555 0100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-address">Address</Label>
                <Input
                  id="profile-address"
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                  placeholder="City, country"
                />
              </div>

              <div className="flex items-center justify-end gap-3 md:col-span-2">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save />
                  )}
                  {saving ? "Saving..." : "Save profile"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
