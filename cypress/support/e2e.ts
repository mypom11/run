// Cypress 글로벌 훅 / 커스텀 명령 등록 위치.
// 외부 API 호출 실패가 테스트를 깨뜨리지 않게 기본 stub.
beforeEach(() => {
  cy.intercept("GET", "/api/races*", { fixture: "races.json" }).as("races");
  cy.intercept("GET", "/api/posts*", { fixture: "posts.json" }).as("posts");
  cy.intercept("GET", "/api/categories*", { fixture: "categories.json" }).as(
    "categories",
  );
});

export {};
