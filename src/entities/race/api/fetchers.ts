import type { NormalizedRace } from "../model/types";
import type { RaceFilters } from "./keys";

export interface RaceListResult {
  items: NormalizedRace[];
  range: { from: string; to: string };
  total: number;
}

/**
 * 클라이언트와 서버 모두에서 사용하는 fetcher.
 * 서버에서 호출 시 절대 URL이 필요하므로 baseUrl을 받는다.
 */
export async function fetchRaces(
  filters: RaceFilters,
  baseUrl = "",
): Promise<RaceListResult> {
  const url = new URL(`${baseUrl}/api/races`, baseUrl || "http://internal");
  url.searchParams.set("from", filters.from);
  url.searchParams.set("to", filters.to);
  if (filters.events?.length) {
    url.searchParams.set("events", filters.events.join(","));
  }
  const res = await fetch(baseUrl ? url.toString() : url.pathname + url.search, {
    next: { revalidate: 60, tags: ["races"] },
  });
  if (!res.ok) throw new Error(`fetchRaces failed: ${res.status}`);
  return res.json();
}
