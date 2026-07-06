import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({
  value, onChange, readOnly, size = 24,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={cn("transition", !readOnly && "hover:scale-110 cursor-pointer")}
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              n <= value ? "fill-gold stroke-gold" : "stroke-muted-foreground/50",
            )}
          />
        </button>
      ))}
    </div>
  );
}
