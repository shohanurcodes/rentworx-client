import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_VARIANTS: Record<string, BadgeProps["variant"]> = {
  paid: "success",
  approved: "success",
  completed: "success",
  active: "success",
  confirmed: "info",
  pending: "warning",
  failed: "destructive",
  refunded: "destructive",
  rejected: "destructive",
  cancelled: "destructive",
  inactive: "destructive",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const variant = STATUS_VARIANTS[status.toLowerCase()] ?? "outline";

  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {status}
    </Badge>
  );
}
