"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ListChecks,
  MapPin,
} from "lucide-react";
import { addMonths, format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  fetchRaces,
  raceKeys,
  RACE_EVENTS,
  RACE_EVENT_LABEL,
  type NormalizedRace,
  type RaceEvent,
} from "@/entities/race";
import { RaceChip } from "@/entities/race/ui/RaceChip";
import { RaceCard } from "@/entities/race/ui/RaceCard";
import { Button, GlassCard, Segmented, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { buildCalendarGrid, monthRangeIso } from "../model/calendarGrid";
import { DayRacesDialog } from "./DayRacesDialog";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

type ViewMode = "calendar" | "list" | "map";

// 지역 키 → 위치 문자열에 포함되어야 할 키워드
const REGION_KEYWORD: Record<string, string[]> = {
  seoul: ["서울"],
  gyeonggi: ["경기", "수원", "성남", "안양", "고양", "용인", "화성"],
  busan: ["부산"],
  jeju: ["제주", "서귀포"],
};

const RaceMap = dynamic(
  () => import("@/features/race-map").then((m) => m.RaceMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[560px] w-full" />,
  },
);

export function RaceCalendar() {
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [view, setView] = useState<ViewMode>("calendar");
  const [events, setEvents] = useState<RaceEvent[]>([]);
  const [openDay, setOpenDay] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const keyword = (searchParams.get("q") ?? "").trim();
  const region = searchParams.get("region") ?? "";

  const range = useMemo(() => monthRangeIso(anchor), [anchor]);
  const filters = useMemo(() => ({ ...range, events }), [range, events]);

  const { data, isLoading, isError } = useQuery({
    queryKey: raceKeys.list(filters),
    queryFn: () => fetchRaces(filters),
    placeholderData: (prev) => prev,
  });

  const filteredItems = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter((r) => matchesFilters(r, keyword, region));
  }, [data?.items, keyword, region]);

  const cells = useMemo(
    () => buildCalendarGrid(anchor, filteredItems),
    [anchor, filteredItems],
  );

  const toggleEvent = (e: RaceEvent) =>
    setEvents((cur) =>
      cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e],
    );

  const racesForOpenDay: NormalizedRace[] = useMemo(() => {
    if (!openDay) return [];
    return cells.find((c) => c.iso === openDay)?.races ?? [];
  }, [openDay, cells]);

  return (
    <section className="space-y-5">
      {/* Toolbar */}
      <GlassCard className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAnchor((d) => addMonths(d, -1))}
            aria-label="이전 달"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="text-center min-w-[140px]">
            <div className="font-display text-2xl text-[var(--fg)] tracking-tight">
              {format(anchor, "yyyy.MM", { locale: ko })}
            </div>
            <div className="text-xs text-[var(--fg-muted)]">
              {format(anchor, "MMMM yyyy", { locale: ko })}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setAnchor((d) => addMonths(d, 1))}
            aria-label="다음 달"
          >
            <ChevronRight className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAnchor(new Date())}
            className="ml-1"
          >
            오늘
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Segmented<ViewMode>
            value={view}
            onChange={setView}
            options={[
              {
                value: "calendar",
                label: (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    캘린더
                  </span>
                ),
              },
              {
                value: "list",
                label: (
                  <span className="flex items-center gap-1.5">
                    <ListChecks className="size-4" />
                    목록
                  </span>
                ),
              },
              {
                value: "map",
                label: (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    지도
                  </span>
                ),
              },
            ]}
          />
          <div className="glass flex flex-wrap items-center gap-1 rounded-[var(--radius-pill)] p-1">
            {RACE_EVENTS.map((e) => {
              const active = events.includes(e);
              return (
                <button
                  key={e}
                  onClick={() => toggleEvent(e)}
                  className={cn(
                    "h-7 rounded-[var(--radius-pill)] px-3 text-xs font-medium transition-all",
                    active
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                  )}
                  aria-pressed={active}
                >
                  {RACE_EVENT_LABEL[e]}
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* 결과 카운트 */}
      {(keyword || region) && !isLoading && (
        <div className="px-1 text-xs text-[var(--fg-muted)]">
          검색 결과{" "}
          <span className="font-semibold text-[var(--accent-strong)]">
            {filteredItems.length}
          </span>
          개
          {keyword && (
            <>
              {" · 키워드 "}
              <span className="text-[var(--fg)]">“{keyword}”</span>
            </>
          )}
          {region && (
            <>
              {" · 지역 "}
              <span className="text-[var(--fg)]">{region}</span>
            </>
          )}
        </div>
      )}

      {/* Content */}
      {isError ? (
        <GlassCard className="p-8 text-center text-[var(--fg-muted)]">
          대회 일정을 불러오지 못했습니다.
        </GlassCard>
      ) : view === "calendar" ? (
        <CalendarGrid
          cells={cells}
          isLoading={isLoading && !data}
          onSelectDay={setOpenDay}
        />
      ) : view === "map" ? (
        isLoading && !data ? (
          <Skeleton className="h-[560px] w-full" />
        ) : (
          <RaceMap races={filteredItems} />
        )
      ) : (
        <RaceList items={filteredItems} isLoading={isLoading && !data} />
      )}

      <DayRacesDialog
        open={!!openDay}
        onOpenChange={(o) => !o && setOpenDay(null)}
        iso={openDay}
        races={racesForOpenDay}
      />
    </section>
  );
}

function matchesFilters(
  race: NormalizedRace,
  keyword: string,
  region: string,
): boolean {
  if (keyword) {
    const k = keyword.toLowerCase();
    const hay =
      `${race.title} ${race.location ?? ""} ${race.events.join(" ")}`.toLowerCase();
    if (!hay.includes(k)) return false;
  }
  if (region) {
    const loc = race.location ?? "";
    if (region === "etc") {
      const known = Object.values(REGION_KEYWORD).flat();
      if (known.some((kw) => loc.includes(kw))) return false;
    } else {
      const kws = REGION_KEYWORD[region];
      if (kws && !kws.some((kw) => loc.includes(kw))) return false;
    }
  }
  return true;
}

function CalendarGrid({
  cells,
  isLoading,
  onSelectDay,
}: {
  cells: ReturnType<typeof buildCalendarGrid>;
  isLoading: boolean;
  onSelectDay: (iso: string) => void;
}) {
  return (
    <GlassCard className="overflow-hidden p-3 sm:p-4">
      <div className="grid grid-cols-7 gap-px text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={cn(
              "py-2",
              i === 0 && "text-[var(--accent)]",
              i === 6 && "text-[var(--info)]",
            )}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-1.5">
        {isLoading
          ? Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] sm:aspect-[5/6]" />
            ))
          : cells.map((cell) => {
              const hasRaces = cell.races.length > 0;
              return (
                <div
                  key={cell.iso}
                  className={cn(
                    "relative flex aspect-[3/4] flex-col gap-1 overflow-hidden rounded-[var(--radius-md)] border border-white/[0.06] p-1 transition-colors sm:aspect-[5/6] sm:p-1.5",
                    cell.inMonth
                      ? "bg-white/[0.02]"
                      : "bg-transparent text-[var(--fg-subtle)]",
                    cell.isToday &&
                      "ring-1 ring-[var(--accent)] bg-[var(--accent-soft)]",
                    hasRaces && "cursor-pointer hover:bg-white/[0.06]",
                  )}
                  onClick={hasRaces ? () => onSelectDay(cell.iso) : undefined}
                  role={hasRaces ? "button" : undefined}
                  tabIndex={hasRaces ? 0 : -1}
                  onKeyDown={(e) => {
                    if (hasRaces && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onSelectDay(cell.iso);
                    }
                  }}
                  aria-label={
                    hasRaces
                      ? `${cell.iso} 대회 ${cell.races.length}개 보기`
                      : undefined
                  }
                >
                  <div
                    className={cn(
                      "flex items-center justify-between text-[11px] sm:text-xs",
                      cell.isToday &&
                        "font-semibold text-[var(--accent-strong)]",
                    )}
                  >
                    <span>{cell.date.getDate()}</span>
                    {hasRaces && (
                      <span className="rounded-full bg-[var(--accent)] px-1.5 text-[9px] font-bold text-white">
                        {cell.races.length}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                    {cell.races.slice(0, 2).map((race) => (
                      <RaceChip
                        key={race.id}
                        race={race}
                        onClick={() => onSelectDay(cell.iso)}
                      />
                    ))}
                    {cell.races.length > 2 && (
                      <span className="px-1 text-[9px] text-[var(--fg-muted)]">
                        +{cell.races.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </GlassCard>
  );
}

function RaceList({
  items,
  isLoading,
}: {
  items: NormalizedRace[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <GlassCard className="p-10 text-center text-[var(--fg-muted)]">
        조건에 맞는 대회가 없습니다.
      </GlassCard>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((race) => (
        <RaceCard key={race.id} race={race} />
      ))}
    </div>
  );
}
