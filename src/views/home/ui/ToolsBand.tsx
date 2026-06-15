import Link from "next/link";
import { Timer, Sparkles, BookOpen, Plane } from "lucide-react";
import { GlassCard } from "@/shared/ui";

const ITEMS = [
  {
    href: "/pace-calculator",
    title: "페이스 계산기",
    desc: "트레드밀 속도 ↔ 페이스, 완주 시간 예측",
    icon: Timer,
  },
  {
    href: "/runtrip",
    title: "런트립",
    desc: "도쿄·베를린·호놀룰루 — 참가권 보장 패키지",
    icon: Plane,
  },
  {
    href: "/magazine",
    title: "매거진",
    desc: "트레이닝·영양·장비 인사이트",
    icon: BookOpen,
  },
  {
    href: "/race",
    title: "대회 검색",
    desc: "월·종목·지역으로 빠르게",
    icon: Sparkles,
  },
];

export function ToolsBand() {
  return (
    <section className="py-12">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ href, title, desc, icon: Icon }) => (
          <Link key={href} href={href} className="group block">
            <GlassCard className="h-full p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-white/[0.08]">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg tracking-tight">{title}</h3>
              <p className="mt-1 text-xs text-[var(--fg-muted)]">{desc}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
