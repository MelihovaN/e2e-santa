const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  //пользователь 1 логинится
  //пользователь 1 создает коробку
  //пользователь 1 получает приглашение
  //пользователь 2 переходит по приглашению
  //пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let wish1 = faker.word.adjective() + faker.word.noun();
  let maxAmount = 50;
  let currency = "Евро";
  let key;

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(":nth-child(3) > .frm")
      .invoke("val")
      .then((text) => {
        key = text;
        cy.log(key);
      });

    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(boxPage.giftPriceToggle).check({ force: true });
    cy.get(boxPage.maxAnount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();

    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("Author can create a card", () => {
    cy.contains("Добавить участников").click({ force: true });
    cy.get(".layout-row-center > .btn-main").click();
    cy.get(generalElements.arrowRight).click();
    cy.get(generalElements.arrowRight).click();
    cy.get(inviteeBoxPage.wishesInput).type(wish1);
    cy.get(generalElements.arrowRight).click();
  });

  it("User2 and user3 can creat a cards", () => {
    cy.get(generalElements.boxButton).click();
    cy.contains(newBoxName).click();
    cy.get(generalElements.submitButton).click();
    cy.get(":nth-child(1) > .frm-wrapper > #input-table-0").type(
      users.user2.name
    );
    cy.get(":nth-child(2) > .frm-wrapper > #input-table-0").type(
      users.user2.email
    );
    cy.get(":nth-child(3) > .frm-wrapper > #input-table-1").type(
      users.user3.name
    );
    cy.get(":nth-child(4) > .frm-wrapper > #input-table-1").type(
      users.user3.email
    );
    cy.get(generalElements.submitButton).click();
  });
  it("Make a draw", () => {
    cy.get(".form-page__buttons > .btn-secondary").click();
    cy.contains("Перейти к жеребьевке").click({ force: true });
    cy.get(generalElements.submitButton).click();
    cy.get(".santa-modal_content_buttons > .btn-main").click({ force: true });
    cy.get(".picture-notice")
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Жеребьевка проведена");
      });
  });
});
