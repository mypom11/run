// 외부 API 호출 실패가 테스트를 깨뜨리지 않게 기본 stub.
beforeEach(() => {
  cy.intercept("GET", "/api/races*", { fixture: "races.json" }).as("races");
});

export {};
