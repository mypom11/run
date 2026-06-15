import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { RaceView } from "@/views/race";
import { getQueryClient } from "@/shared/api/queryClient";
import { fetchRaces, raceKeys } from "@/entities/race";

export const metadata: Metadata = {
  title: "대회 일정",
  description: "국내·해외 마라톤 일정을 한눈에. 캘린더와 종목 필터로 빠르게 탐색하세요.",
};

export const revalidate = 60;

export default async function Page() {
  const qc = getQueryClient();
  const now = new Date();
  const filters = {
    from: format(startOfMonth(now), "yyyy-MM-dd"),
    to: format(endOfMonth(now), "yyyy-MM-dd"),
    events: [] as never[],
  };

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  await qc.prefetchQuery({
    queryKey: raceKeys.list(filters),
    queryFn: () => fetchRaces(filters, baseUrl),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <RaceView />
    </HydrationBoundary>
  );
}
