/**
 * 서버용 HTTP 클라이언트. runable.me 공개 API 호출 전용.
 * - 결과는 fetch의 next.revalidate로 ISR.
 * - cacheTag로 그룹화해 on-demand revalidation 가능.
 */
import { RUNABLE_API_BASE } from "@/shared/config/runable";

export interface RunableResponse<T> {
  status: "OK" | string;
  data: T;
  resUuid?: string;
}

interface FetchOptions {
  revalidate?: number;
  tags?: string[];
}

export async function runableGet<T>(
  path: string,
  searchParams: Record<string, string | number | undefined>,
  opts: FetchOptions = {},
): Promise<T> {
  const url = new URL(`${RUNABLE_API_BASE}${path}`);
  url.searchParams.set("auth", "false");
  for (const [k, v] of Object.entries(searchParams)) {
    if (v === undefined || v === null || v === "") continue;
    url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json" },
    next: {
      revalidate: opts.revalidate ?? 60,
      tags: opts.tags,
    },
  });

  if (!res.ok) {
    throw new Error(`Runable API ${path} failed: ${res.status}`);
  }

  const json = (await res.json()) as RunableResponse<T>;
  if (json.status !== "OK") {
    throw new Error(`Runable API ${path} returned status ${json.status}`);
  }
  return json.data;
}
