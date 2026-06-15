import { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "default" | "strong";
  glow?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = "default", glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          intensity === "strong" ? "glass-strong" : "glass",
          "rounded-[var(--radius-lg)] relative overflow-hidden",
          glow &&
            "before:absolute before:inset-0 before:-z-0 before:bg-gradient-to-br before:from-[var(--accent-soft)] before:to-transparent before:opacity-60 before:pointer-events-none",
          className,
        )}
        {...props}
      />
    );
  },
);
GlassCard.displayName = "GlassCard";
