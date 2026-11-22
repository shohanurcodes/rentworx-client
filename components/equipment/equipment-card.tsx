import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { FavoriteButton } from "@/components/equipment/favorite-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { FeaturedEquipment } from "@/lib/types";

function rentalLabel(rentalType: FeaturedEquipment["rentalType"]) {
  return rentalType.charAt(0).toUpperCase() + rentalType.slice(1);
}

export function EquipmentCard({ item }: { item: FeaturedEquipment }) {
  return (
    <Card className="surface-card group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-[var(--ds-shadow-lift)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Link
          href={`/equipment/${item.id}`}
          className="absolute inset-0 block"
          aria-label={`View ${item.name}`}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          <Badge variant="accent" className="shadow-sm backdrop-blur">
            {item.condition}
          </Badge>
        </div>
        <FavoriteButton
          equipmentId={item.id}
          className="absolute right-3 top-3 z-10"
        />
      </div>

      <CardContent className="p-5">
        <Link href={`/equipment/${item.id}`} className="block">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {item.category}
              </p>
              <h3 className="mt-1 line-clamp-1 font-heading text-base font-bold text-foreground">
                {item.name}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-700 dark:text-amber-400">
              <Star className="size-3.5 fill-current" />
              {item.ratingAverage.toFixed(1)}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </div>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-border pt-4">
            <p className="font-heading text-xl font-bold text-foreground">
              ${item.price.toLocaleString()}
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                / {rentalLabel(item.rentalType)}
              </span>
            </p>
            <span className="text-xs text-muted-foreground">
              {item.reviewCount} reviews
            </span>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
