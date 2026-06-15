# Runable

> **달리자, 나답게.**
> 대회 접수부터 기록·매거진·런트립까지 — 러너를 위한 올인원 웹 플랫폼 리뉴얼.

[runable.me](https://runable.me/)를 토대로 한 Next.js 16 기반 프론트엔드 리뉴얼 프로젝트. 대규모 트래픽을 가정해 정적 우선 렌더링·요청 dedup·대기실 게이트 같은 패턴을 실제로 구현했고, 디자인은 Nike Run 앱의 톤에 글래스모피즘과 Apple식 세련됨을 더했다.

---

## 목차

1. [무엇을 만들었나](#무엇을-만들었나)
2. [기술 스택](#기술-스택)
3. [라우트 / 화면](#라우트--화면)
4. [트래픽 보호 — 대기열 게이트 패턴](#트래픽-보호--대기열-게이트-패턴)
5. [아키텍처 (FSD)](#아키텍처-fsd)
6. [BFF — runable.me 공개 API 프록시](#bff--runableme-공개-api-프록시)
7. [성능 전략](#성능-전략)
8. [디자인 시스템](#디자인-시스템)
9. [시작하기](#시작하기)
10. [스크립트](#스크립트)
11. [폴더 구조](#폴더-구조)
12. [문서](#문서)
13. [배포 토폴로지](#배포-토폴로지)
14. [앞으로](#앞으로)

---

## 무엇을 만들었나

- **대회 캘린더**: 달력 / 목록 / **지도**(Leaflet + CartoDB 다크 타일) 3개 뷰. runable.me 공개 API를 BFF로 프록시 → ISR 캐싱
- **검색**: URL search params(`?q=&region=`) 단일 진실. 캘린더·목록·지도가 동시에 필터링됨. 새로고침·공유에도 유지
- **예약 상세**: 정적 셸로 빌드 시 미리 렌더 — 트래픽 폭주에도 CDN에서 즉시 응답
- **대기실 게이트**: 트래픽 보호 스위치 ON 상태에서 시작하기 클릭 시 큐 화면을 거쳐 입장. 순번 카운트다운·ETA·진행률 + 적용 중인 보호 기법 패널
- **매거진 · 런트립 · 페이스 계산기**: 정적 콘텐츠 + 클라이언트 인터랙션 (RHF + Yup)
- **반응형**: 모바일 하단 탭바 + 햄버거 메뉴(Radix Dialog), 데스크탑 sticky glass 헤더
- **테스트 & CI**: Cypress E2E 스모크 + GitHub Actions(lint → typecheck → build → cypress)
- **SEO / 메트릭**: sitemap, robots, JSON-LD 헬퍼, Web Vitals → sendBeacon `/api/vitals`

---

## 기술 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | **Next.js 16 (App Router)** + React 19 (Server Components 기본) |
| 언어 | TypeScript 5 (strict) |
| 스타일 | Tailwind CSS v4 + CSS 변수 토큰 (글래스모피즘 프리미티브) |
| 컴포넌트 | shadcn/ui 패턴(복사·소유), Radix Dialog, lucide-react |
| 서버 상태 | TanStack Query v5 (+ Devtools) |
| 클라이언트 상태 | Zustand (+ persist 미들웨어) |
| 폼 | React Hook Form + Yup |
| 데이터 시각화 | Chart.js (canvas 직접 사용 — react-chartjs-2 미사용) |
| 가상화 | @tanstack/react-virtual |
| 지도 | Leaflet + OpenStreetMap (CartoDB dark tiles, API 키 불필요) |
| 테스트 | Cypress (E2E 스모크) |
| CI | GitHub Actions |
| 인프라 가정 | AWS Fargate + CloudFront + S3 |

---

## 라우트 / 화면

| 경로 | 렌더링 | 설명 |
|---|---|---|
| `/` | 동적 (Suspense + SSR 프리페치) | 시네마틱 히어로 → Tools Band → Featured Races(API) → Runtrip 티저 → Pace CTA → Magazine 그리드 |
| `/race` | 동적 (BFF) | 캘린더 / 목록 / 지도 3-뷰, 종목·지역 필터, 검색, 셀 클릭 시 그날 대회 모달 |
| `/magazine` | 정적 | 8개 큐레이션 기사 + 카테고리 필터 |
| `/runtrip` | 정적 | 6개 해외 마라톤 패키지 (도쿄·호놀룰루·후지·피렌체·부다페스트·베를린) |
| `/pace-calculator` | 정적 | 거리·페이스→완주 시간, 트레드밀 속도→페이스 (RHF + Yup) |
| `/reserve` | 정적(force-static) | 대회 접수 상세 — 트래픽 폭주 대비 정적 셸 |
| `/queue` | 정적 셸 + 클라이언트 시뮬레이션 | 대기열 게이트 (Suspense로 `?next=` 처리) |
| `/api/races` | Route Handler (ISR) | runable.me `/comp/schedule` 정규화 프록시 |
| `/api/vitals` | Route Handler | Web Vitals beacon 수신 |
| `/sitemap.xml`, `/robots.txt`, `/icon.svg`, `/apple-icon` | 자동 생성 | App Router 메타데이터 라우트 |

---

## 트래픽 보호 — 대기열 게이트 패턴

대형 마라톤 접수 시즌의 스파이크 트래픽을 가정한 프론트엔드 보호 동선.

**스위치**: 헤더 우측 상단 **시작하기** 버튼 좌측 (`md+`), 또는 모바일 메뉴 안 (`md-`). 상태는 Zustand persist로 localStorage 보관.

```
시작하기 (Off)  →  /reserve           (직진)
시작하기 (On)   →  /queue?next=/reserve  →  순번 0 도달  →  /reserve
```

**대기실 화면(`/queue`)에서 시각화되는 것**

| 보호 기법 | 어디서 구현되는가 |
|---|---|
| **CDN 캐싱** | `next.config.ts` 정적 자산 immutable 캐시 + CloudFront 가정 (`docs/deployment.md`) |
| **SSG / ISR 정적 셸** | `/reserve`는 `dynamic = "force-static"`, `/queue`는 Suspense + 정적 셸 → 오리진 거의 사용 안 함 |
| **요청 중복 제거** | Next `fetch` 자동 dedup + React Query `staleTime: 60s` + 쿼리 키 통일 |
| **대기열 게이트** | `/queue`가 사용자별 가상 순번을 보여주며 백엔드로 가는 트래픽을 자연스럽게 평탄화 |

**클라이언트 폭주 방지 (예약 페이지 결제 버튼)**

```tsx
const [submitting, setSubmitting] = useState(false);
const [done, setDone] = useState(false);
const handleSubmit = () => {
  if (submitting || done) return;  // 중복 클릭 차단
  setSubmitting(true);
  // ... 결제 API 호출
};
// <Button disabled={submitting || done}>  → 디바운스 + 멱등
```

---

## 아키텍처 (FSD)

Feature-Sliced Design 6 레이어. 의존성은 단방향.

```
shared ← entities ← features ← widgets ← views ← app
```

| 레이어 | 위치 | 역할 |
|---|---|---|
| `app` (Next 라우팅) | `src/app/` | 라우트만, 비즈니스 로직 금지 |
| `views` | `src/views/` | 화면(=FSD pages 레이어, Next 충돌 회피로 rename) |
| `widgets` | `src/widgets/` | 큰 조합 블록 (Header, Footer, MagazineSection, RaceStatsCard 등) |
| `features` | `src/features/` | 사용자 행위 (race-calendar, race-map, race-search, queue-mode, pace-calculator) |
| `entities` | `src/entities/` | 도메인 모델 (race, article, runtrip) — 타입·API·UI |
| `shared` | `src/shared/` | 도메인 무관 (`ui/`, `api/`, `lib/`, `hooks/`, `config/`, `types/`) |

슬라이스 외부는 항상 `index.ts` public API로만 진입. 자세한 규칙은 `docs/architecture.md`.

---

## BFF — runable.me 공개 API 프록시

캘린더만 외부 데이터에 의존하고, 그 외(매거진·런트립·페이스 계산기)는 자체 정적 콘텐츠.

```
브라우저  →  /api/races  →  runable.me/next-api/index/v1/comp/schedule
            (same-origin)    (Route Handler — 정규화 + ISR + cacheTag)
```

- `runableGet()` (`src/shared/api/http.ts`) 가 base URL · auth=false 쿼리 · `next.revalidate` · `cacheTag` 일괄 처리
- 응답을 `NormalizedRace`로 변환 → 클라이언트는 외부 응답 형식 변동에 영향받지 않음
- `Cache-Control: s-maxage=60, stale-while-revalidate=300` 헤더로 CDN/엣지 흡수

---

## 성능 전략

| 카테고리 | 적용 |
|---|---|
| 렌더링 우선순위 | 가능한 모든 페이지 SSG/ISR. 사용자별 데이터는 Suspense로 스트리밍 |
| 번들 분할 | `next/dynamic` + `ssr: false` — Chart.js, Leaflet, RaceMap |
| 트리셰이킹 | `next.config.experimental.optimizePackageImports`: `lucide-react`, `date-fns`, `@tanstack/react-query` |
| 가상화 | 긴 리스트(40개+)는 `@tanstack/react-virtual` 자동 적용 (예: 커뮤니티 피드는 폐기됐지만 패턴은 코드에 보존) |
| 호출 dedup | Next fetch 자동 + React Query 쿼리 키 통일 + 디바운스 검색 (250ms) |
| 이미지 | `next/image` + `images.remotePatterns` (storage.runable.me / picsum / unsplash) + `priority` LCP만 |
| 폰트 | `next/font/google` Inter + Space Grotesk (CLS 0, 자동 preload) |
| 메트릭 | `useReportWebVitals` → `sendBeacon('/api/vitals')` → (운영) 외부 메트릭 백엔드 |
| 보안 헤더 | `next.config.ts`에서 X-Frame-Options, Referrer-Policy, Permissions-Policy |

자세한 체크리스트는 `docs/performance.md` · `docs/spike-traffic.md`.

---

## 디자인 시스템

**톤**: Nike Run의 굵직한 디스플레이 타이포 + 글래스모피즘 + Apple식 미세한 디테일.

**팔레트** (`globals.css`의 CSS 변수)
- bg-base `#0a0a0a` → 그라데이션 + 라디얼 액센트 글로우
- accent `#FF5A1F` (러닝 오렌지), accent-strong `#FF7A3A`
- glass-bg `rgba(255,255,255,0.06)`, backdrop-blur 24~32px + saturate 140~160%

**프리미티브** (`src/shared/ui/`)
- `Button` · `Badge` · `GlassCard` · `Skeleton` · `Segmented` · `Switch` · `Dialog` · `BarChart`

**타이포** : 본문 Inter, 디스플레이 Space Grotesk. `font-display` 유틸리티가 자간 `-0.04em` + 800.

자세한 마이그레이션 경로(Tailwind ↔ Styled Components)는 `docs/styling.md`.

---

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 (http://localhost:3000)
npm run dev

# 프로덕션 빌드 & 실행
npm run build && npm run start
```

Node.js 20 LTS 권장.

---

## 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 (라우트 정적/동적 결과 검증) |
| `npm run start` | 프로덕션 모드 실행 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:e2e` | Cypress 헤드리스 (CI와 동일) |
| `npm run test:e2e:open` | Cypress GUI |

---

## 폴더 구조

```
runable/
├── docs/                           프로젝트 규칙 문서
│   ├── README.md, architecture.md, conventions.md,
│   ├── rendering.md, state.md, components.md, styling.md,
│   ├── performance.md, spike-traffic.md, testing.md, deployment.md
│   └── analystic/                  리뉴얼 대상(runable.me) 분석 보고서
├── cypress/                        E2E 테스트 + fixture
│   ├── e2e/smoke.cy.ts
│   ├── fixtures/races.json
│   └── support/e2e.ts
├── .github/workflows/ci.yml        lint → typecheck → build → cypress
├── public/                         정적 파일
├── src/
│   ├── app/                        Next App Router (라우트만)
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   ├── icon.svg, apple-icon.tsx, sitemap.ts, robots.ts, not-found.tsx
│   │   ├── api/
│   │   │   ├── races/route.ts      BFF: runable.me 일정 프록시
│   │   │   └── vitals/route.ts     Web Vitals 수신
│   │   ├── race/                   page + loading + error
│   │   ├── magazine/, runtrip/, pace-calculator/, reserve/, queue/
│   │   └── ...
│   ├── views/                      FSD pages 레이어
│   │   ├── home/                   HomeView + 섹션 컴포넌트들
│   │   ├── race/, magazine/, runtrip/
│   │   ├── pace-calculator/
│   │   ├── reserve/, queue/
│   ├── widgets/
│   │   ├── header/                 Header + MobileNavMenu
│   │   ├── mobile-tab-bar/, footer/
│   │   ├── magazine-section/, runtrip-section/, race-stats/
│   ├── features/
│   │   ├── race-calendar/          캘린더 그리드 + DayRacesDialog
│   │   ├── race-map/               Leaflet 지도 (vanilla)
│   │   ├── race-search/            URL params 기반 검색
│   │   ├── pace-calculator/        RHF + Yup
│   │   └── queue-mode/             스위치 + Store + StartButton
│   ├── entities/
│   │   ├── race/                   타입 · 키 · fetcher · 카드/칩
│   │   ├── article/                매거진 정적 데이터
│   │   └── runtrip/                런트립 정적 데이터
│   └── shared/
│       ├── ui/                     디자인 시스템 프리미티브
│       ├── api/                    http · queryClient · Providers
│       ├── lib/                    cn, 포맷터, jsonLd, web-vitals, locations
│       ├── hooks/                  useDebouncedValue, useIsClient
│       ├── config/                 runable API base, NAV_ITEMS
│       └── types/
├── next.config.ts                  이미지 도메인 · 보안 헤더 · optimizePackageImports
├── tsconfig.json, eslint.config.mjs, cypress.config.ts
├── CLAUDE.md                       Claude Code용 하네스
└── AGENTS.md                       Next.js 16 변경사항 안내
```

---

## 문서

| 파일 | 내용 |
|---|---|
| `docs/architecture.md` | FSD 레이어 ↔ Next App Router 매핑 |
| `docs/conventions.md` | 네이밍·임포트·코드 스타일 |
| `docs/rendering.md` | SSG/ISR/SSR/CSR 결정 트리 (Next 16 Cache Components 포함) |
| `docs/state.md` | React Query / Zustand 경계 |
| `docs/components.md` | shadcn/ui 패턴 |
| `docs/styling.md` | Tailwind v4 ↔ Styled Components 마이그레이션 경로 |
| `docs/performance.md` | 고트래픽 체크리스트 |
| `docs/spike-traffic.md` | 스파이크 이벤트 대응(대기실 패턴 포함) |
| `docs/testing.md` | Cypress 운영 |
| `docs/deployment.md` | AWS Fargate + CloudFront + S3 토폴로지 |
| `docs/analystic/runable_site_analysis.md` | 원본 사이트맵·플로우 분석 |
| `docs/analystic/runable_api_analysis.md` | 원본 API/CORS 분석 |

---

## 배포 토폴로지

```
사용자
  │
  ▼
CloudFront (CDN · Lambda@Edge)
  │
  ├─ /_next/static/*     →  S3 (immutable, max-age=1y)
  ├─ /api/*              →  ALB → Fargate (Next route handler)
  └─ /*                  →  ALB → Fargate (Next 서버 SSR/ISR/RSC)
```

상세는 `docs/deployment.md`. CloudFront SWR · `revalidateTag` · Fargate HPA 등 정리되어 있다.

---

## 앞으로

미정 / 다음 단계

- `/magazine/[slug]`, `/runtrip/[slug]`, `/comp/[id]` 상세 페이지 (콘텐츠 확정 후)
- 회사 표준 정렬 시 Styled Components로 점진 마이그레이션 (경로는 `docs/styling.md`)
- 실제 외부 메트릭 백엔드 연결 (`/api/vitals` 포워딩)
- `/api/health` 헬스체크 (Fargate ALB)
- Leaflet 마커 클러스터링(한 좌표에 다수일 때)

---

🛠️ 본 저장소는 Claude Code(`CLAUDE.md`)와 함께 작업하기 좋도록 하네스가 구성되어 있다. 새 슬라이스를 시작할 때 `docs/architecture.md`와 `docs/rendering.md`를 먼저 읽기.
