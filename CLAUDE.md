@AGENTS.md

# 프로젝트 컨텍스트

특정 홈페이지 리뉴얼. **Next.js 16 App Router + React 19 + Tailwind v4** 기반.
외부 API는 없고, 데이터 페칭은 Next 서버 컴포넌트 / React Query.
**대규모 트래픽**을 가정한다 — 정적/캐시가 기본, 동적은 예외.

## 스택
- Next.js 16.2 (App Router, Cache Components 모델 사용 예정)
- React 19 (Server Components 기본)
- TypeScript 5
- Tailwind CSS v4 (현재) — 회사 표준은 Styled Components (docs/styling.md 참고)
- shadcn/ui 패턴 (컴포넌트는 프로젝트에 복사해 소유)
- TanStack Query v5 (서버 상태) + TanStack Virtual (대량 리스트)
- Zustand (클라이언트 UI 상태)
- React Hook Form + Yup (폼/검증, 회사 표준)
- Chart.js (시각화)
- 아키텍처: Feature-Sliced Design (FSD)
- 테스트: Cypress (E2E 스모크), CI: GitHub Actions
- 인프라 가정: AWS Fargate + CloudFront + S3 (docs/deployment.md)

## 폴더 구조 (FSD)
```
src/
  app/        Next App Router (라우팅만, 얇은 래퍼)
  views/      FSD pages 레이어 (이름 충돌 회피)
  widgets/    조합 블록
  features/   사용자 행위
  entities/   도메인 모델
  shared/
    ui/       shadcn/ui + 자체 프리미티브
    api/      http, queryClient
    config/   env, 상수
    lib/      유틸 (cn 등)
    hooks/    공용 훅
    types/    전역 타입
```

레이어 의존성은 단방향: `shared ← entities ← features ← widgets ← views ← app`.
슬라이스 간 임포트는 항상 public API(`index.ts`)로만.

## 절대 규칙 (Hard Rules)

1. **정적 우선.** 새 라우트는 SSG 또는 ISR로 출발. SSR/CSR로 전환할 땐 docs/rendering.md 결정 트리로 정당화.
2. **Server Components가 기본.** `"use client"`는 상호작용/브라우저 API가 필요할 때만, 트리 **말단**에서.
3. **데이터는 한 곳에서.** 서버 데이터는 React Query, 클라이언트 UI 상태는 Zustand. 절대 섞지 않는다.
4. **번들 누수 금지.** 서버 전용 패키지를 Client 컴포넌트에서 import 금지. 무거운 클라이언트 의존성은 `next/dynamic`.
5. **fetch는 dedup된다.** 같은 데이터는 같은 함수로 부른다. `useEffect + fetch` 패턴 금지.
6. **컴포넌트는 shadcn 패턴.** `src/shared/ui/`에 복사된 컴포넌트를 사용/수정한다. 새 UI 라이브러리 도입 금지.
7. **Next.js 16의 변경에 주의.** AGENTS.md 지시대로 `node_modules/next/dist/docs/`를 우선 참고. 훈련 데이터의 Next 14/15 패턴과 다를 수 있다.
8. **임의로 의존성 추가 금지.** 새 패키지 도입은 PR에서 합의 후.
9. **코멘트는 "왜"만.** 식별자가 설명하지 못하는 제약/이유만 적는다.

## 작업 흐름

1. `docs/` 의 관련 파일을 먼저 읽는다.
2. 변경이 어느 레이어인지 결정 (`shared`/`entities`/`features`/`widgets`/`views`/`app`).
3. 새 슬라이스면 `index.ts` 부터 정의 (public API 우선).
4. Server vs Client 결정. 기본은 Server.
5. 렌더링 전략 결정 (정적 / ISR / 스트리밍 / CSR). docs/rendering.md 참고.
6. 데이터: 서버 prefetch → Hydration이 기본. 클라이언트 전용은 React Query.
7. 새 의존성이 필요하면 추가 전에 docs/performance.md 체크리스트 확인.

## 문서 인덱스
- `docs/README.md` — 전체 개요
- `docs/architecture.md` — FSD 레이어와 Next 통합
- `docs/conventions.md` — 네이밍/임포트/스타일
- `docs/rendering.md` — SSG/ISR/SSR/CSR 선택 기준 (Cache Components)
- `docs/state.md` — React Query / Zustand 경계
- `docs/components.md` — shadcn/ui 사용법
- `docs/styling.md` — Tailwind ↔ Styled Components
- `docs/performance.md` — 고트래픽 체크리스트
- `docs/spike-traffic.md` — 스파이크 이벤트 대응
- `docs/testing.md` — Cypress 운영
- `docs/deployment.md` — AWS 토폴로지
- `docs/analystic/` — 리뉴얼 대상(runable.me) 분석 보고서

## 명령어
- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드 (라우트 정적/동적 결과 검증)
- `npm run start` — 프로덕션 모드 실행
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run test:e2e` — Cypress 헤드리스
- `npm run test:e2e:open` — Cypress GUI

## 현재 라우트
- `/` 홈 (정적 + Suspense로 추천 대회 동적 섹션 합성)
- `/race` 대회 캘린더 (BFF `/api/races` → runable.me 일정 정규화 + ISR)
- `/magazine` 매거진 (정적 콘텐츠)
- `/runtrip` 런트립 (정적 콘텐츠)
- `/pace-calculator` 페이스/속도 계산기 (CSR, RHF+Yup)
- `/api/races`, `/api/vitals`, `/robots.txt`, `/sitemap.xml`

## 데이터 소스
- 외부 의존: **대회 일정만** runable.me public API 프록시.
- 매거진/런트립은 정적 데이터(`src/entities/article`, `src/entities/runtrip`).
- 미래 확장: 동일 패턴으로 BFF만 추가하면 어떤 콘텐츠든 끼울 수 있다.

## 미정 / 결정 대기
- 디자인 토큰/팔레트는 디자인 픽스 후 `globals.css`의 Tailwind v4 변수로 반영.
- 매거진/런트립 상세 라우트(`/magazine/[slug]`, `/runtrip/[slug]`)는 콘텐츠 확정 후 추가.
