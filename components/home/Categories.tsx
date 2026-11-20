import Link from "next/link";
import {
  Building2,
  Camera,
  Laptop,
  Sparkles,
  Tractor,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/home/SectionHeading";

const categories: {
  name: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}[] = [
  {
    name: "Construction Equipment",
    description: "Excavators, lifts, generators, and tools",
    icon: Building2,
    accent: "from-amber-500/20 to-orange-500/5 text-amber-600",
  },
  {
    name: "Photography Equipment",
    description: "Cinema cameras, lenses, lights, and drones",
    icon: Camera,
    accent: "from-violet-500/20 to-fuchsia-500/5 text-violet-600",
  },
  {
    name: "Vehicles & Transportation",
    description: "Vans, trucks, and crew transport",
    icon: Truck,
    accent: "from-sky-500/20 to-blue-500/5 text-sky-600",
  },
  {
    name: "Agriculture Equipment",
    description: "Tractors, tillers, and farm machinery",
    icon: Tractor,
    accent: "from-emerald-500/20 to-green-500/5 text-emerald-600",
  },
  {
    name: "Electronics",
    description: "Workstations, audio, and production tech",
    icon: Laptop,
    accent: "from-cyan-500/20 to-teal-500/5 text-cyan-600",
  },
  {
    name: "Event Equipment",
    description: "LED walls, staging, lighting, and sound",
    icon: Sparkles,
    accent: "from-rose-500/20 to-pink-500/5 text-rose-600",
  },
];

export function Categories() {
  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Browse by category"
          title="Find gear for every kind of work"
          description="From heavy machinery to production kits, every listing is organised so you can compare options quickly."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/all-equipment?category=${encodeURIComponent(category.name)}`}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div
                className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br ${category.accent}`}
              >
                <category.icon className="size-6" />
              </div>
              <h3 className="mt-5 text-base font-bold text-foreground">
                {category.name}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {category.description}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Explore listings →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
