"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, X, LogIn, Search } from "lucide-react";
import { Button } from "@/shared/ui";
import { NAV_ITEMS } from "@/shared/config/runable";
import { cn } from "@/shared/lib/utils";

interface MobileNavMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className="glass-strong fixed inset-x-3 top-3 z-[70] overflow-hidden rounded-[var(--radius-xl)] p-5 shadow-2xl focus:outline-none data-[state=open]:animate-fade-in-up md:hidden"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">메뉴</DialogPrimitive.Title>

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

          {/* nav list */}
          <nav className="mt-5">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
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
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* secondary actions */}
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/[0.08] pt-5">
            <Button variant="glass" className="w-full" aria-label="검색">
              <Search className="size-4" />
              검색
            </Button>
            <Button variant="primary" className="w-full" aria-label="로그인">
              <LogIn className="size-4" />
              시작하기
            </Button>
          </div>

          <p className="mt-4 px-1 text-[10px] text-[var(--fg-subtle)]">
            © {new Date().getFullYear()} Runable
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
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
