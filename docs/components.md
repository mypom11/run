# 컴포넌트 — shadcn/ui 기반

## 철학
- 라이브러리 의존이 아니라 **컴포넌트를 프로젝트로 복사해 소유**한다 (shadcn/ui 방식).
- 디자인 토큰은 Tailwind v4 CSS 변수.
- 모든 UI 프리미티브는 `src/shared/ui/`에 모은다.
- 비즈니스 의존이 있는 컴포넌트는 features/widgets로.

## 디렉터리

```
src/shared/ui/
  button.tsx         shadcn 컴포넌트들 (kebab-case 파일, named export)
  input.tsx
  dialog.tsx
  icons/             lucide-react 래퍼 또는 자체 아이콘
  index.ts           public API (필요한 것만 re-export)
```

## 설치/추가
- 초기화: `pnpm dlx shadcn@latest init` 또는 `npx shadcn@latest init`. components 경로는 `src/shared/ui`, utils 경로는 `src/shared/lib/utils.ts`로 지정.
- 컴포넌트 추가: `npx shadcn@latest add button input dialog ...`
- 추가된 코드는 자유롭게 수정 가능 (그게 핵심).

## 아이콘
- `lucide-react` 사용. tree-shaking을 위해 **개별 import**:
  ```ts
  import { Search } from "lucide-react";
  ```
- 디자인 아이콘이 별도로 있으면 `src/shared/ui/icons/`에 SVG 컴포넌트로.

## 컴포넌트 분류 가이드

| 분류 | 위치 | 예시 |
|---|---|---|
| 디자인 시스템 프리미티브 | `src/shared/ui/` | Button, Input, Dialog |
| 도메인 entity 표현 | `src/entities/<name>/ui/` | `ProductCard`, `UserAvatar` |
| 사용자 행위 단위 | `src/features/<name>/ui/` | `LikeButton`, `SearchBar` |
| 큰 조합 블록 | `src/widgets/<name>/ui/` | `Header`, `ProductGrid`, `Footer` |
| 화면 전체 조립 | `src/views/<name>/ui/` | `HomeView`, `ProductDetailView` |

판단 기준: "이 컴포넌트가 도메인 단어를 안다?"
- 모른다 → shared
- 단일 도메인 명사 → entity
- 행위 동사 → feature
- 다수 entity/feature 조합 → widget

## 패턴
- **Server-first**: 컴포넌트는 기본 Server. 상호작용/브라우저 API가 필요할 때만 `"use client"`.
- **className 받기**: 모든 UI 컴포넌트는 `className?: string`을 받고 내부에서 `cn()`으로 머지.
  ```tsx
  import { cn } from "@/shared/lib/utils";
  export function Card({ className, ...props }: Props) {
    return <div className={cn("rounded-lg border", className)} {...props} />;
  }
  ```
- **asChild 패턴**: 합성이 필요한 트리거는 Radix `Slot` (shadcn 기본 패턴).
- **Variant**: `class-variance-authority`로 스타일 변형 관리 (shadcn 기본).
- **Form**: `react-hook-form` + `zod` + shadcn `Form` 컴포넌트. 컨트롤 컴포넌트 직접 작성 금지.

## 반복 제거
- 같은 마크업이 3번 이상 나타나면 컴포넌트로.
- 같은 prop 패턴이 반복되면 variant로.
- 도메인이 끼면 entity/feature/widget으로, 안 끼면 shared로.

## 접근성
- shadcn 기본이 Radix 기반이라 ARIA가 잘 설정돼 있다. **마크업을 수정하면서 ARIA 속성을 떼지 않는다.**
- 인터랙티브 요소는 키보드로 조작 가능해야 한다.
- 이미지: `next/image` + 의미 있는 `alt`. 장식이면 `alt=""`.
