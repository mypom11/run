"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Clock,
  Users,
  Zap,
  CloudCog,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Button, GlassCard } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

const TICK_MS = 350;
const MIN_INITIAL = 1200;
const MAX_INITIAL = 2400;
const REDIRECT_DELAY = 1400;

// useState lazy initializer는 1회만 실행. 렌더 순수성을 깨지 않는다.
function pickInitial() {
  return Math.floor(MIN_INITIAL + Math.random() * (MAX_INITIAL - MIN_INITIAL));
}

export function QueueView() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/reserve";

  const [initial] = useState<number>(pickInitial);
  const [position, setPosition] = useState(initial);

  // 진행 시뮬레이션
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      setPosition((p) => {
        if (p <= 0) return 0;
        const ratio = p / initial;
        const burst =
          ratio > 0.4
            ? 28 + Math.random() * 38
            : 6 + Math.random() * 12;
        return Math.max(0, p - Math.round(burst));
      });
      timer = setTimeout(step, TICK_MS);
    };
    timer = setTimeout(step, TICK_MS);
    return () => clearTimeout(timer);
  }, [initial]);

  // position이 0이 되면 일정 시간 후 자동 이동. 별도 redirecting state 불필요.
  useEffect(() => {
    if (position !== 0) return;
    const t = setTimeout(() => router.replace(next), REDIRECT_DELAY);
    return () => clearTimeout(t);
  }, [position, next, router]);

  const isReady = position === 0;
  const progress = initial > 0 ? ((initial - position) / initial) * 100 : 100;
  const etaSec = Math.ceil(position / 70);
  const mm = Math.floor(etaSec / 60);
  const ss = etaSec - mm * 60;
  const etaLabel = `${mm}:${String(ss).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <GlassCard className="overflow-hidden p-0" intensity="strong">
        {/* 상단 인디케이터 */}
        <div className="relative h-1 w-full bg-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] transition-[width] duration-300"
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[var(--accent)]">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--accent)]" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest">
              {isReady ? "안전하게 진입 중" : "대기 중"}
            </span>
          </div>

          <h1 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">
            잠시만 기다려주세요
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
            지금 접수가 폭주하고 있어요. 안정적인 환경에서 입장할 수 있도록
            순번을 받고 있습니다. 새로고침하지 않아도 자동으로 입장합니다.
          </p>

          {/* 큰 숫자 + 메트릭 */}
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2 rounded-[var(--radius-lg)] bg-white/[0.04] p-6">
              <div className="text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">
                내 순번
              </div>
              <div className="font-display mt-1 text-[clamp(48px,12vw,84px)] leading-none tracking-tight tabular-nums">
                {position.toLocaleString()}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-[var(--fg-muted)]">
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" />앞에 대기 중
                </span>
                <span className="text-[var(--fg-subtle)]">
                  초기 순번 {initial.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
              <div className="rounded-[var(--radius-lg)] bg-white/[0.04] p-4">
                <div className="text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">
                  예상 대기
                </div>
                <div className="font-display mt-1 flex items-center gap-2 text-2xl tracking-tight tabular-nums">
                  <Clock className="size-4 opacity-70" />
                  {etaLabel}
                </div>
              </div>
              <div className="rounded-[var(--radius-lg)] bg-white/[0.04] p-4">
                <div className="text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">
                  진행률
                </div>
                <div className="font-display mt-1 text-2xl tracking-tight tabular-nums">
                  {Math.floor(progress)}%
                </div>
              </div>
            </div>
          </div>

          {/* 적용 중인 보호 기법 */}
          <div className="mt-7 rounded-[var(--radius-lg)] border border-white/[0.08] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              <ShieldCheck className="size-3.5" />
              적용 중인 보호 기법
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Technique
                icon={CloudCog}
                title="CDN 캐싱"
                desc="정적 자산은 CloudFront 엣지에서 응답해 오리진 부하를 차단합니다."
              />
              <Technique
                icon={Zap}
                title="SSG · ISR 정적 셸"
                desc="접수 페이지의 핵심 진입점은 미리 렌더되어 서버 연산을 최소화합니다."
              />
              <Technique
                icon={RefreshCw}
                title="요청 중복 제거"
                desc="React Query · fetch dedup으로 동일 데이터 재요청을 통합합니다."
              />
              <Technique
                icon={Users}
                title="대기열 게이트"
                desc="이 화면이 백엔드로 향하는 트래픽을 분당 N건으로 평탄화합니다."
              />
            </div>
          </div>

          {/* 액션 */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">취소하고 홈으로</Link>
            </Button>
            <Button
              size="md"
              onClick={() => router.replace(next)}
              disabled={!isReady}
              className={cn(
                isReady && "shadow-[0_0_28px_-4px_var(--accent-glow)]",
              )}
              aria-disabled={!isReady}
            >
              {isReady ? "지금 입장" : "내 순서까지 대기 중"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </GlassCard>

      <p className="mt-5 px-1 text-center text-[11px] text-[var(--fg-subtle)]">
        창을 닫지 마세요. 닫으면 순번이 초기화됩니다.
      </p>
    </div>
  );
}

function Technique({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-md)] bg-white/[0.03] p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-strong)]">
        <Icon className="size-4" />
      </span>
      <div>
        <div className="text-sm font-medium text-[var(--fg)]">{title}</div>
        <div className="mt-0.5 text-xs text-[var(--fg-muted)]">{desc}</div>
      </div>
    </div>
  );
}
