export interface RunTrip {
  id: string;
  slug: string;
  destination: string;       // 도시
  country: string;
  raceName: string;
  startDate: string;         // ISO
  endDate: string;           // ISO
  nights: number;
  priceFrom: number;         // KRW
  tagline: string;
  highlights: string[];
  cover: string;
  badges?: string[];
}
