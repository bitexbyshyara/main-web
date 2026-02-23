import { cn } from "@/lib/utils";

interface TierBadgeProps {
  label: string;
  className?: string;
}

const TierBadge = ({ label, className }: TierBadgeProps) => (
  <span className={cn("inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider", className)}>
    {label}
  </span>
);

export default TierBadge;
