import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase",
  {
    variants: {
      tone: {
        accent:
          "bg-[var(--accent-soft)] text-[var(--accent-strong)] border border-[var(--accent-soft)]",
        success:
          "bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)]",
        info: "bg-white/[0.08] text-[var(--fg)] border border-white/10",
        muted:
          "bg-white/[0.06] text-[var(--fg-muted)] border border-white/[0.08]",
        glass: "glass text-[var(--fg)] border-white/15",
      },
    },
    defaultVariants: {
      tone: "info",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
