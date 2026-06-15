# 아키텍처 — FSD + Next.js 16 App Router

## 레이어 (상위 → 하위)

| 레이어 | 위치 | 책임 |
|---|---|---|
| **app** (Next 라우팅) | `src/app/` | Next.js App Router 파일(`page.tsx`, `layout.tsx`, `route.ts`). 라우트 어셈블리만, 비즈니스 로직 금지. |
| **views** | `src/views/` | FSD "pages" 레이어. 라우트 화면의 콘텐츠 조립. Next의 `app/`과 이름 충돌을 피하려 `views`로 명명. |
| **widgets** | `src/widgets/` | 여러 features/entities를 조합한 큰 블록 (헤더, 푸터, 섹션 등). |
| **features** | `src/features/` | 사용자 행위 단위 (검색, 좋아요, 폼 제출 등). |
| **entities** | `src/entities/` | 도메인 모델 (User, Product, Article...). |
| **shared** | `src/shared/` | 도메인 무관 재사용 코드. |

## 의존성 규칙 (단방향)

```
shared ← entities ← features ← widgets ← views ← app
```

- 같은 레이어 내 슬라이스는 서로 임포트하지 않는다 (`features/cart` 가 `features/auth`를 모른다).
- 슬라이스는 **public API**(`index.ts`)로만 노출한다. 외부에서 슬라이스 내부 파일을 직접 임포트 금지.
- 위반은 ESLint 규칙(`eslint-plugin-boundaries` 또는 수동 import 규칙)으로 차단한다.

## 슬라이스 내부 표준 구조

```
features/auth/
  ui/             컴포넌트
  model/          상태, 도메인 로직 (zustand store, hooks)
  api/            서버 호출 (fetch, react-query 키/훅)
  lib/            슬라이스 전용 헬퍼
  config/         상수
  index.ts        public API — 외부 노출만 export
```

규모가 작은 슬라이스는 `ui/`만 있어도 된다. 필요할 때 segment를 추가한다.

## shared 레이어 구조

```
src/shared/
  ui/         shadcn/ui 컴포넌트 + 자체 UI 프리미티브
  api/        http 클라이언트, react-query QueryClient, 공통 fetcher
  config/     env, 라우트 상수, 기능 플래그
  lib/        포맷터, 검증, 일반 유틸
  hooks/      도메인 무관 훅 (useMediaQuery 등)
  types/      전역 타입
```

## Next App Router와의 매핑

Next의 `src/app/` 디렉터리는 **라우팅 정의만** 담는다. 라우트 컴포넌트는 `views`의 화면 컴포넌트를 호출하는 얇은 래퍼.

```tsx
// src/app/(marketing)/page.tsx
import { HomeView } from "@/views/home";

export const revalidate = 3600; // 또는 use cache + cacheLife
export default function Page() {
  return <HomeView />;
}
```

```tsx
// src/views/home/ui/HomeView.tsx
"use client"; // 필요할 때만
export function HomeView() { ... }
```

`app/`에서 허용되는 것: 라우트 메타데이터, `generateStaticParams`, `revalidate`/`dynamic` 설정, View 호출, 레이아웃 조립, route handler.
`app/`에서 금지: 도메인 로직, 큰 JSX 트리, 직접 상태 정의.

## 임포트 별칭

`tsconfig.json`의 `"@/*"`는 그대로 둔다. 레이어별 별칭은 만들지 않는다 — 경로가 곧 레이어를 알려준다.

```ts
import { Button } from "@/shared/ui/button";          // OK
import { useAuth } from "@/features/auth";            // OK (public API)
import { useAuthStore } from "@/features/auth/model"; // 금지 (내부 직접 임포트)
```

## Route Group 활용

`src/app/(marketing)/`, `src/app/(account)/` 처럼 라우트 그룹으로 레이아웃과 렌더링 전략을 분리한다.
정적 그룹과 동적 그룹의 layout을 분리해 캐시 경계를 명확히 한다.
