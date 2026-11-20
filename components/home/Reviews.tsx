"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

import { SectionHeading } from "@/components/home/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { loadCustomerReviews } from "@/lib/home-data";
import type { CustomerReview } from "@/lib/types";

export function Reviews() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    loadCustomerReviews().then((data) => {
      if (active) {
        setReviews(data);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Customer stories"
          title="Trusted by people who get work done"
          description="Real feedback from renters who used RentWorx to find the right gear without the usual back-and-forth."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-2xl border border-border bg-secondary"
                />
              ))
            : reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col p-6">
                      <Quote className="size-7 text-primary/30" />
                      <div className="mt-3 flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={
                              starIndex < review.rating
                                ? "size-4 fill-accent text-accent"
                                : "size-4 text-muted-foreground/40"
                            }
                          />
                        ))}
                      </div>
                      <p className="mt-4 flex-1 text-sm leading-7 text-foreground">
                        “{review.comment}”
                      </p>
                      <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                        <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {review.customerName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {review.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Verified renter
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
