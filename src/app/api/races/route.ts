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
import type { RaceListResponse, NormalizedRace } from "@/entities/race/model/types";

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
      location: c.location ?? c.region ?? c.address ?? null,
      events: extractEvents(c),
      thumbnail: c.thumbnail ?? c.imageUrl ?? c.posterUrl ?? null,
      officialUrl: c.officialUrl ?? c.homepage ?? null,
      compUrl: c.id ? `/comp/${c.id}` : null,
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

function extractEvents(c: Record<string, unknown>): string[] {
  const e = c.events ?? c.eventList ?? c.eventNames;
  if (Array.isArray(e)) {
    return e
      .map((x) => (typeof x === "string" ? x : (x as { name?: string }).name))
      .filter((x): x is string => Boolean(x));
  }
  return [];
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
