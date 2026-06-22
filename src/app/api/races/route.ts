/**
 * GET /api/races?from=YYYY-MM-DD&to=YYYY-MM-DD&events=full,half,10k,5k
 *
 * runable.me의 대회 일정 API를 same-origin으로 받아 캘린더 표시에 적합한 형태로 가공.
 * - eventNameList 쿼리를 매핑
 * - 응답을 일자별 그룹화에 적합한 정규화된 형태로 반환
 * - ISR 60초 + tag "races"로 캐시
 */
import { NextRequest, NextResponse } from "next/server";
import { runableGet } from "@/shared/api/http";
import { RUNABLE_SITE_BASE } from "@/shared/config/runable";
import type { RaceListResponse, NormalizedRace, RawRace } from "@/entities/race/model/types";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const from = sp.get("from") ?? defaultFromIso();
  const to = sp.get("to") ?? defaultToIso();
  const events = sp.get("events"); // comma-separated

  try {
    const data = await runableGet<RaceListResponse>(
      "/comp/schedule",
      {
        page: 0,
        size: 200,
        orderBy: "startDateTime",
        direction: "ASC",
        "searchPeriod.fromDate": from,
        "searchPeriod.toDate": to,
        ...(events ? { eventNameList: events } : {}),
      },
      { revalidate: 60, tags: ["races", `races:${from}:${to}`] },
    );

    const normalized: NormalizedRace[] = (data.compList ?? []).map((c) => ({
      id: String(c.id ?? c.compId ?? c.uuid ?? cryptoIsh()),
      title: c.title ?? c.name ?? c.compName ?? "",
      startDate: c.startDateTime ?? c.startDate ?? null,
      endDate: c.endDateTime ?? c.endDate ?? null,
      // runable API 실제 지역 필드는 cityCode (광역). display label로 쓴다.
      location: c.cityCode || c.location || c.region || c.address || null,
      // c.location은 구체적 장소명("고양종합운동장"). 지도 정밀 좌표 매칭용.
      venue: c.location || c.address || null,
      events: extractEvents(c),
      thumbnail: c.thumbnail ?? c.imageUrl ?? c.posterUrl ?? null,
      // runable API 실제 필드는 siteUrl (빈 문자열일 수 있어 || 로 건너뛴다).
      officialUrl: c.siteUrl || c.officialUrl || c.homepage || null,
      // 자체 /comp 라우트가 없으므로 runable.me 절대 URL로 — 상대 경로면 Next가 없는 라우트를 prefetch하다 404.
      compUrl: c.id ? `${RUNABLE_SITE_BASE}/comp/${c.id}` : null,
      raw: c,
    }));

    return NextResponse.json(
      {
        items: normalized,
        range: { from, to },
        total: data.totalElements ?? normalized.length,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ items: [], error: message }, { status: 502 });
  }
}

function extractEvents(c: RawRace): string[] {
  // runable API 실제 필드는 compEvents: [{ eventName, distance }]. 나머지는 방어적 폴백.
  const list = c.compEvents ?? c.events ?? c.eventList ?? c.eventNames;
  if (!Array.isArray(list)) return [];
  const names = list
    .map((x) =>
      typeof x === "string"
        ? x
        : ((x as { eventName?: string; name?: string }).eventName ??
          (x as { name?: string }).name),
    )
    .filter((x): x is string => Boolean(x));
  return Array.from(new Set(names)); // 같은 종목 중복 제거
}

function defaultFromIso() {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

function defaultToIso() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 0);
  return d.toISOString().slice(0, 10);
}

function cryptoIsh() {
  return Math.random().toString(36).slice(2, 10);
}
