"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Search, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const heroImage =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80";

export function Hero() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("category", category);

    const query = params.toString();
    router.push(query ? `/all-equipment?${query}` : "/all-equipment");
  };

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Construction equipment on a worksite"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-primary/30" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur">
            <Sparkles className="size-3.5 text-accent" />
            Verified equipment, transparent pricing
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Rent the right equipment.
            <span className="block text-accent">Get more done.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            RentWorx connects you with trusted owners for construction,
            photography, transport, agriculture, and event equipment — with
            secure checkout and flexible rental periods.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-9 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl"
          >
            <div className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
              <div className="space-y-1.5">
                <Label htmlFor="hero-search" className="text-white/80">
                  What do you need?
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="hero-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Excavator, camera, van..."
                    className="border-white/20 bg-white pl-9 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="hero-category" className="text-white/80">
                  Category
                </Label>
                <select
                  id="hero-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-11 w-full rounded-xl border border-white/20 bg-white px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">All categories</option>
                  <option value="Construction Equipment">Construction</option>
                  <option value="Photography Equipment">Photography</option>
                  <option value="Vehicles & Transportation">Vehicles</option>
                  <option value="Agriculture Equipment">Agriculture</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Event Equipment">Events</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button type="submit" variant="accent" className="w-full md:w-auto">
                  Search
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="size-4 text-accent" />
              Verified owners
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" />
              Secure payments
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              Flexible rental terms
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
