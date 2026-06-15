import Image from "next/image";
import Link from "next/link";
import { Timer } from "lucide-react";
import { Button, GlassCard } from "@/shared/ui";

export function PaceCTA() {
  return (
    <section className="py-14">
      <GlassCard className="overflow-hidden p-0" intensity="strong">
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <Timer className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Pace Calculator
              </span>
            </div>
            <h2 className="font-display mt-3 text-3xl leading-tight tracking-tight sm:text-4xl">
              내 페이스로
              <br />
              완주 시간 알아보기
            </h2>
            <p className="mt-3 max-w-md text-sm text-[var(--fg-muted)]">
              5:30/km로 풀코스를 뛰면 몇 시간일까? 트레드밀 12km/h는 km당 몇 분?
              한 번에 답을 줍니다.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/pace-calculator">계산기 열기</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[16/10] lg:aspect-auto">
            <Image
              src="https://picsum.photos/seed/runable-pace-2/1200/900"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--bg-base)]/40" />
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
