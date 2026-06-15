# 테스트 전략

## 범위
- **단위/통합**: 추후 도입 (Vitest 또는 Jest + React Testing Library).
- **E2E**: Cypress. 현재는 스모크 테스트만 운영.

## Cypress 구조
```
cypress/
  e2e/             테스트 시나리오 (*.cy.ts)
  fixtures/        BFF 응답 모킹 데이터
  support/e2e.ts   글로벌 훅 (intercept 등)
  tsconfig.json    Cypress 전용 TS 설정 (메인 분리)
cypress.config.ts  baseUrl, viewport 등
```

## 명령어
- `npm run test:e2e` — 헤드리스 실행 (CI 동일).
- `npm run test:e2e:open` — Cypress GUI.

## 기본 규칙
1. **외부 의존 차단.** `beforeEach`에서 `cy.intercept()`로 `/api/*`를 fixture 응답으로 stub. 실제 runable.me에 의존하지 않는다.
2. **시나리오 단위.** 한 `describe`는 한 화면/플로우. `it`는 사용자 가치 단위.
3. **선택자.** 가능하면 보이는 텍스트(`cy.contains`)로. `data-testid`는 의미 없는 동적 텍스트일 때만.
4. **CI 안정성.** `retries.runMode = 2`. 비결정 테스트는 차단 사유로.
5. **시각 테스트.** 별도 도구 도입 시점에 추가.

## CI
GitHub Actions의 `e2e` 잡이 다음을 수행:
- `npm ci` → `npm run build` → `npm run start` 띄우고
- `cypress-io/github-action@v6`이 Chrome으로 e2e 실행.

## 새 테스트 추가 절차
1. fixture 추가/수정 — `cypress/fixtures/*.json`.
2. `cypress/e2e/<feature>.cy.ts` 작성.
3. 로컬에서 `npm run dev`로 띄워두고 `npm run test:e2e:open`.
4. 통과 확인 후 PR.
