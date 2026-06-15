/**
 * POST /api/vitals — Web Vitals 수집 엔드포인트.
 * 운영 환경에서는 외부 메트릭 백엔드(예: Datadog, CloudWatch)로 forwarding.
 * 현재는 dev에서만 콘솔 출력.
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    if (process.env.NODE_ENV !== "production") {
      console.log("[web-vitals]", body);
    }
    // 운영: 여기서 외부 메트릭 시스템으로 전송 (또는 큐에 적재)
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
