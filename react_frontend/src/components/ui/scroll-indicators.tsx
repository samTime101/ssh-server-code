import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScrollOverflowState } from "@/hooks/useScrollOverflow";

type ScrollIndicatorsProps = ScrollOverflowState & {
  className?: string;
};

export const ScrollIndicators = ({
  canScrollUp,
  canScrollDown,
  className,
}: ScrollIndicatorsProps) => {
  if (!canScrollUp && !canScrollDown) return null;

  return (
    <>
      {canScrollUp && (
        <div
          aria-hidden
          className={cn(
            "from-card via-card/70 pointer-events-none absolute inset-x-0 top-0 z-10 flex h-8 justify-center bg-gradient-to-b to-transparent pt-0.5",
            className
          )}
        >
          <ChevronUp className="text-muted-foreground h-4 w-4" />
        </div>
      )}
      {canScrollDown && (
        <div
          aria-hidden
          className={cn(
            "from-card via-card/70 pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-8 items-end justify-center bg-gradient-to-t to-transparent pb-0.5",
            className
          )}
        >
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </div>
      )}
    </>
  );
};
