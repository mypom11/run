/**
 * 외부(runable.me) 응답 형식은 일부 필드명이 변동될 수 있어 유연하게 받는다.
 * 클라이언트는 항상 NormalizedRace만 본다.
 */
export type RawRace = Record<string, unknown> & {
  id?: string | number;
  compId?: string | number;
  uuid?: string;
  title?: string;
  name?: string;
  compName?: string;
  startDateTime?: string;
  startDate?: string;
  endDateTime?: string;
  endDate?: string;
  location?: string;
  region?: string;
  address?: string;
  thumbnail?: string;
  imageUrl?: string;
  posterUrl?: string;
  siteUrl?: string; // runable.me 실제 필드명 (공식 홈페이지)
  officialUrl?: string;
  homepage?: string;
  events?: unknown;
  eventList?: unknown;
  eventNames?: unknown;
};

export interface RaceListResponse {
  compList?: RawRace[];
  totalElements?: number;
  page?: number;
  size?: number;
  totalPages?: number;
}

export interface NormalizedRace {
  id: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  events: string[];
  thumbnail: string | null;
  officialUrl: string | null;
  compUrl: string | null;
  raw: RawRace;
}

export interface RaceQueryRange {
  from: string; // YYYY-MM-DD
  to: string;
}

export const RACE_EVENTS = ["full", "half", "10k", "5k"] as const;
export type RaceEvent = (typeof RACE_EVENTS)[number];

export const RACE_EVENT_LABEL: Record<RaceEvent, string> = {
  full: "풀",
  half: "하프",
  "10k": "10K",
  "5k": "5K",
};
