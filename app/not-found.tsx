import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Compass className="size-7" />
      </div>
      <p className="mt-5 text-6xl font-bold tracking-tight text-foreground">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        The page you are looking for may have moved or never existed.
      </p>
      <Button asChild className="mt-7">
        <Link href="/">Back to RentWorx</Link>
      </Button>
    </div>
  );
}
