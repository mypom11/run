import type { Metadata } from "next";
import { MagazineView } from "@/views/magazine";

export const metadata: Metadata = {
  title: "매거진",
  description:
    "러너를 위한 가이드, 영양, 장비 그리고 사람들의 이야기. 러너 매거진.",
};

export default function Page() {
  return <MagazineView />;
}
