import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, GlassCard } from "@/shared/ui";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-20">
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-20 blur-[120px]"
      />
      <div className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display inline-flex items-center gap-2 rounded-[var(--radius-pill)] glass px-4 py-1.5 text-xs tracking-widest text-[var(--fg-muted)]">
            <span className="size-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            JUST RUN.
          </p>
          <h1 className="font-display mt-6 text-[clamp(40px,8vw,84px)] leading-[0.95] tracking-tight">
            <span className="block">달리자,</span>
            <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--accent-strong)] to-[var(--info)] bg-clip-text text-transparent">
              나답게.
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[var(--fg-muted)]">
            대회 접수, 기록 관리, 커뮤니티까지 — 러너를 위한 모든 것.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button asChild size="lg">
              <Link href="/race">
                대회 찾기
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link href="/community">커뮤니티</Link>
            </Button>
          </div>
        </div>

        {/* metrics row */}
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
          <Metric label="등록 러너" value="120K+" />
          <Metric label="대회" value="650+" />
          <Metric label="후기·기록" value="2.8M+" />
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <GlassCard className="px-4 py-4 text-center sm:px-6 sm:py-6">
      <div className="font-display text-2xl tracking-tight sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-[var(--fg-subtle)] sm:text-xs">
        {label}
      </div>
    </GlassCard>
  );
}
