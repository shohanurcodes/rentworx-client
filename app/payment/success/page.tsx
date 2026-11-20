import type { Metadata } from "next";
import { Suspense } from "react";

import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { PageLoader } from "@/components/ui/page-loader";

export const metadata: Metadata = {
  title: "Payment Confirmation",
  description: "Confirm your RentWorx rental payment and booking details.",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PageLoader label="Confirming your payment..." />}>
      <PaymentSuccess />
    </Suspense>
  );
}
