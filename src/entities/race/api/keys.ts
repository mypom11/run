import type { RaceEvent, RaceQueryRange } from "../model/types";

export interface RaceFilters extends RaceQueryRange {
  events?: RaceEvent[];
}

export const raceKeys = {
  all: ["race"] as const,
  list: (filters: RaceFilters) =>
    [...raceKeys.all, "list", filters.from, filters.to, [...(filters.events ?? [])].sort().join(",")] as const,
};
