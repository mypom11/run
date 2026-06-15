# 성능 — 고트래픽 가드레일

이 페이지는 **체크리스트**다. 모든 PR은 해당 항목을 위반하지 않는지 확인한다.

## 렌더링/캐싱
- [ ] 가능한 모든 페이지는 정적 또는 ISR. 동적은 정당화 필요.
- [ ] 데이터 함수는 `"use cache"` + `cacheLife`로 캐시 (Next 16 Cache Components).
- [ ] 동적 섹션은 `<Suspense>`로 격리. 정적 셸은 즉시 응답.
- [ ] 변경 빈도가 낮은 데이터는 `cacheTag`로 태깅 → 변경 시 `revalidateTag`로 무효화.
- [ ] `force-dynamic`, `no-store`는 명시적 이유가 있을 때만.

## 번들 분할
- [ ] `"use client"`는 트리 말단에서. 페이지 최상위는 절대 금지.
- [ ] 무거운 클라이언트 컴포넌트(차트, 에디터, 맵)는 `next/dynamic`으로 lazy load + 필요하면 `ssr: false`.
  ```tsx
  const Chart = dynamic(() => import("@/widgets/chart"), { ssr: false });
  ```
- [ ] 큰 의존성(date-fns 전체, lodash 전체)은 개별 함수만 import. `lodash-es` 권장.
- [ ] 서버 전용 패키지를 Client 컴포넌트에서 import 금지 (번들 누수).
- [ ] `@next/bundle-analyzer`로 주기적으로 번들 분석.

## 호출 중복 제거
- [ ] 같은 fetch URL은 한 렌더 동안 자동 dedup (Next). 같은 데이터는 같은 함수로 호출.
- [ ] React Query `staleTime`을 페이지 단위가 아니라 데이터 단위로 설정. 1초 이상은 기본.
- [ ] Server에서 prefetch + Hydration → 클라이언트 재요청 없음.
- [ ] 동일 데이터 함수를 서로 다른 컴포넌트에서 호출해도 캐시되도록 `"use cache"` 적용.
- [ ] `useEffect`로 데이터 가져오는 패턴 금지 (서버 컴포넌트로 옮기거나 React Query 사용).

## 이미지 / 폰트
- [ ] `<img>` 금지, `next/image` 사용. `priority`는 LCP 이미지에만.
- [ ] 정적 이미지는 `width`/`height` 명시 또는 import. 외부 도메인은 `images.remotePatterns`에 등록.
- [ ] 폰트는 `next/font/local` 또는 `next/font/google` (CLS 0, 자동 preload).
- [ ] SVG 아이콘은 컴포넌트(import)로. `<img src=".svg">` 금지.

## 네트워크
- [ ] 외부 API 호출은 서버에서 (Route Handler 또는 Server Component). 클라이언트 직접 호출은 정당화 필요.
- [ ] `fetch` 응답은 `Cache-Control` 헤더 확인.
- [ ] Preconnect/Preload는 LCP 자원에만.
- [ ] CDN/엣지 캐시 헤더는 `Cache-Control` + `s-maxage` + `stale-while-revalidate`.

## React
- [ ] `useMemo`/`useCallback`은 측정 후에만. 기본은 사용하지 않는다.
- [ ] 큰 리스트는 가상화(`@tanstack/react-virtual`).
- [ ] 클라이언트 상태가 깊은 트리를 리렌더링하면 zustand selector(`(s) => s.x`)로 구독 범위 축소.
- [ ] `key`는 안정적 id 사용. 인덱스 key는 정적 리스트에만.

## 빌드/배포
- [ ] `next build` 후 `next start`로 프로덕션 모드 검증.
- [ ] 라우트 매니페스트(빌드 출력)에서 모든 페이지의 정적/동적 표시 확인.
- [ ] 헤비 라우트는 `loading.tsx`로 즉시 스켈레톤 표시.
- [ ] `error.tsx`로 라우트 격리 — 한 섹션 실패가 전체를 무너뜨리지 않게.

## 모니터링
- [ ] Web Vitals 수집 (`@vercel/analytics` 또는 자체).
- [ ] LCP, INP, CLS는 PR 단위로 비교.
- [ ] 캐시 적중률 (배포 플랫폼 메트릭) 주기 점검.

## 결정 시 던지는 질문
1. 이 데이터, 사용자마다 다른가? 아니면 정적으로 만들 수 있나?
2. 이 컴포넌트, 정말 클라이언트여야 하나?
3. 이 import, 클라이언트에 가야 하나?
4. 이 라우트, 매 요청마다 SSR이 필요한가, 캐시할 수 있나?
5. 이 호출, 어디서 dedup 되는가?
