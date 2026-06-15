"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * 하이드레이션 이후에만 true를 반환. React 공식 패턴.
 * setState in effect 없이 SSR/CSR 불일치를 안전하게 회피.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
