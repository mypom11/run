import type { NormalizedRace } from "@/entities/race";
import {
  geocodeLocation,
  locationKey,
  type LatLng,
} from "@/shared/lib/locations";

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
    const key = locationKey(r.location);
    const coords = geocodeLocation(r.location);
    if (!key || !coords) {
      unresolved.push(r);
      continue;
    }
    const existing = byKey.get(key);
    if (existing) {
      existing.races.push(r);
    } else {
      byKey.set(key, { key, latLng: coords, races: [r] });
    }
  }

  // 개수 많은 위치를 먼저 (작은 마커가 큰 마커에 가리는 것을 줄임)
  const groups = Array.from(byKey.values()).sort(
    (a, b) => b.races.length - a.races.length,
  );

  return { groups, unresolved };
}
