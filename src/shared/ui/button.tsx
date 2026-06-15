import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--accent)] text-white shadow-[0_8px_28px_-8px_var(--accent-glow)] hover:bg-[var(--accent-strong)] hover:shadow-[0_12px_32px_-8px_var(--accent-glow)]",
        secondary:
          "bg-white text-black hover:bg-white/90",
        ghost:
          "bg-transparent text-[var(--fg)] hover:bg-white/[0.06]",
        glass:
          "glass text-[var(--fg)] hover:bg-white/[0.12] hover:border-white/20",
        outline:
          "border border-[var(--glass-border-strong)] text-[var(--fg)] hover:bg-white/[0.06]",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-[var(--radius-pill)]",
        md: "h-11 px-5 text-sm rounded-[var(--radius-pill)]",
        lg: "h-13 px-7 text-base rounded-[var(--radius-pill)]",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
