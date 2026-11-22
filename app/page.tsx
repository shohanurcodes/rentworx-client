import { Categories } from "@/components/home/Categories";
import { FeaturedEquipment } from "@/components/home/FeaturedEquipment";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { OwnerCta } from "@/components/home/OwnerCta";
import { Reviews } from "@/components/home/Reviews";
import { TrustStrip } from "@/components/home/TrustStrip";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedEquipment />
      <Categories />
      <HowItWorks />
      <WhyChooseUs />
      <Reviews />
      <OwnerCta />
    </>
  );
}
