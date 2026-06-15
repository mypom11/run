import type { Metadata } from "next";
import { RunTripView } from "@/views/runtrip";

export const metadata: Metadata = {
  title: "런트립",
  description:
    "도쿄, 베를린, 호놀룰루, 피렌체. 참가권부터 항공·숙박까지 한 번에 — 러너를 위한 해외 마라톤 여행.",
};

export default function Page() {
  return <RunTripView />;
}
