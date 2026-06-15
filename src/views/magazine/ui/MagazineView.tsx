"use client";

import { useMemo, useState } from "react";
import {
  ARTICLES,
  ARTICLE_CATEGORY_LABEL,
  ArticleCard,
  type ArticleCategory,
} from "@/entities/article";
import { Segmented } from "@/shared/ui";

type Filter = "all" | ArticleCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "training", label: ARTICLE_CATEGORY_LABEL.training },
  { value: "nutrition", label: ARTICLE_CATEGORY_LABEL.nutrition },
  { value: "gear", label: ARTICLE_CATEGORY_LABEL.gear },
  { value: "guide", label: ARTICLE_CATEGORY_LABEL.guide },
  { value: "interview", label: ARTICLE_CATEGORY_LABEL.interview },
  { value: "lifestyle", label: ARTICLE_CATEGORY_LABEL.lifestyle },
];

export function MagazineView() {
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(
    () =>
      filter === "all"
        ? ARTICLES
        : ARTICLES.filter((a) => a.category === filter),
    [filter],
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
          Magazine
        </p>
        <h1 className="font-display mt-1 text-4xl tracking-tight sm:text-5xl">
          러너 매거진
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--fg-muted)]">
          더 잘 달리기 위한 가이드, 영양, 장비 그리고 사람들의 이야기.
        </p>
      </header>

      <div className="-mx-2 mb-6 overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={FILTERS.map((f) => ({ value: f.value, label: f.label }))}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
