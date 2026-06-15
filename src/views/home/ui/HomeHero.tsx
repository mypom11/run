import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button, GlassCard } from "@/shared/ui";

export function HomeHero() {
  return (
    <section className="relative -mx-5 overflow-hidden">
      {/* background image */}
      <div className="relative h-[78vh] min-h-[560px] w-full">
        <Image
          src="https://picsum.photos/seed/runable-hero-2/2000/1200"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
        {/* gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[var(--bg-base)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        {/* accent glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-25 blur-[140px]"
        />

        {/* content */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-20 sm:pb-28">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="font-display inline-flex items-center gap-2 rounded-[var(--radius-pill)] glass px-4 py-1.5 text-xs tracking-widest text-[var(--fg)]">
              <span className="size-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              SEASON 2026 · 가을 시즌 오픈
            </span>
            <h1 className="font-display mt-5 text-[clamp(42px,8vw,92px)] leading-[0.94] tracking-tight text-white">
              달리자,
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--accent-strong)] to-[#ffd6a5] bg-clip-text text-transparent">
                나답게.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-white/80">
              월드 메이저부터 한강 5K까지, 다음 출발선이 여기 있습니다.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <Button asChild size="lg">
                <Link href="/race">
                  대회 캘린더
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <Link href="/runtrip">
                  <Sparkles className="size-4" />
                  런트립 보기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* metrics row, overlapping bottom */}
      <div className="mx-auto -mt-12 max-w-6xl px-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="등록 러너" value="120K+" />
          <Metric label="등록 대회" value="650+" />
          <Metric label="매거진" value="320+" />
          <Metric label="런트립 도시" value="18" />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <GlassCard className="px-4 py-5 text-center" intensity="strong">
      <div className="font-display text-2xl tracking-tight sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-[var(--fg-subtle)] sm:text-xs">
        {label}
      </div>
    </GlassCard>
  );
}
