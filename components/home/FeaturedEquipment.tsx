"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { EquipmentCard } from "@/components/equipment/equipment-card";
import { SectionHeading } from "@/components/home/SectionHeading";
import { loadFeaturedEquipment } from "@/lib/home-data";
import type { FeaturedEquipment } from "@/lib/types";

export function FeaturedEquipment() {
  const [items, setItems] = useState<FeaturedEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    loadFeaturedEquipment().then((data) => {
      if (active) {
        setItems(data);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="featured" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        eyebrow="Featured equipment"
        title="Popular picks for your next project"
        description="Handpicked listings from verified owners, ready to book with clear terms and transparent daily or weekly rates."
        actionHref="/all-equipment"
        actionLabel="Browse all equipment"
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[360px] animate-pulse rounded-2xl border border-border bg-secondary"
              />
            ))
          : items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <EquipmentCard item={item} />
              </motion.div>
            ))}
      </div>
    </section>
  );
}
