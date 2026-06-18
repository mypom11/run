"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Search } from "lucide-react";
import { Button } from "@/shared/ui";
import { NAV_ITEMS } from "@/shared/config/runable";
import { cn } from "@/shared/lib/utils";
import { QueueModeRow, StartButton } from "@/features/queue-mode";

interface MobileNavMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PANEL_SPRING = { type: "spring", stiffness: 320, damping: 30, mass: 0.8 } as const;

export function MobileNavMenu({ open, onOpenChange }: MobileNavMenuProps) {
  const pathname = usePathname();

  // 라우트 이동 시 자동으로 닫기
  useEffect(() => {
    onOpenChange(false);
    // pathname만 의존: 메뉴 외부에서 다른 곳을 클릭해 라우트가 바뀐 케이스 대응
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md md:hidden"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={{ opacity: 0, y: -18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={PANEL_SPRING}
                className="glass-strong fixed inset-x-3 top-3 z-[70] overflow-hidden rounded-[var(--radius-xl)] p-5 shadow-2xl focus:outline-none md:hidden"
              >
                <DialogPrimitive.Title className="sr-only">
                  메뉴
                </DialogPrimitive.Title>

                {/* header row */}
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center gap-2 focus-visible:outline-none"
                  >
                    <div className="flex size-7 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                      <RunMark className="size-4" />
                    </div>
                    <span className="font-display text-lg tracking-tight">
                      runable
                    </span>
                  </Link>
                  <DialogPrimitive.Close
                    aria-label="메뉴 닫기"
                    className="inline-flex size-10 items-center justify-center rounded-full text-[var(--fg-muted)] hover:bg-white/10 hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <X className="size-5" />
                  </DialogPrimitive.Close>
                </div>

                {/* nav list — 항목별 스태거 진입 */}
                <nav className="mt-5">
                  <ul className="space-y-1">
                    {NAV_ITEMS.map((item, i) => {
                      const active =
                        item.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.href);
                      return (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.08 + i * 0.05,
                            duration: 0.32,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => onOpenChange(false)}
                            className={cn(
                              "group flex items-center justify-between rounded-[var(--radius-md)] px-4 py-3 transition-colors",
                              active
                                ? "bg-[var(--accent)] text-white"
                                : "text-[var(--fg)] hover:bg-white/[0.06]",
                            )}
                          >
                            <span className="font-display text-lg tracking-tight">
                              {item.label}
                            </span>
                            <ArrowRight
                              className={cn(
                                "size-4 transition-transform group-hover:translate-x-0.5",
                                active ? "opacity-90" : "opacity-40",
                              )}
                            />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                {/* queue mode + CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + NAV_ITEMS.length * 0.05, duration: 0.32 }}
                  className="mt-5 space-y-2 border-t border-white/[0.08] pt-5"
                >
                  <QueueModeRow />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="glass" className="w-full" aria-label="검색">
                      <Search className="size-4" />
                      검색
                    </Button>
                    <StartButton variant="primary" size="md" fullWidth />
                  </div>
                </motion.div>

                <p className="mt-4 px-1 text-[10px] text-[var(--fg-subtle)]">
                  © {new Date().getFullYear()} Runable
                </p>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
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
