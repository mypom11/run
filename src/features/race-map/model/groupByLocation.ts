import type { NormalizedRace } from "@/entities/race";
import { resolveLocation, type LatLng } from "@/shared/lib/locations";

export interface RaceLocationGroup {
  key: string;            // e.g. "서울"
  latLng: LatLng;
  races: NormalizedRace[];
}

export interface GroupResult {
  groups: RaceLocationGroup[];
  unresolved: NormalizedRace[];
}

export function groupRacesByLocation(races: NormalizedRace[]): GroupResult {
  const byKey = new Map<string, RaceLocationGroup>();
  const unresolved: NormalizedRace[] = [];

  for (const r of races) {
    // 구체적 장소(venue)를 먼저, 없으면 광역 지역(location)으로 폴백.
    const resolved = resolveLocation(r.venue, r.location);
    if (!resolved) {
      unresolved.push(r);
      continue;
    }
    const { key, latLng } = resolved;
    const existing = byKey.get(key);
    if (existing) {
      existing.races.push(r);
    } else {
      byKey.set(key, { key, latLng, races: [r] });
    }
  }

  // 개수 많은 위치를 먼저 (작은 마커가 큰 마커에 가리는 것을 줄임)
  const groups = Array.from(byKey.values()).sort(
    (a, b) => b.races.length - a.races.length,
  );

  return { groups, unresolved };
}
