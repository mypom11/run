"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, CalendarDays, ListChecks } from "lucide-react";
import { addMonths, format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  fetchRaces,
  raceKeys,
  RACE_EVENTS,
  RACE_EVENT_LABEL,
  type RaceEvent,
} from "@/entities/race";
import { RaceChip } from "@/entities/race/ui/RaceChip";
import { RaceCard } from "@/entities/race/ui/RaceCard";
import { Button, GlassCard, Segmented, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { buildCalendarGrid, monthRangeIso } from "../model/calendarGrid";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

type ViewMode = "calendar" | "list";

export function RaceCalendar() {
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [view, setView] = useState<ViewMode>("calendar");
  const [events, setEvents] = useState<RaceEvent[]>([]);

  const range = useMemo(() => monthRangeIso(anchor), [anchor]);
  const filters = useMemo(
    () => ({ ...range, events }),
    [range, events],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: raceKeys.list(filters),
    queryFn: () => fetchRaces(filters),
    placeholderData: (prev) => prev,
  });

  const cells = useMemo(
    () => buildCalendarGrid(anchor, data?.items ?? []),
    [anchor, data?.items],
  );

  const toggleEvent = (e: RaceEvent) =>
    setEvents((cur) => (cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e]));

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

      {/* Content */}
      {isError ? (
        <GlassCard className="p-8 text-center text-[var(--fg-muted)]">
          대회 일정을 불러오지 못했습니다.
        </GlassCard>
      ) : view === "calendar" ? (
        <CalendarGrid cells={cells} isLoading={isLoading && !data} />
      ) : (
        <RaceList items={data?.items ?? []} isLoading={isLoading && !data} />
      )}
    </section>
  );
}

function CalendarGrid({
  cells,
  isLoading,
}: {
  cells: ReturnType<typeof buildCalendarGrid>;
  isLoading: boolean;
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
          : cells.map((cell) => (
              <div
                key={cell.iso}
                className={cn(
                  "relative flex aspect-[3/4] flex-col gap-1 overflow-hidden rounded-[var(--radius-md)] border border-white/[0.06] p-1 transition-colors sm:aspect-[5/6] sm:p-1.5",
                  cell.inMonth
                    ? "bg-white/[0.02] hover:bg-white/[0.05]"
                    : "bg-transparent text-[var(--fg-subtle)]",
                  cell.isToday &&
                    "ring-1 ring-[var(--accent)] bg-[var(--accent-soft)]",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-between text-[11px] sm:text-xs",
                    cell.isToday && "font-semibold text-[var(--accent-strong)]",
                  )}
                >
                  <span>{cell.date.getDate()}</span>
                  {cell.races.length > 0 && (
                    <span className="rounded-full bg-[var(--accent)] px-1.5 text-[9px] font-bold text-white">
                      {cell.races.length}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  {cell.races.slice(0, 2).map((race) => (
                    <RaceChip key={race.id} race={race} />
                  ))}
                  {cell.races.length > 2 && (
                    <span className="px-1 text-[9px] text-[var(--fg-muted)]">
                      +{cell.races.length - 2}
                    </span>
                  )}
                </div>
              </div>
            ))}
      </div>
    </GlassCard>
  );
}

function RaceList({
  items,
  isLoading,
}: {
  items: ReturnType<typeof buildCalendarGrid>[number]["races"] | [];
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
        이 달에는 대회가 없습니다.
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
