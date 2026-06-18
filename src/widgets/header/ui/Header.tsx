"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui";
import { NAV_ITEMS } from "@/shared/config/runable";
import { cn } from "@/shared/lib/utils";
import { QueueModeToggle, StartButton } from "@/features/queue-mode";
import { MobileNavMenu } from "./MobileNavMenu";

export function Header() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={cn(
        "sticky top-0 z-50 transition-[padding] duration-300",
        scrolled ? "py-2" : "py-3",
      )}
    >
      <div className="mx-auto max-w-6xl px-3 sm:px-5">
        <nav
          className={cn(
            "glass flex items-center justify-between gap-2 rounded-[var(--radius-pill)] px-3 py-2 transition-all duration-300",
            scrolled && "glass-strong shadow-2xl",
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-2"
            aria-label="홈으로"
          >
            <div className="flex size-7 items-center justify-center rounded-full bg-[var(--accent)] text-white">
              <RunMark className="size-4" />
            </div>
            <span className="font-display text-lg tracking-tight">runable</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative block rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-[var(--fg)]"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/[0.06] rounded-[var(--radius-pill)]",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 360, damping: 30 }}
                        className="absolute inset-0 -z-10 rounded-[var(--radius-pill)] bg-white/[0.1]"
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <QueueModeToggle className="hidden md:inline-flex" />
            <StartButton className="hidden sm:inline-flex" />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="메뉴 열기"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </nav>
      </div>
      <MobileNavMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </motion.header>
  );
}

function RunMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M4 18c4-1 6-3 8-6s4-6 8-7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
