import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { After } from "@badeball/cypress-cucumber-preprocessor";
import { faker } from "@faker-js/faker";
const users = require("../../fixtures/users.json");
const boxPage = require("../../fixtures/pages/boxPage.json");
const generalElements = require("../../fixtures/pages/general.json");
const dashboardPage = require("../../fixtures/pages/dashboardPage.json");
const invitePage = require("../../fixtures/pages/invitePage.json");
const boxSettings = require("../../fixtures/pages/settingsPage.json");

let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
let key;

//@login
Given("user-author is on secret santa login page", function () {
  cy.visit("/login");
});
When(
  "user-author logs in as {string} and {string}",
  function (email, password) {
    cy.login(email, password);
  }
);
Then("user-author is on dashboard page and see 'creat a box'", function () {
  cy.contains("Создать коробку").should("exist");
});

//@creatBox
When("user-author clicks on 'Creat box' button", function () {
  cy.contains("Создать коробку").click();
});
When("user-author completes the steps of box creating", function () {
  cy.get(boxPage.boxNameField).type(newBoxName);
  cy.get(boxPage.keyNameField)
    .invoke("val")
    .then((text) => {
      key = text;
    });
  cy.pressClick(boxPage.arrowRight);
  cy.creatBox();
});
Then("user-author successfully created the box", function () {
  cy.contains(newBoxName).should("exist");
  cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
    .invoke("text")
    .then((text) => {
      expect(text).to.include("Участники");
      expect(text).to.include("Моя карточка");
      expect(text).to.include("Подопечный");
    });
});

//@cards
When("user-author clicks on 'add participants' button", function () {
  cy.pressClick(generalElements.submitButton);
});
When("user-author fills the filds in", function (dataTable) {
  cy.enterText(invitePage.nameField1, dataTable.hashes()[0].name);
  cy.enterText(invitePage.emailField1, dataTable.hashes()[0].email);
  cy.enterText(invitePage.nameField2, dataTable.hashes()[1].name);
  cy.enterText(invitePage.emailField2, dataTable.hashes()[1].email);
  cy.enterText(invitePage.nameField3, dataTable.hashes()[2].name);
  cy.enterText(invitePage.emailField3, dataTable.hashes()[2].email);
  cy.get(invitePage.submitParticipants).click({ force: true });
});
Then("box contains 3 cards", function () {
  cy.get(":nth-child(3) > .form-page-group__main > .tip")
    .should("exist")
    .and(
      "contain.text",
      "Карточки участников успешно созданы и приглашения уже отправляются."
    );
});

//@draw
When("user-author clicks on 'back to the box' button", function () {
  cy.get(invitePage.backToBox).click({ force: true });
});
When("user-author clicks link 'go to the draw'", function () {
  cy.contains("Перейти к жеребьевке").click({ force: true });
});
When("user-author clicks on 'start a draw' button", function () {
  cy.get(generalElements.startDraw).click({ force: true });
  cy.contains("Проведение жеребьевки").should("exist");
});

When("user-author clicks on confirmation button", function () {
  cy.get(generalElements.confirmDraw).click({ force: true });
  cy.get(generalElements.confirmDraw).click({ force: true });
  cy.get(generalElements.confirmDraw).click({ force: true });
});
Then("user-author has successfully made a draw", function () {
  cy.wait(1000);
  cy.contains("Жеребьевка проведена").should("exist");
});

//@authorNotification
Given("user-author clicks notifications buuton", function () {
  cy.pressClick(generalElements.notificationButton);
});
Then("user-author can see a notification", function () {
  cy.get(".notifications-item__message").contains(newBoxName);
  cy.contains(
    `У тебя появился подопечный в коробке "${newBoxName}". Скорее переходи по кнопке, чтобы узнать кто это!`
  ).should("exist");
});

//@userNotification
Given(
  "user login as {string} and {string} in to the account",
  function (email, password) {
    cy.clearCookies();
    cy.visit("/login");
    cy.login(email, password);
  }
);
When("user clicks notifications button", function () {
  cy.pressClick(generalElements.notificationButton);
});
Then("user can see notification", function () {
  cy.get(".notifications-item__message").contains(newBoxName);
});

//delete the box
After({ tags: "@draw" }, function () {
  cy.deleteBox(newBoxName);
});
