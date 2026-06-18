"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { GlassCard, Skeleton, CountUp } from "@/shared/ui";
import type { NormalizedRace } from "@/entities/race";

// Chart.js는 클라이언트 전용. dynamic import + ssr:false로 번들 분리.
const BarChart = dynamic(
  () => import("@/shared/ui/bar-chart").then((m) => m.BarChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-40 w-full" />,
  },
);

interface RaceStatsCardProps {
  races: NormalizedRace[];
}

export function RaceStatsCard({ races }: RaceStatsCardProps) {
  const { labels, values, total } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of races) {
      if (!r.startDate) continue;
      const d = new Date(r.startDate);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getMonth() + 1}월`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const sorted = Array.from(counts.entries()).sort(
      (a, b) => Number(a[0].replace("월", "")) - Number(b[0].replace("월", "")),
    );
    return {
      labels: sorted.map(([k]) => k),
      values: sorted.map(([, v]) => v),
      total: races.length,
    };
  }, [races]);

  return (
    <GlassCard className="p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
            Monthly
          </p>
          <h3 className="font-display mt-1 text-xl tracking-tight">
            다가오는 3개월 대회 분포
          </h3>
        </div>
        <div className="text-right">
          <CountUp value={total} className="font-display text-2xl tracking-tight" />
          <div className="text-[10px] uppercase tracking-widest text-[var(--fg-subtle)]">
            races
          </div>
        </div>
      </div>
      {labels.length > 0 ? (
        <BarChart labels={labels} values={values} ariaLabel="월별 대회 수" />
      ) : (
        <div className="py-8 text-center text-sm text-[var(--fg-muted)]">
          예정된 대회가 없습니다.
        </div>
      )}
    </GlassCard>
  );
}
