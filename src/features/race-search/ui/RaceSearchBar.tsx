"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { GlassCard } from "@/shared/ui";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { cn } from "@/shared/lib/utils";

const REGIONS = [
  { value: "", label: "전체" },
  { value: "seoul", label: "서울" },
  { value: "gyeonggi", label: "경기" },
  { value: "busan", label: "부산" },
  { value: "jeju", label: "제주" },
  { value: "etc", label: "기타" },
] as const;

/**
 * URL search params로 키워드/지역을 직렬화. 새로고침/공유에도 유지.
 * - 입력은 로컬 state로 즉시 반영, 250ms 디바운스로 URL 갱신
 * - 캘린더/지도/리스트는 같은 URL params를 읽음 (단일 진실)
 */
export function RaceSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get("q") ?? "";
  const initialRegion = searchParams.get("region") ?? "";

  const [keyword, setKeyword] = useState(initialQ);
  const debouncedKeyword = useDebouncedValue(keyword, 250);

  // 최신 searchParams를 ref로 보관 — effect가 구독하지 않으면서도 머지 가능
  const paramsRef = useRef(searchParams);
  useEffect(() => {
    paramsRef.current = searchParams;
  }, [searchParams]);

  // 디바운스된 키워드를 URL에 반영
  useEffect(() => {
    const params = new URLSearchParams(paramsRef.current.toString());
    if (debouncedKeyword) params.set("q", debouncedKeyword);
    else params.delete("q");
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [debouncedKeyword, pathname, router]);

  const setRegion = (value: string) => {
    const params = new URLSearchParams(paramsRef.current.toString());
    if (value) params.set("region", value);
    else params.delete("region");
    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  return (
    <GlassCard className="p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-muted)]" />
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.slice(0, 40))}
            placeholder="대회명 / 지역으로 검색"
            aria-label="대회 검색"
            className="h-11 w-full rounded-[var(--radius-pill)] bg-white/[0.04] pl-11 pr-10 text-sm text-[var(--fg)] outline-none ring-1 ring-white/10 transition focus:bg-white/[0.08] focus:ring-[var(--accent)]"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--fg-muted)] hover:bg-white/10 hover:text-[var(--fg)]"
              aria-label="검색어 지우기"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="glass flex items-center gap-1 rounded-[var(--radius-pill)] p-1 overflow-x-auto sm:overflow-visible">
          {REGIONS.map((r) => {
            const active = initialRegion === r.value;
            return (
              <button
                key={r.value || "all"}
                type="button"
                onClick={() => setRegion(r.value)}
                className={cn(
                  "h-9 shrink-0 rounded-[var(--radius-pill)] px-3 text-xs font-medium transition-colors",
                  active
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                )}
                aria-pressed={active}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
