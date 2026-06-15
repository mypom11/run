import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard, getRecentArticles } from "@/entities/article";

export function MagazineSection() {
  const items = getRecentArticles(4);
  const [hero, ...rest] = items;

  return (
    <section className="py-14">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--accent)]">
            Magazine
          </p>
          <h2 className="font-display mt-1 text-3xl tracking-tight sm:text-4xl">
            러닝 인사이트
          </h2>
        </div>
        <Link
          href="/magazine"
          className="hidden items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] sm:flex"
        >
          전체 보기 <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ArticleCard article={hero} variant="large" />
        <div className="grid gap-4">
          {rest.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
