"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Loader2 } from "lucide-react";
import {
  fetchCategories,
  fetchPosts,
  postKeys,
  type NormalizedCategory,
  type NormalizedPost,
} from "@/entities/post";
import { PostItem } from "@/entities/post/ui/PostItem";
import { GlassCard, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { useInView } from "../model/useInView";

const VIRTUALIZE_THRESHOLD = 40;

export function CommunityFeed() {
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const categoriesQ = useQuery({
    queryKey: postKeys.categories(),
    queryFn: () => fetchCategories(),
    staleTime: 60 * 60 * 1000,
  });

  const postsQ = useInfiniteQuery({
    queryKey: postKeys.list(categoryId),
    queryFn: ({ pageParam }) =>
      fetchPosts({ categoryId, page: pageParam as number, size: 20 }),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextPage,
  });

  const { ref: sentinelRef, inView } = useInView<HTMLDivElement>("400px");

  useEffect(() => {
    if (inView && postsQ.hasNextPage && !postsQ.isFetchingNextPage) {
      postsQ.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, postsQ.hasNextPage, postsQ.isFetchingNextPage]);

  const allCategories: NormalizedCategory[] = categoriesQ.data?.items ?? [];
  const items: NormalizedPost[] =
    postsQ.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <section className="space-y-5">
      <GlassCard className="p-2">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          <CategoryPill
            label="전체"
            active={categoryId === null}
            onClick={() => setCategoryId(null)}
          />
          {allCategories.map((c) => (
            <CategoryPill
              key={c.id}
              label={c.title}
              active={categoryId === c.id}
              onClick={() => setCategoryId(c.id)}
            />
          ))}
          {categoriesQ.isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-20 shrink-0 rounded-full" />
            ))}
        </div>
      </GlassCard>

      <FeedList
        items={items}
        isLoading={postsQ.isLoading}
        isError={postsQ.isError}
      />

      <div ref={sentinelRef} className="flex items-center justify-center py-6">
        {postsQ.isFetchingNextPage && (
          <Loader2 className="size-5 animate-spin text-[var(--fg-muted)]" />
        )}
        {!postsQ.hasNextPage && items.length > 0 && (
          <span className="text-xs text-[var(--fg-subtle)]">끝까지 봤어요</span>
        )}
      </div>
    </section>
  );
}

function FeedList({
  items,
  isLoading,
  isError,
}: {
  items: NormalizedPost[];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <GlassCard className="p-8 text-center text-[var(--fg-muted)]">
        글을 불러오지 못했습니다.
      </GlassCard>
    );
  }
  if (items.length === 0) {
    return (
      <GlassCard className="p-10 text-center text-[var(--fg-muted)]">
        아직 글이 없습니다.
      </GlassCard>
    );
  }

  // 항목이 많아지면 윈도우 기반 가상화로 전환
  if (items.length >= VIRTUALIZE_THRESHOLD) {
    return <VirtualFeed items={items} />;
  }

  return (
    <div className="space-y-3">
      {items.map((post, idx) => (
        <div
          key={post.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(idx, 8) * 30}ms` }}
        >
          <PostItem post={post} />
        </div>
      ))}
    </div>
  );
}

function VirtualFeed({ items }: { items: NormalizedPost[] }) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  // 부모 위치(페이지 스크롤 좌표계 기준)를 계산해 window virtualizer에 전달
  useEffect(() => {
    if (!parentRef.current) return;
    const el = parentRef.current;
    const calc = () => {
      const rect = el.getBoundingClientRect();
      setOffset(rect.top + window.scrollY);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => 144, // PostItem 카드 높이 추정(px)
    overscan: 6,
    scrollMargin: offset,
  });

  return (
    <div ref={parentRef}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((vRow) => {
          const post = items[vRow.index];
          return (
            <div
              key={post.id}
              data-index={vRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vRow.start - virtualizer.options.scrollMargin}px)`,
                paddingBottom: 12,
              }}
            >
              <PostItem post={post} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-[var(--radius-pill)] px-4 text-sm font-medium transition-all",
        active
          ? "bg-[var(--accent)] text-white shadow-[0_4px_20px_-4px_var(--accent-glow)]"
          : "text-[var(--fg-muted)] hover:bg-white/[0.06] hover:text-[var(--fg)]",
      )}
    >
      {label}
    </button>
  );
}
