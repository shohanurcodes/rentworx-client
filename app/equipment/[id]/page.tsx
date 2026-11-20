import type { Metadata } from "next";

import { EquipmentDetails } from "@/components/equipment/EquipmentDetails";

export const metadata: Metadata = {
  title: "Equipment Details",
  description: "View equipment details, availability, and rental terms.",
};

export default async function EquipmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EquipmentDetails id={id} />;
}
