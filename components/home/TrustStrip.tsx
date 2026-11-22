import { BadgeCheck, Headphones, WalletCards } from "lucide-react";

const items = [
  {
    icon: BadgeCheck,
    value: "6",
    label: "Equipment categories",
  },
  {
    icon: WalletCards,
    value: "100%",
    label: "Secure checkout",
  },
  {
    icon: Headphones,
    value: "24/7",
    label: "Owner support",
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-card/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="surface-card grid gap-6 px-6 py-7 sm:grid-cols-3 sm:px-8">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center gap-4 ${
                index > 0 ? "sm:border-l sm:border-border sm:pl-8" : ""
              }`}
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <item.icon className="size-5" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold tracking-tight text-foreground">
                  {item.value}
                </p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
