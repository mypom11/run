# 렌더링 전략 — SSG / ISR / SSR / CSR

**전제: 이 프로젝트는 고트래픽이다. 정적이 기본이고 동적은 예외다.**

Next.js 16은 정적/동적 경계를 **컴포넌트 단위**로 가져간다 (Cache Components + Suspense streaming). 라우트 전체를 일괄로 정하지 말고 화면 안에서 캐시 경계를 그린다.

## 결정 트리

콘텐츠를 분류 → 전략 선택.

1. **빌드 시점에 완전히 결정되고 거의 안 바뀐다** → 정적 (SSG). 별도 설정 불필요.
2. **콘텐츠가 가끔 바뀐다 (시간/일 단위)** → ISR. `cacheLife('hours')` 또는 라우트 `export const revalidate = N`.
3. **콘텐츠가 자주 바뀌지만 사용자 무관** → On-demand revalidation. `revalidateTag` / `revalidatePath`.
4. **사용자/요청별로 다르다** → 동적 부분만 `<Suspense>`로 분리해서 스트리밍. 정적 셸은 유지.
5. **순수 클라이언트 상호작용 (필터, 모달, 폼)** → CSR. Server 컴포넌트 안에서 Client 컴포넌트로 감싼다.

## 패턴 — Cache Components 모델

`next.config.ts`에 `cacheComponents: true`를 켜고 다음을 사용한다.

### 1) 정적 셸 + 동적 섹션 스트리밍

```tsx
// src/app/page.tsx
import { Suspense } from "react";
import { Hero, Reviews } from "@/views/home";
import { LiveStock } from "@/widgets/live-stock";

export default function Page() {
  return (
    <>
      <Hero />           {/* 정적 */}
      <Reviews />        {/* 정적 또는 ISR */}
      <Suspense fallback={<StockSkeleton />}>
        <LiveStock />    {/* 요청 시 스트리밍 */}
      </Suspense>
    </>
  );
}
```

### 2) 데이터 함수 캐시 (use cache + cacheLife)

```ts
// src/entities/product/api/getProducts.ts
import { cacheLife, cacheTag } from "next/cache";

export async function getProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  return db.product.findMany();
}
```

- 동일 인자 호출은 자동 dedup + 캐시.
- 변경 시: `revalidateTag("products")` 한 줄로 무효화.

### 3) 라우트 ISR (기존 방식, 단순 케이스)

```ts
// src/app/blog/[slug]/page.tsx
export const revalidate = 3600;
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

`generateStaticParams`로 빌드 시점 정적 생성, 그 외 슬러그는 첫 요청에 SSR 후 캐시.

### 4) 동적 API 사용 (`cookies`, `headers`, `searchParams`)

→ 자동으로 동적. 반드시 `<Suspense>`로 감싸고, 그 외 부분은 정적으로 유지한다.

```tsx
async function UserGreeting() {
  const cookieStore = await cookies();
  return <p>{cookieStore.get("name")?.value ?? "Guest"}</p>;
}
<Suspense fallback={<GreetingSkeleton />}>
  <UserGreeting />
</Suspense>
```

### 5) CSR — Client Component

상호작용/브라우저 API만 클라이언트로. **Server 컴포넌트 안에 Client 컴포넌트를 자식으로** 넣는 패턴.

```tsx
// Server
import { Filters } from "@/features/filter/ui/Filters"; // "use client"
import { getCategories } from "@/entities/category/api";

export default async function Page() {
  const categories = await getCategories(); // server-side
  return <Filters categories={categories} />;
}
```

## 금지 패턴
- 페이지 전체를 무조건 `dynamic = "force-dynamic"`로 만들기.
- 정적으로 만들 수 있는 데이터를 클라이언트 `useEffect` + `fetch`로 가져오기.
- Server 컴포넌트에서 큰 의존성을 import해서 클라이언트 번들로 새게 만들기 (서버 전용 패키지는 클라이언트 컴포넌트에서 import 금지).
- 같은 데이터를 SSR과 CSR에서 동시에 가져오기.

## 라우트별 기본값 매트릭스

| 화면 유형 | 전략 | 비고 |
|---|---|---|
| 마케팅 홈 | SSG | hero, 섹션 모두 정적 |
| 콘텐츠 상세 (블로그, 상품) | ISR + `generateStaticParams` | 인기 항목만 빌드, 나머지는 첫 요청 시 |
| 검색 결과 | SSR with `<Suspense>` 스트리밍 | 정적 셸 + 결과 섹션 스트리밍 |
| 대시보드 / 마이페이지 | 부분 SSR | 사용자별 영역만 동적 |
| 폼/체크아웃 | Client island | 서버는 초기 데이터, 상호작용은 Client |
