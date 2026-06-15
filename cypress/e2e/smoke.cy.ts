describe("핵심 페이지 스모크", () => {
  it("홈 페이지가 렌더링된다", () => {
    cy.visit("/");
    cy.contains("나답게").should("be.visible");
    cy.contains("대회 찾기").should("be.visible");
  });

  it("대회 페이지의 캘린더가 렌더링된다", () => {
    cy.visit("/race");
    cy.contains("대회 일정").should("be.visible");
    cy.contains("테스트 마라톤").should("exist");
  });

  it("매거진 페이지가 렌더링된다", () => {
    cy.visit("/magazine");
    cy.contains("러너 매거진").should("be.visible");
  });

  it("런트립 페이지가 렌더링된다", () => {
    cy.visit("/runtrip");
    cy.contains("런트립").should("be.visible");
  });

  it("페이스 계산기가 동작한다", () => {
    cy.visit("/pace-calculator");
    cy.contains("페이스 계산기").should("be.visible");
  });

  it("404 페이지가 동작한다", () => {
    cy.visit("/does-not-exist", { failOnStatusCode: false });
    cy.contains("페이지를 찾을 수 없습니다").should("be.visible");
  });
});
