"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Home, CalendarDays, BookOpen, Plane, Timer } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const TABS = [
  { href: "/", label: "홈", icon: Home },
  { href: "/race", label: "대회", icon: CalendarDays },
  { href: "/magazine", label: "매거진", icon: BookOpen },
  { href: "/runtrip", label: "런트립", icon: Plane },
  { href: "/pace-calculator", label: "페이스", icon: Timer },
] as const;

// 활성 탭 아래로 미끄러지며 늘어나는 인디케이터의 스프링.
const INDICATOR_SPRING = { type: "spring", stiffness: 360, damping: 30, mass: 0.6 } as const;
const TAP_SPRING = { type: "spring", stiffness: 260, damping: 12, mass: 0.4 } as const;

/**
 * 앱(App-Store 스타일) GlassTabBar 포팅: 프로스티드 캡슐 위로 하나의
 * 액센트 타원이 활성 탭 아래를 미끄러지며 늘어난다. 활성 탭만 라벨을
 * 펼쳐 넓은 알약이 되고, 비활성 탭은 아이콘만 남는다. 탭하면 아이콘이
 * 스프링으로 눌린다. 인디케이터 이동은 framer-motion의 공유 layout(layoutId).
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <motion.nav
      initial={reduce ? false : { y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.12 }}
      className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 mx-auto w-fit max-w-[calc(100%-1.5rem)] md:hidden"
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
                aria-current={active ? "page" : undefined}
                aria-label={t.label}
                className="relative block focus-visible:outline-none"
              >
                <motion.span
                  whileTap={{ scale: 0.85 }}
                  transition={TAP_SPRING}
                  className={cn(
                    "relative flex items-center rounded-[var(--radius-pill)] px-3.5 py-2.5 text-xs font-semibold transition-colors",
                    active ? "text-white" : "text-[var(--fg-muted)]",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="tabbar-pill"
                      transition={INDICATOR_SPRING}
                      className="absolute inset-0 -z-10 rounded-[var(--radius-pill)] bg-gradient-to-br from-[var(--accent-strong)] to-[var(--accent)] shadow-[0_6px_22px_-6px_var(--accent-glow)]"
                    />
                  )}
                  <Icon className="size-5 shrink-0" />
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.span
                        key="label"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden whitespace-nowrap pl-1.5"
                      >
                        {t.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
