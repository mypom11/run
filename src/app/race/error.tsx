"use client";

import { useEffect } from "react";
import { Button, GlassCard } from "@/shared/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-5 pt-20">
      <GlassCard className="p-8 text-center">
        <h2 className="font-display text-2xl tracking-tight">
          대회 일정을 불러오지 못했습니다
        </h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          잠시 후 다시 시도해주세요.
        </p>
        <div className="mt-6">
          <Button onClick={reset}>다시 시도</Button>
        </div>
      </GlassCard>
    </div>
  );
}
