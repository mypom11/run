# 스타일링 — Tailwind v4 vs Styled Components

회사 표준은 **Styled Components**다. 본 프로젝트는 디자인 토큰 일관성과 글래스모피즘 구현 속도를 위해 **Tailwind v4 + CSS 변수** 토큰을 채택했다. 두 방식 모두 컴포넌트 단위 캡슐화·디자인 토큰 사용이라는 목표는 같으며, 마이그레이션 경로를 아래에 정리한다.

## 현재 채택 사유
- `globals.css`의 CSS 변수가 단일 진실(Single Source of Truth). 라이트/다크/글래스 토큰을 한 곳에서 관리.
- Tailwind v4 + `@theme inline`이 그 변수를 그대로 유틸로 노출 → 마크업이 디자인 토큰 자체.
- glassmorphism(`.glass`, `.glass-strong`)이 단순 클래스 합성으로 끝남.

## Styled Components와의 매핑

| Tailwind 토큰 | SC 사용 시 |
|---|---|
| `text-[var(--fg)]` | `color: ${({theme})=>theme.fg};` |
| `bg-[var(--accent)]` | `background: ${({theme})=>theme.accent};` |
| `rounded-[var(--radius-pill)]` | `border-radius: ${({theme})=>theme.radius.pill};` |
| `.glass` 클래스 | `mixin(glass)` 또는 SC `css` 헬퍼 |

토큰은 어차피 CSS 변수라 SC `ThemeProvider`로 노출해도 동일하다 (`getComputedStyle` 또는 빌드 타임 합성).

## 마이그레이션 경로
1. `src/shared/lib/theme.ts`에 토큰을 객체로 export.
2. `<ThemeProvider theme={tokens}>`로 app 감싸기.
3. 컴포넌트별로 `styled.button`으로 점진 교체. 한 PR에 1슬라이스씩.
4. Tailwind 클래스는 두 방식이 공존하는 동안에도 동작 — 강제로 한꺼번에 제거하지 않는다.
5. SSR 시 SC 스타일은 `babel-plugin-styled-components` + Next App Router용 `StyledComponentsRegistry` 클라이언트 컴포넌트 필요.

## 결정 보류 (PR 합의 필요)
- 신규 컴포넌트는 어느 쪽으로? — **잠정: Tailwind 유지** (일관성). SC 도입 결정 시 신규부터 SC.
- 글래스 효과를 SC로 옮길 때는 `mixin`으로 추출해 중복 없이.

## 안티패턴
- Tailwind 클래스 안에 SC className을 끼워넣는 하이브리드는 가독성 망친다. 컴포넌트 단위로 한쪽만 쓴다.
- 인라인 `style={{}}`은 동적 값(viewport-aware 크기 등)에만. 디자인 토큰은 절대 인라인 금지.
