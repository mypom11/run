/**
 * SEO를 위한 JSON-LD 구조화 데이터 빌더.
 * 대회 상세 페이지에서 `<script type="application/ld+json">`로 삽입.
 */
import type { NormalizedRace } from "@/entities/race";

export function raceEventJsonLd(race: NormalizedRace) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: race.title,
    startDate: race.startDate ?? undefined,
    endDate: race.endDate ?? undefined,
    location: race.location
      ? { "@type": "Place", name: race.location }
      : undefined,
    sport: "Running",
    url: race.officialUrl ?? race.compUrl ?? undefined,
    image: race.thumbnail ?? undefined,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Runable",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://runable.me",
    sameAs: [],
  };
}
