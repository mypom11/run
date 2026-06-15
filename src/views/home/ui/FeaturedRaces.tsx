import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchRaces } from "@/entities/race";
import { RaceCard } from "@/entities/race/ui/RaceCard";
import { GlassCard } from "@/shared/ui";
import { RaceStatsCard } from "@/widgets/race-stats";
import { headers } from "next/headers";

/**
 * Server Component: 다가오는 대회 6개를 SSR로 가져와 렌더링.
 * BFF에 절대 URL이 필요하므로 host 헤더로 origin 구성.
 */
export async function FeaturedRaces() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  const now = new Date();
  const end = new Date(now);
  end.setMonth(end.getMonth() + 3);

  let allItems: Awaited<ReturnType<typeof fetchRaces>>["items"] = [];
  try {
    const res = await fetchRaces(
      {
        from: now.toISOString().slice(0, 10),
        to: end.toISOString().slice(0, 10),
      },
      baseUrl,
    );
    allItems = res.items;
  } catch {
    allItems = [];
  }
  const items = allItems.slice(0, 6);

  return (
    <section className="py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--accent)]">Upcoming</p>
          <h2 className="font-display mt-1 text-3xl tracking-tight sm:text-4xl">
            다가오는 대회
          </h2>
        </div>
        <Link
          href="/race"
          className="hidden items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] sm:flex"
        >
          전체 보기 <ArrowRight className="size-4" />
        </Link>
      </div>

      {items.length === 0 ? (
        <GlassCard className="p-10 text-center text-[var(--fg-muted)]">
          예정된 대회가 없습니다.
        </GlassCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>
      )}
      <div className="mt-6">
        <RaceStatsCard races={allItems} />
      </div>
    </section>
  );
}
