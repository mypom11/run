# 상태 관리 — React Query + Zustand

두 도구의 경계를 분명히 한다. 섞으면 캐시가 두 군데에 생긴다.

## 역할 분담

| 도구 | 담당 | 예 |
|---|---|---|
| **TanStack Query** | 서버 상태 (네트워크/DB에서 온 데이터) | 상품 목록, 사용자 프로필, 검색 결과 |
| **Zustand** | 클라이언트 UI 상태 (브라우저에만 존재) | 모달 열림/닫힘, 다크 모드, 필터 폼 임시값, 카트 (로컬) |
| **URL (searchParams)** | 공유 가능한 상태 | 페이지, 정렬, 필터 (공유 링크가 필요한 것) |
| **React state** | 컴포넌트 로컬 | 인풋 임시값, 토글 |

**원칙**:
- 서버에서 온 데이터는 절대 zustand에 복사하지 않는다 — React Query 캐시가 단일 진실.
- "다른 화면에서 공유"가 필요할 때만 zustand로 올린다. 한 컴포넌트 안에서 끝나면 `useState`.
- 새로고침해도 URL에 남아야 하는 상태는 searchParams (Next의 `useSearchParams` / `nuqs` 등).

## React Query 설정

```ts
// src/shared/api/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,      // 1분: 같은 키 재호출 방지
        gcTime: 5 * 60 * 1000,     // 5분: 캐시 보유
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}
```

### SSR 프리페치 + Hydration

Server 컴포넌트에서 미리 가져와 클라이언트에 전달.

```tsx
// src/app/products/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/shared/api/queryClient";
import { productKeys, getProducts } from "@/entities/product";
import { ProductList } from "@/widgets/product-list";

export default async function Page() {
  const qc = makeQueryClient();
  await qc.prefetchQuery({ queryKey: productKeys.list(), queryFn: getProducts });
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <ProductList />
    </HydrationBoundary>
  );
}
```

`<Providers>`(클라이언트)에서 `QueryClientProvider`를 마운트한다. 클라이언트 인스턴스는 모듈 싱글톤 금지 — 요청별로 생성.

### 쿼리 키 규칙

엔티티 슬라이스에 키 팩토리를 둔다.

```ts
// src/entities/product/api/keys.ts
export const productKeys = {
  all: ["product"] as const,
  list: (filters?: Filters) => [...productKeys.all, "list", filters ?? {}] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};
```

## Zustand 설정

```ts
// src/features/filter/model/filterStore.ts
import { create } from "zustand";

interface FilterState {
  sort: "latest" | "popular";
  setSort: (s: FilterState["sort"]) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  sort: "latest",
  setSort: (sort) => set({ sort }),
}));
```

규칙:
- 한 store가 너무 커지면 슬라이스 단위로 분리.
- store 내부에서 fetch 호출 금지. 데이터는 React Query.
- 영속화가 필요할 때만 `persist` 미들웨어. 키 충돌 주의.
- SSR 환경에서 store 초기 상태가 서버/클라이언트 다르면 hydration 에러 → 초기값은 결정적이게.

## 안티 패턴
- `useEffect`에서 fetch 후 zustand에 저장 → React Query를 써야 한다.
- 서버 컴포넌트에서 zustand 사용 → 불가능. zustand는 client only.
- React Query 응답을 zustand에 미러링 → 동기화 버그 보장.
- 같은 데이터를 두 컴포넌트가 각자 `useQuery` 호출 → OK. dedup 된다. (오히려 prop drilling이 안 좋다)
