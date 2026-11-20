import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogClient } from "@/components/catalog/CatalogClient";
import { PageLoader } from "@/components/ui/page-loader";

export const metadata: Metadata = {
  title: "All Equipment",
  description: "Browse and filter verified equipment on RentWorx.",
};

export default function AllEquipmentPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading equipment..." />}>
      <CatalogClient />
    </Suspense>
  );
}
