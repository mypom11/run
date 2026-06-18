import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { GlassCard, Badge, Pressable } from "@/shared/ui";
import { formatDateShort } from "@/shared/lib/utils";
import { ARTICLE_CATEGORY_LABEL, type Article } from "../model/types";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "large";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const isLarge = variant === "large";
  return (
    <Link
      href={`/magazine/${article.slug}`}
      className="group block focus-visible:outline-none"
    >
      <Pressable className="h-full">
      <GlassCard
        className="h-full overflow-hidden p-0 transition-colors duration-300 group-hover:border-white/20"
      >
        <div
          className={
            isLarge
              ? "relative aspect-[16/10] w-full"
              : "relative aspect-[16/10] w-full"
          }
        >
          <Image
            src={article.cover}
            alt=""
            fill
            sizes={isLarge ? "(min-width: 1024px) 800px, 100vw" : "(min-width: 1024px) 400px, 100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute left-4 top-4">
            <Badge tone="glass">
              {ARTICLE_CATEGORY_LABEL[article.category]}
            </Badge>
          </div>
        </div>
        <div className="p-5">
          <h3
            className={
              isLarge
                ? "font-display text-2xl leading-tight tracking-tight"
                : "font-display text-lg leading-tight tracking-tight"
            }
          >
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-[var(--fg-muted)] line-clamp-2">
            {article.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-[var(--fg-subtle)]">
            <span className="text-[var(--fg-muted)]">{article.author}</span>
            <span className="opacity-40">·</span>
            <span>{formatDateShort(article.publishedAt)}</span>
            <span className="opacity-40">·</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {article.readMinutes}분
            </span>
          </div>
        </div>
      </GlassCard>
      </Pressable>
    </Link>
  );
}
