# 프로젝트 문서

특정 홈페이지를 리뉴얼하는 Next.js 16 프로젝트의 규칙과 가이드.
대규모 트래픽을 가정하고, 정적/스트리밍/캐시 컴포넌트를 적극 사용한다.

## 무엇을 만드는가
- Next.js 16 App Router + React 19 기반 웹 클라이언트
- 외부 API는 없고, 데이터 페칭은 Next 서버 컴포넌트와 React Query로 처리
- FSD(Feature-Sliced Design) 아키텍처
- shadcn/ui 패턴의 컴포넌트 시스템
- Zustand (클라이언트 UI 상태), TanStack Query (서버 상태)

## 문서 인덱스
- [architecture.md](./architecture.md) — FSD 레이어 구조와 Next.js 통합
- [conventions.md](./conventions.md) — 네이밍, 임포트, 코드 스타일
- [rendering.md](./rendering.md) — SSG / ISR / SSR / CSR 선택 기준 (Cache Components 포함)
- [state.md](./state.md) — React Query와 Zustand의 경계
- [components.md](./components.md) — shadcn/ui 기반 컴포넌트 규칙
- [styling.md](./styling.md) — Tailwind v4 ↔ Styled Components 마이그레이션 경로
- [performance.md](./performance.md) — 고트래픽 대응, 빌드 분할, 호출 중복 제거
- [spike-traffic.md](./spike-traffic.md) — 스파이크 트래픽(대회 접수 오픈) 대응
- [testing.md](./testing.md) — Cypress E2E 운영 방침
- [deployment.md](./deployment.md) — AWS Fargate + CloudFront + S3 배포 토폴로지

## 핵심 원칙 (다른 모든 문서가 이를 보조한다)
1. **정적 우선.** 가능한 모든 페이지는 정적 또는 ISR. 동적은 명시적 결정이 필요하다.
2. **컴포넌트 단위 캐싱.** Next 16의 `use cache` 디렉티브로 함수/컴포넌트 단위 캐싱.
3. **Server Components가 기본.** `"use client"`는 필요할 때만, 가능한 한 트리의 말단에서.
4. **호출 중복 제거.** 동일 fetch는 자동 dedup, 클라이언트는 React Query가 dedup.
5. **레이어 의존성은 단방향.** shared ← entities ← features ← widgets ← views ← app.
6. **shadcn/ui 패턴.** 라이브러리 의존 대신 컴포넌트를 프로젝트로 복사해 소유한다.
