import { Heart, MessageCircle, Eye } from "lucide-react";
import { GlassCard } from "@/shared/ui";
import { formatRelative } from "@/shared/lib/utils";
import type { NormalizedPost } from "../model/types";

interface PostItemProps {
  post: NormalizedPost;
}

export function PostItem({ post }: PostItemProps) {
  return (
    <GlassCard className="group p-5 transition-all duration-200 hover:bg-white/[0.08] hover:border-white/15">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
            {post.categoryName && (
              <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-medium">
                {post.categoryName}
              </span>
            )}
            <span className="font-medium text-[var(--fg)]">
              {post.authorName}
            </span>
            {post.createdAt && (
              <>
                <span className="opacity-50">·</span>
                <span>{formatRelative(post.createdAt)}</span>
              </>
            )}
          </div>
          <h3 className="mt-2 font-display text-lg leading-tight text-[var(--fg)] line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--fg-muted)] line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs text-[var(--fg-subtle)]">
            <span className="flex items-center gap-1">
              <Heart className="size-3.5" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {post.commentCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {post.viewCount}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
