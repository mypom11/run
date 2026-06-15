import { Suspense } from "react";
import { Skeleton } from "@/shared/ui";
import { HomeHero } from "./HomeHero";
import { FeaturedRaces } from "./FeaturedRaces";
import { QuickLinks } from "./QuickLinks";

export function HomeView() {
  return (
    <div className="mx-auto max-w-6xl px-5">
      <HomeHero />
      <Suspense fallback={<RacesFallback />}>
        <FeaturedRaces />
      </Suspense>
      <QuickLinks />
    </div>
  );
}

function RacesFallback() {
  return (
    <section className="py-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    </section>
  );
}
