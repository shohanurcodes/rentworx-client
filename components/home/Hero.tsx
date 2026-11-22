"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const heroImage =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80";

const categories = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

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
    <section className="relative isolate overflow-hidden bg-midnight text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt="Construction equipment on a worksite"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/95 to-midnight/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-midnight/60" />
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="absolute -left-32 top-10 size-96 rounded-full bg-amber-500/20 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 size-96 rounded-full bg-sky-500/15 blur-[130px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-32 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-xl">
              <Sparkles className="size-3.5 text-amber-400" />
              Verified equipment, transparent pricing
            </div>

            <h1 className="mt-7 text-4xl font-bold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-[4rem]">
              Rent the right
              <br />
              equipment.
              <span className="amber-gradient-text block">Get more done.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              RentWorx connects you with trusted owners for construction,
              photography, transport, agriculture, and event equipment — with
              secure checkout and flexible rental periods.
            </p>

            <form
              onSubmit={handleSubmit}
              className="glass-panel mt-9 rounded-2xl p-3 shadow-2xl"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_210px_auto]">
                <div className="space-y-1.5">
                  <Label htmlFor="hero-search" className="text-white/75">
                    What do you need?
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="hero-search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Excavator, camera, van..."
                      className="border-white/20 bg-white/95 pl-9 text-foreground placeholder:text-muted-foreground focus-visible:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="hero-category" className="text-white/75">
                    Category
                  </Label>
                  <select
                    id="hero-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="h-11 w-full rounded-xl border border-white/20 bg-white/95 px-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <option value="">All categories</option>
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
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

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck className="size-4 text-amber-400" />
                Verified owners
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-amber-400" />
                Secure payments
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="size-4 text-amber-400" />
                Flexible rental terms
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative hidden lg:block"
            aria-hidden="true"
          >
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/20 shadow-[var(--ds-shadow-lift)]">
              <Image
                src={heroImage}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 0px, 30vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/15 bg-black/30 p-4 backdrop-blur-xl">
                <div>
                  <p className="text-xs text-slate-300">Featured category</p>
                  <p className="mt-1 text-sm font-bold">Construction gear</p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-amber-400 text-[#251803]">
                  <MapPin className="size-5" />
                </span>
              </div>
            </div>

            <div className="glass-panel absolute -left-10 top-10 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl">
              <span className="grid size-10 place-items-center rounded-xl bg-amber-400 text-[#251803]">
                <Star className="size-5 fill-current" />
              </span>
              <div>
                <p className="text-lg font-bold leading-none">4.9</p>
                <p className="mt-1 text-xs text-slate-300">Owner rating</p>
              </div>
            </div>

            <div className="glass-panel absolute -bottom-6 -right-6 rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-xs text-slate-300">Secure checkout</p>
              <p className="mt-1 text-lg font-bold text-amber-400">100%</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
