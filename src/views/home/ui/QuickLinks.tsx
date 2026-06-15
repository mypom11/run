import Link from "next/link";
import { Calculator, Sparkles, Banana, Map } from "lucide-react";
import { GlassCard } from "@/shared/ui";

const ITEMS = [
  {
    href: "/pace-calculator",
    title: "페이스 계산기",
    desc: "트레드밀 속도 ↔ 페이스 변환",
    icon: Calculator,
  },
  {
    href: "/fortune",
    title: "러너 운세",
    desc: "AI 달림장군의 오늘의 한 마디",
    icon: Sparkles,
  },
  {
    href: "/banana",
    title: "바나나",
    desc: "포인트 적립 · 경품 응모",
    icon: Banana,
  },
  {
    href: "/runtrip",
    title: "런트립",
    desc: "해외 마라톤 여행 상품",
    icon: Map,
  },
];

export function QuickLinks() {
  return (
    <section className="py-12">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[var(--accent)]">Tools</p>
        <h2 className="font-display mt-1 text-3xl tracking-tight sm:text-4xl">
          러너를 위한 도구
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ href, title, desc, icon: Icon }) => (
          <Link key={href} href={href}>
            <GlassCard className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:bg-white/[0.08]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-strong)]">
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
