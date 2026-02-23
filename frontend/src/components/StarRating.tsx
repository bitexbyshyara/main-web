import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  count?: number;
  value?: number;
  onChange?: (value: number) => void;
  interactive?: boolean;
}

const StarRating = ({ count = 5, value, onChange, interactive = false }: StarRatingProps) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => {
      const filled = interactive ? i < (value ?? 0) : true;
      return (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(i + 1)}
          className={cn(
            "p-0 border-0 bg-transparent",
            interactive ? "cursor-pointer h-6 w-6" : "cursor-default h-4 w-4"
          )}
        >
          <Star
            className={cn(
              interactive ? "h-6 w-6" : "h-4 w-4",
              filled ? "fill-primary text-primary" : "fill-none text-muted-foreground/40"
            )}
          />
        </button>
      );
    })}
  </div>
);

export default StarRating;
