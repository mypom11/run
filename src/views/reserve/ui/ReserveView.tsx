"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button, GlassCard, Badge } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

interface Option {
  id: string;
  label: string;
  distance: string;
  price: number;
  capacity: number;
  remaining: number;
  description: string;
}

const RACE = {
  title: "2026 가을 한강 마라톤",
  date: "2026.10.18 (일) 07:30",
  location: "여의도 한강공원",
  participants: "12,000명",
  cover: "https://picsum.photos/seed/runable-reserve-hero/1800/900",
};

const OPTIONS: Option[] = [
  {
    id: "full",
    label: "풀코스",
    distance: "42.195km",
    price: 65000,
    capacity: 4000,
    remaining: 248,
    description: "공식 IAAF 코스 · BIB + 메달 + 핑거푸드 + 셔틀",
  },
  {
    id: "half",
    label: "하프코스",
    distance: "21.0975km",
    price: 45000,
    capacity: 4000,
    remaining: 1124,
    description: "BIB + 메달 + 보급 4지점",
  },
  {
    id: "10k",
    label: "10K",
    distance: "10km",
    price: 28000,
    capacity: 3000,
    remaining: 2042,
    description: "BIB + 메달 + 보급 2지점",
  },
  {
    id: "5k",
    label: "5K 패밀리",
    distance: "5km",
    price: 18000,
    capacity: 1000,
    remaining: 612,
    description: "가족·초보 · 완주 메달",
  },
];

const formatPrice = (n: number) => `${n.toLocaleString()}원`;

export function ReserveView() {
  const [selected, setSelected] = useState<string>("half");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    if (submitting || done) return;
    setSubmitting(true);
    // 데모: 실제 결제 API 자리. 클라이언트 디바운스/중복요청 차단은 disabled로 처리.
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 900);
  };

  const opt = OPTIONS.find((o) => o.id === selected)!;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-6">
      {/* hero */}
      <GlassCard className="relative overflow-hidden p-0" intensity="strong">
        <div className="relative aspect-[16/7] w-full sm:aspect-[16/6]">
          <Image
            src={RACE.cover}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-7">
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone="accent">접수중</Badge>
              <Badge tone="glass">공식 IAAF</Badge>
            </div>
            <h1 className="font-display mt-3 text-3xl tracking-tight text-white sm:text-4xl">
              {RACE.title}
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4 opacity-80" /> {RACE.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 opacity-80" /> {RACE.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4 opacity-80" /> {RACE.participants}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* options */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="font-display mb-3 text-xl tracking-tight">
            종목 선택
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {OPTIONS.map((o) => {
              const active = selected === o.id;
              const soldOut = o.remaining === 0;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => !soldOut && setSelected(o.id)}
                  disabled={soldOut}
                  className={cn(
                    "glass relative overflow-hidden rounded-[var(--radius-lg)] p-4 text-left transition-all",
                    active
                      ? "ring-2 ring-[var(--accent)] bg-[var(--accent-soft)]"
                      : "hover:bg-white/[0.08]",
                    soldOut && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="font-display text-lg tracking-tight">
                        {o.label}
                      </div>
                      <div className="text-xs text-[var(--fg-muted)]">
                        {o.distance}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg tracking-tight tabular-nums">
                        {formatPrice(o.price)}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">
                        VAT 포함
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-[var(--fg-muted)]">
                    {o.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px]">
                    <span className="text-[var(--fg-subtle)]">잔여</span>
                    <span
                      className={cn(
                        "font-semibold tabular-nums",
                        o.remaining < 300
                          ? "text-[var(--accent-strong)]"
                          : "text-[var(--fg)]",
                      )}
                    >
                      {o.remaining.toLocaleString()}
                    </span>
                    <span className="text-[var(--fg-subtle)]">
                      / {o.capacity.toLocaleString()}
                    </span>
                  </div>
                  {active && (
                    <span className="absolute right-3 top-3 inline-flex size-6 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                      <Check className="size-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Perk icon={Trophy} title="완주 메달" desc="모든 종목 제공" />
            <Perk icon={ShieldCheck} title="안전한 결제" desc="PG 3중 검증" />
            <Perk icon={Calendar} title="환불 보장" desc="대회 30일 전까지" />
          </div>
        </section>

        {/* checkout summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <GlassCard className="p-5" intensity="strong">
            <h3 className="font-display text-lg tracking-tight">접수 요약</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="대회" value={RACE.title} />
              <Row label="종목" value={`${opt.label} (${opt.distance})`} />
              <Row label="일시" value={RACE.date} />
              <Row label="장소" value={RACE.location} />
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t border-white/[0.08] pt-4">
              <span className="text-xs uppercase tracking-widest text-[var(--fg-subtle)]">
                결제 금액
              </span>
              <span className="font-display text-3xl tracking-tight tabular-nums">
                {formatPrice(opt.price)}
              </span>
            </div>
            <Button
              className="mt-5 w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={submitting || done}
              aria-busy={submitting}
            >
              {done
                ? "접수 완료"
                : submitting
                  ? "처리 중…"
                  : "결제하고 접수하기"}
            </Button>
            <p className="mt-3 text-[11px] text-[var(--fg-subtle)]">
              결제 진행 시 이용약관·환불정책에 동의한 것으로 간주합니다.
            </p>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-[var(--fg-subtle)]">{label}</dt>
      <dd className="text-right text-[var(--fg)]">{value}</dd>
    </div>
  );
}

function Perk({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <GlassCard className="p-4">
      <Icon className="size-4 text-[var(--accent-strong)]" />
      <div className="mt-2 text-sm font-medium">{title}</div>
      <div className="mt-0.5 text-xs text-[var(--fg-muted)]">{desc}</div>
    </GlassCard>
  );
}
