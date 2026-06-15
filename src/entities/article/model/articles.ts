import type { Article } from "./types";

const img = (seed: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const ARTICLES: Article[] = [
  {
    id: "a-1",
    slug: "12-week-marathon-plan",
    title: "첫 풀코스 완주를 위한 12주 트레이닝 플랜",
    excerpt:
      "5km는 거뜬한데 풀코스가 막막한 러너를 위한 단계별 가이드. 주간 거리·페이스·회복 일정을 한눈에.",
    category: "training",
    author: "김태형",
    readMinutes: 9,
    publishedAt: "2026-06-12",
    cover: img("runable-mag-12w"),
    featured: true,
  },
  {
    id: "a-2",
    slug: "rain-season-routine",
    title: "장마철에도 멈추지 않는 러너들의 루틴",
    excerpt:
      "비 오는 날 트레드밀, 실내 인터벌, 코어 보강 — 우천이 변명이 되지 않는 7가지 옵션.",
    category: "training",
    author: "이서연",
    readMinutes: 6,
    publishedAt: "2026-06-09",
    cover: img("runable-mag-rain"),
  },
  {
    id: "a-3",
    slug: "carb-loading-truth",
    title: "탄수화물 로딩, 정말 효과가 있을까?",
    excerpt:
      "스포츠 영양사가 풀어주는 글리코겐 저장 메커니즘. 누구에게 효과가 있고 누구에겐 역효과인지.",
    category: "nutrition",
    author: "박지원",
    readMinutes: 7,
    publishedAt: "2026-06-05",
    cover: img("runable-mag-carb"),
  },
  {
    id: "a-4",
    slug: "shoe-pick-by-foot",
    title: "발 모양으로 고르는 러닝화 가이드",
    excerpt:
      "오버프로네이션, 평발, 하이아치 — 내 발에 맞는 러닝화는 모델명이 아니라 카테고리부터.",
    category: "gear",
    author: "송민호",
    readMinutes: 8,
    publishedAt: "2026-06-01",
    cover: img("runable-mag-shoes"),
  },
  {
    id: "a-5",
    slug: "han-river-routes-top7",
    title: "한강에서 가장 사랑받는 러닝 코스 TOP 7",
    excerpt:
      "초보 5K부터 풀코스 LSD까지. 거리·고저차·편의시설을 함께 정리한 한강 러닝 지도.",
    category: "guide",
    author: "윤하늘",
    readMinutes: 5,
    publishedAt: "2026-05-28",
    cover: img("runable-mag-hangang"),
    featured: true,
  },
  {
    id: "a-6",
    slug: "elite-recovery-routine",
    title: "프로 마라토너의 회복 루틴 5가지",
    excerpt:
      "엘리트 러너들이 매일 반복하는 회복 루틴. 폼롤러 · 영양 · 수면 · 액티브 리커버리 · 마인드.",
    category: "interview",
    author: "정유진",
    readMinutes: 10,
    publishedAt: "2026-05-22",
    cover: img("runable-mag-recovery"),
  },
  {
    id: "a-7",
    slug: "10k-to-half-safely",
    title: "10K에서 하프로: 거리를 늘리는 안전한 방법",
    excerpt:
      "주간 마일리지 10% 룰의 진실, 부상 없이 거리를 늘리기 위한 4가지 신호.",
    category: "training",
    author: "최도윤",
    readMinutes: 7,
    publishedAt: "2026-05-18",
    cover: img("runable-mag-10kto21k"),
  },
  {
    id: "a-8",
    slug: "winter-dawn-running",
    title: "추운 겨울 새벽 러닝, 이렇게 입어요",
    excerpt:
      "체감온도 별 레이어링 공식과 손·귀·코를 지키는 작은 디테일.",
    category: "lifestyle",
    author: "한가은",
    readMinutes: 5,
    publishedAt: "2026-05-10",
    cover: img("runable-mag-winter"),
  },
];

export function getFeaturedArticles(limit = 3) {
  const featured = ARTICLES.filter((a) => a.featured);
  return featured.length >= limit
    ? featured.slice(0, limit)
    : [...featured, ...ARTICLES.filter((a) => !a.featured)].slice(0, limit);
}

export function getRecentArticles(limit = 6) {
  return [...ARTICLES]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);
}
