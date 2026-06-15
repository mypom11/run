import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  format,
  parseISO,
} from "date-fns";
import type { NormalizedRace } from "@/entities/race";

export interface CalendarCell {
  date: Date;
  iso: string; // YYYY-MM-DD
  inMonth: boolean;
  isToday: boolean;
  races: NormalizedRace[];
}

export function buildCalendarGrid(
  monthAnchor: Date,
  races: NormalizedRace[],
): CalendarCell[] {
  const monthStart = startOfMonth(monthAnchor);
  const monthEnd = endOfMonth(monthAnchor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const today = new Date();
  const racesByDay = groupRacesByDay(races);

  const cells: CalendarCell[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    const iso = format(cursor, "yyyy-MM-dd");
    cells.push({
      date: new Date(cursor),
      iso,
      inMonth: isSameMonth(cursor, monthAnchor),
      isToday: isSameDay(cursor, today),
      races: racesByDay.get(iso) ?? [],
    });
    cursor = addDays(cursor, 1);
  }
  return cells;
}

function groupRacesByDay(races: NormalizedRace[]) {
  const map = new Map<string, NormalizedRace[]>();
  for (const r of races) {
    if (!r.startDate) continue;
    let key: string;
    try {
      key = format(parseISO(r.startDate), "yyyy-MM-dd");
    } catch {
      continue;
    }
    const arr = map.get(key) ?? [];
    arr.push(r);
    map.set(key, arr);
  }
  return map;
}

export function monthRangeIso(anchor: Date) {
  return {
    from: format(startOfMonth(anchor), "yyyy-MM-dd"),
    to: format(endOfMonth(anchor), "yyyy-MM-dd"),
  };
}
