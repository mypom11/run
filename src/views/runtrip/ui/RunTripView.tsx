import { RUNTRIPS, RunTripCard } from "@/entities/runtrip";

export function RunTripView() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
          Runtrip
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-tight sm:text-5xl">
          런트립 · 해외 마라톤 여행
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
          참가권부터 항공·숙박까지 한 번에. 러너에게 필요한 디테일만 모았습니다.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {RUNTRIPS.map((t) => (
          <RunTripCard key={t.id} trip={t} />
        ))}
      </div>

      <div className="mt-12 rounded-[var(--radius-xl)] glass-strong p-6 text-sm text-[var(--fg-muted)]">
        모든 상품은 참가권 보장. 항공권 단독 구매 가능 여부와 단체 할인은 각
        상품 상세에서 확인하세요. 일정·가격은 출발 시점에 따라 변동될 수 있습니다.
      </div>
    </div>
  );
}
