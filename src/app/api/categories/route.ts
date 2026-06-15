/**
 * GET /api/categories
 *
 * 커뮤니티 카테고리 목록 프록시. 거의 변하지 않으므로 길게 캐시.
 */
import { NextResponse } from "next/server";
import { runableGet } from "@/shared/api/http";
import type {
  CategoryListResponse,
  NormalizedCategory,
} from "@/entities/post/model/types";

export const revalidate = 3600;

export async function GET() {
  try {
    const data = await runableGet<CategoryListResponse>(
      "/article/category",
      {},
      { revalidate: 3600, tags: ["categories"] },
    );

    const items: NormalizedCategory[] = (data.categories ?? []).map((c) => ({
      id: String(c.id ?? c.uuid),
      title: c.title ?? c.name ?? "",
      order: Number(c.order ?? c.sortOrder ?? 0),
    }));

    return NextResponse.json(
      { items },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ items: [], error: message }, { status: 502 });
  }
}
