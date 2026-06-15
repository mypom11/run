"use client";

import { useEffect, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  fetchCategories,
  fetchPosts,
  postKeys,
  type NormalizedCategory,
} from "@/entities/post";
import { PostItem } from "@/entities/post/ui/PostItem";
import { GlassCard, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { useInView } from "../model/useInView";

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

  const items = postsQ.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <section className="space-y-5">
      {/* Category tabs (scrollable on mobile) */}
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

      {/* Feed list */}
      <div className="space-y-3">
        {postsQ.isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))
          : items.map((post, idx) => (
              <div
                key={post.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx, 8) * 30}ms` }}
              >
                <PostItem post={post} />
              </div>
            ))}

        {postsQ.isError && (
          <GlassCard className="p-8 text-center text-[var(--fg-muted)]">
            글을 불러오지 못했습니다.
          </GlassCard>
        )}

        {!postsQ.isLoading && items.length === 0 && !postsQ.isError && (
          <GlassCard className="p-10 text-center text-[var(--fg-muted)]">
            아직 글이 없습니다.
          </GlassCard>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="flex items-center justify-center py-6">
          {postsQ.isFetchingNextPage && (
            <Loader2 className="size-5 animate-spin text-[var(--fg-muted)]" />
          )}
          {!postsQ.hasNextPage && items.length > 0 && (
            <span className="text-xs text-[var(--fg-subtle)]">끝까지 봤어요</span>
          )}
        </div>
      </div>
    </section>
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
