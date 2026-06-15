export type ArticleCategory =
  | "training"
  | "nutrition"
  | "gear"
  | "interview"
  | "lifestyle"
  | "guide";

export const ARTICLE_CATEGORY_LABEL: Record<ArticleCategory, string> = {
  training: "트레이닝",
  nutrition: "영양",
  gear: "장비",
  interview: "인터뷰",
  lifestyle: "라이프",
  guide: "가이드",
};

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  author: string;
  readMinutes: number;
  publishedAt: string; // ISO
  cover: string;
  featured?: boolean;
}
