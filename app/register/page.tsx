import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your RentWorx account.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start renting trusted equipment or list your own in minutes."
    >
      <RegisterForm />
    </AuthShell>
  );
}
