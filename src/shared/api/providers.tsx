"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MotionConfig } from "framer-motion";
import { getQueryClient } from "./queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {/* 접근성: 사용자의 prefers-reduced-motion을 모든 모션에 전역 적용 */}
      <MotionConfig reducedMotion="user">
        {children}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        )}
      </MotionConfig>
    </QueryClientProvider>
  );
}
