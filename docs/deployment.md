# 배포 — AWS Fargate + CloudFront + S3

회사 인프라가 AWS Fargate 기반이므로 다음 구성이 표준이다.

## 토폴로지

```
사용자
  │
  ▼
CloudFront (CDN, 정적 자원 캐싱 + Lambda@Edge)
  │
  ├─ /_next/static/*  →  S3 (immutable, max-age=1y)
  ├─ /api/*           →  ALB → Fargate (Next route handler)
  └─ /*               →  ALB → Fargate (Next 서버, SSR/ISR/RSC)
```

## Fargate (Next.js 서버)

- Node 20 LTS, standalone 출력 권장 (필요시 `next.config.ts`에 `output: "standalone"`).
- 컨테이너 1개당 워커는 CPU 수에 맞춰. Fargate 0.5 vCPU 기준 1 워커.
- `NEXT_SHARP_PATH` 환경변수 또는 `sharp` 포함 베이스 이미지 사용 (이미지 최적화).
- 헬스체크: ALB Target Group이 `/api/health`를 200 OK로 받게 한다 (별도 라우트 추가 시).
- HPA: CPU 60% 또는 RPS 기반. 스파이크 대비 minimum capacity 여유 있게.

## CloudFront

- Behavior:
  - `/_next/static/*`: S3 origin, max-age 1년, immutable.
  - `/images/*`, `/icons/*`: S3 origin.
  - `/_next/image*`: Fargate origin (Next의 image optimizer).
  - 기타: Fargate origin. Cookie / Authorization은 화이트리스트로 통과.
- Cache Key: 기본 (host + path + query). 사용자별 변동되는 쿠키는 캐시 키에서 제외, 또는 Vary 사용.
- TTL은 응답의 `Cache-Control: s-maxage` 우선.

## S3

- `next build` 산출물 중 `.next/static`을 빌드 시 sync.
- 정적 페이지 HTML(혹시 export 사용 시)도 S3에 둘 수 있으나, 본 프로젝트는 Fargate에서 ISR로 처리.
- 외부 사용자 업로드/이미지는 별도 버킷, public read는 CloudFront 경유로만.

## Lambda@Edge / CloudFront Functions

- **Origin Request**: 디바이스/지역 헤더 정규화로 캐시 키 폭발 방지.
- **Viewer Request**: A/B 분기, 봇 차단, 리다이렉트.
- **Response**: 보안 헤더(HSTS, CSP) 강제 부여. (`next.config.ts`의 headers와 중복 시 엣지 우선.)

## 환경 변수

- 빌드 시 필요: `NEXT_PUBLIC_*`만 클라이언트에 노출.
- 런타임 비밀: SSM Parameter Store 또는 Secrets Manager → 컨테이너 ENV에 주입.
- 로컬은 `.env.local`, CI는 GitHub OIDC + AWS IAM Role로 secret-less 빌드.

## 캐시 무효화

- 정적: 새 빌드 → 새 hash → 새 URL → 자동 무효화. CloudFront 인밸리데이션은 `_next/static`엔 불필요.
- 동적/ISR: `revalidateTag` / `revalidatePath`로 next 측 캐시 무효화. CloudFront 캐시는 `s-maxage`+`SWR`로 자연 만료.
- 긴급: CloudFront `CreateInvalidation` API (드물게).

## 모니터링

- CloudWatch: ALB 5xx, Fargate CPU/Mem, request count.
- 별도 RUM: Web Vitals (`/api/vitals` 엔드포인트) → CloudWatch 또는 Datadog.
- 알람: 5xx > 1% / 5min, p95 > 1s.
