/**
 * 페이스/속도/시간 계산 순수 함수.
 * - 페이스 단위: "min:sec / km"
 * - 거리 단위: km
 * - 속도 단위: km/h
 */

export function paceSecondsToString(totalSec: number): string {
  if (!isFinite(totalSec) || totalSec <= 0) return "—";
  const m = Math.floor(totalSec / 60);
  const s = Math.round(totalSec - m * 60);
  return `${m}'${String(s).padStart(2, "0")}"`;
}

export function totalSecondsToHms(totalSec: number): string {
  if (!isFinite(totalSec) || totalSec <= 0) return "—";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec - h * 3600) / 60);
  const s = Math.round(totalSec - h * 3600 - m * 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** km/h -> sec/km */
export function speedToPaceSec(kmh: number): number {
  if (kmh <= 0) return 0;
  return 3600 / kmh;
}

/** sec/km -> km/h */
export function paceSecToSpeed(secPerKm: number): number {
  if (secPerKm <= 0) return 0;
  return 3600 / secPerKm;
}

/** distance(km) * pace(sec/km) -> total seconds */
export function totalTimeSec(distanceKm: number, paceSec: number): number {
  return distanceKm * paceSec;
}

/** 표준 거리 프리셋 (km) */
export const PRESETS = [
  { label: "5K", km: 5 },
  { label: "10K", km: 10 },
  { label: "하프", km: 21.0975 },
  { label: "풀", km: 42.195 },
] as const;
