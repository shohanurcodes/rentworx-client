"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Chrome, ImageIcon, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  image: z
    .string()
    .trim()
    .refine((value) => value === "" || z.url().safeParse(value).success, {
      message: "Enter a valid image URL",
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { user, isLoading, registerWithEmail, loginWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<RegisterValues>({
    defaultValues: { name: "", email: "", image: "", password: "" },
  });

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  const onSubmit = async (values: RegisterValues) => {
    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        form.setError(issue.path[0] as keyof RegisterValues, {
          message: issue.message,
        });
      }
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      setSubmitting(true);
      await registerWithEmail({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        image: parsed.data.image || undefined,
      });
      toast.success("Account created. Welcome to RentWorx!");
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      toast.info("Redirecting to Google...");
      await loginWithGoogle();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Google sign-up failed",
      );
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogle}
        disabled={googleLoading}
      >
        <Chrome />
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          or register with email
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              autoComplete="name"
              placeholder="Your name"
              className="pl-9"
              {...form.register("name")}
            />
          </div>
          {form.formState.errors.name && (
            <p className="text-xs font-medium text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="pl-9"
              {...form.register("email")}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-xs font-medium text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Profile photo URL (optional)</Label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/photo.jpg"
              className="pl-9"
              {...form.register("image")}
            />
          </div>
          {form.formState.errors.image && (
            <p className="text-xs font-medium text-destructive">
              {form.formState.errors.image.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className="pl-9"
              {...form.register("password")}
            />
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Must include an uppercase letter, a lowercase letter, and be at
            least 6 characters long.
          </p>
          {form.formState.errors.password && (
            <p className="text-xs font-medium text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" variant="accent" className="w-full" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
          {!submitting && <ArrowRight />}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-semibold text-amber-600 hover:underline dark:text-amber-400" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
