import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { FeaturedEquipment } from "@/lib/types";

function rentalLabel(rentalType: FeaturedEquipment["rentalType"]) {
  return rentalType.charAt(0).toUpperCase() + rentalType.slice(1);
}

export function EquipmentCard({ item }: { item: FeaturedEquipment }) {
  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/equipment/${item.id}`} className="block h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge variant="accent" className="shadow-sm">
              {item.condition}
            </Badge>
          </div>
        </div>

        <CardContent className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {item.category}
              </p>
              <h3 className="mt-1 line-clamp-1 text-base font-bold text-foreground">
                {item.name}
              </h3>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-foreground">
              <Star className="size-4 fill-accent text-accent" />
              {item.ratingAverage.toFixed(1)}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </div>

          <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
            <p className="text-xl font-bold text-foreground">
              ${item.price.toLocaleString()}
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                / {rentalLabel(item.rentalType)}
              </span>
            </p>
            <span className="text-xs text-muted-foreground">
              {item.reviewCount} reviews
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
