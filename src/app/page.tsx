import { HomeView } from "@/views/home";

// 홈은 정적이지만 FeaturedRaces가 BFF를 호출하므로
// 라우트는 부분적으로 동적. Suspense 안에서 fetch가 ISR 캐시된다.
export const revalidate = 60;

export default function Page() {
  return <HomeView />;
}
