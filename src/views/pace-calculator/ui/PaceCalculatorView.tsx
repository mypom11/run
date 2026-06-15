import { PaceCalculator } from "@/features/pace-calculator";

export function PaceCalculatorView() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
          Tools
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-tight sm:text-5xl">
          페이스 계산기
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
          거리·페이스로 완주 시간을 구하고, 트레드밀 속도를 km당 페이스로
          환산하세요.
        </p>
      </header>

      <PaceCalculator />
    </div>
  );
}
