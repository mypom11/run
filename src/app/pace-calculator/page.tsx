import type { Metadata } from "next";
import { PaceCalculatorView } from "@/views/pace-calculator";

export const metadata: Metadata = {
  title: "페이스 계산기",
  description: "거리·페이스로 완주 시간을 구하고 트레드밀 속도를 페이스로 환산하세요.",
};

// 클라이언트 인터랙션만 있고 외부 데이터가 없어 완전 정적.
export const dynamic = "force-static";

export default function Page() {
  return <PaceCalculatorView />;
}
