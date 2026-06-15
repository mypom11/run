import { RaceCalendar } from "@/features/race-calendar";
import { RaceSearchBar } from "@/features/race-search";

export function RaceView() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-6">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
          Race Schedule
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-tight sm:text-5xl">
          대회 일정
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
          국내·해외 마라톤 일정을 한눈에. 종목 필터와 캘린더 보기로 빠르게
          탐색하세요.
        </p>
      </header>
      <div className="space-y-5">
        <RaceSearchBar />
        <RaceCalendar />
      </div>
    </div>
  );
}
