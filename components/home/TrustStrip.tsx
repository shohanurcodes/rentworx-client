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
    <section className="border-b border-border bg-card">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <item.icon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {item.value}
              </p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
