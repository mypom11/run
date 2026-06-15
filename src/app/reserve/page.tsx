import type { Metadata } from "next";
import { ReserveView } from "@/views/reserve";

export const metadata: Metadata = {
  title: "예약 상세",
  description: "대회 접수 상세. 종목 선택 후 결제하세요.",
};

// 접수 상세는 정적 셸로 두고 (사용자 무관한 콘텐츠), 결제 단계만 동적.
// 트래픽 폭주 시 정적 셸은 CDN에서 즉시 응답되어 오리진 부하를 줄인다.
export const dynamic = "force-static";

export default function Page() {
  return <ReserveView />;
}
