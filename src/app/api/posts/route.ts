/**
 * GET /api/posts?category=<uuid>&page=0&size=20
 *
 * 커뮤니티 게시글 페이지네이션 프록시.
 * - 클라이언트 무한 스크롤이 이 엔드포인트만 호출
 * - 짧은 ISR 캐시 + s-maxage로 CDN/엣지 흡수
 */
import { NextRequest, NextResponse } from "next/server";
import { runableGet } from "@/shared/api/http";
import type { PostListResponse, NormalizedPost } from "@/entities/post/model/types";

export const revalidate = 30;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category") ?? "";
  const page = Number(sp.get("page") ?? 0);
  const size = Math.min(Number(sp.get("size") ?? 20), 50);

  try {
    const data = await runableGet<PostListResponse>(
      "/article/post",
      {
        category,
        page,
        size,
        orderBy: "createDateTime",
        direction: "DESC",
      },
      { revalidate: 30, tags: ["posts", `posts:${category || "all"}`] },
    );

    const items: NormalizedPost[] = (data.articles ?? []).map((a) => ({
      id: String(a.id ?? a.postId ?? a.uuid),
      title: a.title ?? "",
      excerpt: stripHtml(a.content ?? a.body ?? "").slice(0, 180),
      authorName: a.authorNickname ?? a.nickname ?? a.userName ?? "익명",
      authorId: a.userId ?? a.authorId ?? null,
      categoryId: a.category ?? a.categoryId ?? null,
      categoryName: a.categoryName ?? null,
      likeCount: Number(a.likeCount ?? 0),
      commentCount: Number(a.commentCount ?? 0),
      viewCount: Number(a.viewCount ?? 0),
      createdAt: a.createDateTime ?? a.createdAt ?? null,
      thumbnail: a.thumbnail ?? null,
    }));

    const nextPage = items.length === size ? page + 1 : null;

    return NextResponse.json(
      {
        items,
        page,
        size,
        nextPage,
        total: data.totalElements ?? null,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=30, stale-while-revalidate=120",
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ items: [], error: message }, { status: 502 });
  }
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
