import { Suspense } from "react";
import { Skeleton } from "@/shared/ui";
import { MagazineSection } from "@/widgets/magazine-section";
import { RunTripSection } from "@/widgets/runtrip-section";
import { HomeHero } from "./HomeHero";
import { FeaturedRaces } from "./FeaturedRaces";
import { ToolsBand } from "./ToolsBand";
import { PaceCTA } from "./PaceCTA";

export function HomeView() {
  return (
    <>
      <HomeHero />
      <div className="mx-auto max-w-6xl px-5">
        <ToolsBand />
        <Suspense fallback={<RacesFallback />}>
          <FeaturedRaces />
        </Suspense>
        <RunTripSection />
        <PaceCTA />
        <MagazineSection />
      </div>
    </>
  );
}

function RacesFallback() {
  return (
    <section className="py-14">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    </section>
  );
}
