"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, BookOpen, Plane, Timer } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/race", label: "대회", icon: CalendarDays },
  { href: "/magazine", label: "매거진", icon: BookOpen },
  { href: "/runtrip", label: "런트립", icon: Plane },
  { href: "/pace-calculator", label: "페이스", icon: Timer },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-3 z-50 mx-auto w-fit max-w-[calc(100%-1.5rem)] md:hidden"
      aria-label="하단 탐색"
    >
      <ul className="glass-strong flex items-center gap-1 rounded-[var(--radius-pill)] p-1.5 shadow-2xl">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active =
            t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-[var(--radius-pill)] px-4 py-2 text-[10px] font-medium transition-all",
                  active
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-5" />
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
