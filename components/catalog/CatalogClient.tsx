"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { EquipmentCard } from "@/components/equipment/equipment-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EQUIPMENT_CATEGORIES, RENTAL_TYPES } from "@/lib/categories";
import { fetchEquipment } from "@/lib/equipment-api";
import type { EquipmentQuery, FeaturedEquipment } from "@/lib/types";

function initialFilters(params: URLSearchParams): EquipmentQuery {
  const page = Number(params.get("page"));

  return {
    search: params.get("search") ?? "",
    location: params.get("location") ?? "",
    category: params.get("category") ?? "",
    rentalType: params.get("rentalType") ?? "",
    minPrice: params.get("minPrice") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    available: params.get("available") !== "false",
    sort: (params.get("sort") as EquipmentQuery["sort"]) ?? "recent",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: 12,
  };
}

export function CatalogClient() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<EquipmentQuery>(() =>
    initialFilters(new URLSearchParams(searchParams.toString())),
  );
  const [searchDraft, setSearchDraft] = useState(filters.search ?? "");
  const [items, setItems] = useState<FeaturedEquipment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const next = initialFilters(new URLSearchParams(searchParams.toString()));
    setFilters(next);
    setSearchDraft(next.search ?? "");
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetchEquipment(filters);
        const meta = response.meta;

        if (active) {
          setItems(response.data);
          setTotal(meta?.total ?? response.data.length);
          setTotalPages(meta?.totalPages ?? 0);
        }
      } catch {
        if (active) {
          setError("We could not load equipment. Please try again shortly.");
          setItems([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [filters]);

  const updateFilter = <K extends keyof EquipmentQuery>(
    key: K,
    value: EquipmentQuery[K],
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? Number(value) : 1,
    }));
  };

  const resetFilters = () => {
    const cleared: EquipmentQuery = {
      search: "",
      location: "",
      category: "",
      rentalType: "",
      minPrice: "",
      maxPrice: "",
      available: true,
      sort: "recent",
      page: 1,
      limit: 12,
    };

    setFilters(cleared);
    setSearchDraft("");
  };

  const activeFilterCount = useMemo(() => {
    return [
      filters.search,
      filters.location,
      filters.category,
      filters.rentalType,
      filters.minPrice,
      filters.maxPrice,
      filters.available === false ? "false" : "",
    ].filter(Boolean).length;
  }, [filters]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
          Marketplace
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          All equipment
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          Compare verified listings by price, location, category, and rental
          type. Find the right gear for your next job.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateFilter("search", searchDraft.trim());
        }}
        className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search equipment, brand, or model"
            className="pl-9"
            aria-label="Search equipment"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <details open className="rounded-2xl border border-border bg-card p-5">
            <summary className="flex cursor-pointer items-center justify-between gap-2 font-semibold">
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </span>
            </summary>

            <div className="mt-5 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="filter-category">Category</Label>
                <select
                  id="filter-category"
                  value={filters.category ?? ""}
                  onChange={(event) => updateFilter("category", event.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">All categories</option>
                  {EQUIPMENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-rental">Rental type</Label>
                <select
                  id="filter-rental"
                  value={filters.rentalType ?? ""}
                  onChange={(event) => updateFilter("rentalType", event.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Any rental type</option>
                  {RENTAL_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-location">Location</Label>
                <Input
                  id="filter-location"
                  value={filters.location ?? ""}
                  onChange={(event) => updateFilter("location", event.target.value)}
                  placeholder="City or area"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="filter-min">Min price</Label>
                  <Input
                    id="filter-min"
                    type="number"
                    min={0}
                    value={filters.minPrice ?? ""}
                    onChange={(event) => updateFilter("minPrice", event.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-max">Max price</Label>
                  <Input
                    id="filter-max"
                    type="number"
                    min={0}
                    value={filters.maxPrice ?? ""}
                    onChange={(event) => updateFilter("maxPrice", event.target.value)}
                    placeholder="Any"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={filters.available ?? false}
                  onChange={(event) => updateFilter("available", event.target.checked)}
                  className="size-4 rounded border-input accent-[var(--color-primary)]"
                />
                Available only
              </label>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={resetFilters}
              >
                <X />
                Clear filters
              </Button>
            </div>
          </details>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {loading ? "Searching..." : `${total} equipment found`}
            </p>
            <div className="flex items-center gap-2">
              <Label htmlFor="filter-sort" className="whitespace-nowrap">
                Sort by
              </Label>
              <select
                id="filter-sort"
                value={filters.sort ?? "recent"}
                onChange={(event) =>
                  updateFilter("sort", event.target.value as EquipmentQuery["sort"])
                }
                className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="recent">Most recent</option>
                <option value="priceAsc">Price: low to high</option>
                <option value="priceDesc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>

          {error && (
            <Card className="mb-6 border-destructive/40 bg-destructive/5">
              <CardContent className="p-5 text-sm text-destructive">
                {error}
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[360px] animate-pulse rounded-2xl border border-border bg-secondary"
                />
              ))}
            </div>
          ) : items.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <EquipmentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
                <Search className="size-8 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-semibold">No equipment found</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Try widening your filters or searching for a different item.
                </p>
                <Button className="mt-5" variant="outline" onClick={resetFilters}>
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page ?? 1) <= 1}
                onClick={() => updateFilter("page", (filters.page ?? 1) - 1)}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                Page {filters.page ?? 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page ?? 1) >= totalPages}
                onClick={() => updateFilter("page", (filters.page ?? 1) + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
