"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Search, X } from "lucide-react";
import { GlassCard } from "@/shared/ui";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { cn } from "@/shared/lib/utils";
import { raceSearchSchema, type RaceSearchForm } from "../model/schema";
import { useRaceSearchStore } from "../model/raceSearchStore";

const REGIONS = [
  { value: "", label: "전체" },
  { value: "seoul", label: "서울" },
  { value: "busan", label: "부산" },
  { value: "jeju", label: "제주" },
  { value: "etc", label: "기타" },
] as const;

export function RaceSearchBar() {
  const setKeyword = useRaceSearchStore((s) => s.setKeyword);
  const setRegion = useRaceSearchStore((s) => s.setRegion);

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm<RaceSearchForm>({
    resolver: yupResolver(raceSearchSchema),
    defaultValues: { keyword: "", region: "" },
    mode: "onChange",
  });

  const keyword = useWatch({ control, name: "keyword" }) ?? "";
  const region = useWatch({ control, name: "region" }) ?? "";
  const debouncedKeyword = useDebouncedValue(keyword, 250);

  // 디바운스된 키워드를 전역 store로 (캘린더가 구독)
  useEffect(() => {
    setKeyword(debouncedKeyword);
  }, [debouncedKeyword, setKeyword]);

  useEffect(() => {
    setRegion(region);
  }, [region, setRegion]);

  return (
    <GlassCard className="p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--fg-muted)]" />
          <input
            type="search"
            {...register("keyword")}
            placeholder="대회명으로 검색"
            className={cn(
              "h-11 w-full rounded-[var(--radius-pill)] bg-white/[0.04] pl-11 pr-10 text-sm text-[var(--fg)] outline-none ring-1 ring-white/10 transition focus:bg-white/[0.08] focus:ring-[var(--accent)]",
              errors.keyword && "ring-[var(--accent)]",
            )}
            aria-invalid={errors.keyword ? "true" : "false"}
            aria-describedby="race-search-error"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setValue("keyword", "", { shouldValidate: true })}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--fg-muted)] hover:bg-white/10 hover:text-[var(--fg)]"
              aria-label="검색어 지우기"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
        <div className="glass flex items-center gap-1 rounded-[var(--radius-pill)] p-1 overflow-x-auto sm:overflow-visible">
          {REGIONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setValue("region", r.value)}
              className={cn(
                "h-9 shrink-0 rounded-[var(--radius-pill)] px-3 text-xs font-medium transition-colors",
                region === r.value
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
              )}
              aria-pressed={region === r.value}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      {errors.keyword?.message && (
        <p
          id="race-search-error"
          className="mt-1 px-2 text-xs text-[var(--accent-strong)]"
          role="alert"
        >
          {errors.keyword.message}
        </p>
      )}
    </GlassCard>
  );
}
