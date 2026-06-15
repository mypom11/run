"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Web Vitals 수집 → /api/vitals 로 sendBeacon 전송.
 * sendBeacon은 페이지 언로드 시에도 안전하게 보낸다.
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      path:
        typeof window !== "undefined" ? window.location.pathname : undefined,
    });

    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon("/api/vitals", body);
    } else {
      fetch("/api/vitals", { method: "POST", body, keepalive: true }).catch(
        () => {},
      );
    }
  });
  return null;
}
