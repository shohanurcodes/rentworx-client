"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Chrome, LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeNextPath } from "@/lib/redirect";
import { useAuth } from "@/providers/AuthProvider";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, loginWithEmail, loginWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  const nextPath = safeNextPath(searchParams.get("next"));

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(nextPath);
    }
  }, [isLoading, user, nextPath, router]);

  const onSubmit = async (values: LoginValues) => {
    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        form.setError(issue.path[0] as keyof LoginValues, {
          message: issue.message,
        });
      }
      toast.error("Please check the highlighted fields");
      return;
    }

    try {
      setSubmitting(true);
      await loginWithEmail(parsed.data.email, parsed.data.password);
      toast.success("Welcome back to RentWorx");
      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
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
        error instanceof Error ? error.message : "Google sign-in failed",
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
          or use email
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="pl-9"
              {...form.register("password")}
            />
          </div>
          {form.formState.errors.password && (
            <p className="text-xs font-medium text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
          {!submitting && <ArrowRight />}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to RentWorx?{" "}
        <Link className="font-semibold text-primary hover:underline" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}
