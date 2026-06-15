import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { CommunityView } from "@/views/community";
import { getQueryClient } from "@/shared/api/queryClient";
import { fetchCategories, fetchPosts, postKeys } from "@/entities/post";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "대회 후기, 훈련 로그, 해외 러닝까지 — 러너들의 진짜 이야기.",
};

export const revalidate = 30;

export default async function Page() {
  const qc = getQueryClient();
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  await Promise.all([
    qc.prefetchQuery({
      queryKey: postKeys.categories(),
      queryFn: () => fetchCategories(baseUrl),
    }),
    qc.prefetchInfiniteQuery({
      queryKey: postKeys.list(null),
      queryFn: ({ pageParam }) =>
        fetchPosts({ categoryId: null, page: pageParam as number, size: 20 }, baseUrl),
      initialPageParam: 0,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <CommunityView />
    </HydrationBoundary>
  );
}
