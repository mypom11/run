import type { NormalizedPost, NormalizedCategory } from "../model/types";

export interface PostPageResult {
  items: NormalizedPost[];
  page: number;
  size: number;
  nextPage: number | null;
  total: number | null;
}

export async function fetchPosts(
  args: { categoryId: string | null; page: number; size?: number },
  baseUrl = "",
): Promise<PostPageResult> {
  const size = args.size ?? 20;
  const url = new URL(`${baseUrl}/api/posts`, baseUrl || "http://internal");
  if (args.categoryId) url.searchParams.set("category", args.categoryId);
  url.searchParams.set("page", String(args.page));
  url.searchParams.set("size", String(size));
  const res = await fetch(baseUrl ? url.toString() : url.pathname + url.search, {
    next: { revalidate: 30, tags: ["posts"] },
  });
  if (!res.ok) throw new Error(`fetchPosts failed: ${res.status}`);
  return res.json();
}

export async function fetchCategories(
  baseUrl = "",
): Promise<{ items: NormalizedCategory[] }> {
  const url = `${baseUrl}/api/categories`;
  const res = await fetch(url, { next: { revalidate: 3600, tags: ["categories"] } });
  if (!res.ok) throw new Error(`fetchCategories failed: ${res.status}`);
  return res.json();
}
