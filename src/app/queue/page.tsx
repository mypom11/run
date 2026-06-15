import type { Metadata } from "next";
import { Suspense } from "react";
import { QueueView } from "@/views/queue";
import { Skeleton } from "@/shared/ui";

export const metadata: Metadata = {
  title: "대기실",
  description: "접수 폭주 시 안전한 진입을 위한 대기열 화면입니다.",
};

// useSearchParams를 사용하므로 Suspense boundary 필요.
// 라우트는 동적이지만 본문은 100% 클라이언트 — 서버 자원 거의 사용 안 함.
export default function Page() {
  return (
    <Suspense fallback={<QueueFallback />}>
      <QueueView />
    </Suspense>
  );
}

function QueueFallback() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <Skeleton className="h-[520px] w-full" />
    </div>
  );
}
