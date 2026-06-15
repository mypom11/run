# 코드 컨벤션

## 파일/폴더 네이밍
- 컴포넌트 파일: `PascalCase.tsx` (`HomeView.tsx`, `ProductCard.tsx`)
- 훅: `useCamelCase.ts` (`useProduct.ts`)
- 유틸/상수/스토어: `camelCase.ts` (`formatPrice.ts`, `cartStore.ts`)
- 폴더: `kebab-case` (`product-card/`, `auth/`)
- 슬라이스 이름은 도메인 명사 또는 행위 명사 (`auth`, `cart`, `search`)

## 임포트
- 항상 `@/` 별칭 사용. 상대 경로는 같은 슬라이스 내부에서만.
- 외부 슬라이스는 **public API**(`index.ts`)로만 진입.
- 순서: ① 외부 패키지 → ② `@/shared` → ③ 상위 레이어 → ④ 같은 슬라이스 → ⑤ 타입.

## 컴포넌트 작성
- 기본은 Server Component. `"use client"`는 다음 중 하나가 필요할 때만 추가:
  - 이벤트 핸들러, `useState`/`useEffect`, 브라우저 API, 클라이언트 전용 라이브러리.
- Client Component는 트리의 **말단**에 둔다. Server 컴포넌트가 Client를 자식으로 받는 패턴 선호.
- props는 명시적 인터페이스. `React.FC` 사용 금지.
- 기본값은 디스트럭처링으로: `function Btn({ size = "md" }: Props)`.

## TypeScript
- `any` 금지. 모르면 `unknown` + 좁히기.
- 외부 응답은 입력 경계에서만 검증 (현재 BFF에서 정규화 후 사용). 폼 검증은 Yup (회사 표준).
- 타입/인터페이스는 컴포넌트 파일 상단 또는 같은 슬라이스의 `types.ts`.

## 코멘트
- 기본은 코멘트 없음. 식별자 이름이 설명한다.
- 다음일 때만 한 줄 코멘트: 숨은 제약, 미묘한 불변식, 특정 버그 우회.
- "왜"만 쓴다. "무엇"은 코드가 말한다.

## ESLint / Prettier
- `eslint-config-next`가 기본. 추가 규칙은 PR로 합의 후 도입.
- 저장 시 포맷팅. CI에서 `next lint --max-warnings 0`.

## 환경 변수
- `process.env.NEXT_PUBLIC_*` 만 클라이언트에 노출.
- 서버 전용 env는 `src/shared/config/env.server.ts`에서 zod 스키마로 검증.
- 클라이언트 env는 `src/shared/config/env.client.ts`로 분리.

## 커밋
- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `perf:`, `test:`.
- 본문은 "왜"를 적는다. "무엇"은 diff가 말한다.
- 자동 생성된 파일/대규모 의존성 변경은 별도 커밋.
