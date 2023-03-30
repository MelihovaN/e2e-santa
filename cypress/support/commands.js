// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const loginPage = require("../fixtures/pages/loginPage.json");
const generalElements = require("../fixtures/pages/general.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const settingsPage = require("../fixtures/pages/settingsPage.json");

Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click({ force: true });
});

Cypress.Commands.add("enterText", (selector, text) => {
  cy.get(selector).type(text);
});

Cypress.Commands.add("pressClick", (selector) => {
  cy.get(selector).click();
});

Cypress.Commands.add("creatBox", () => {
  cy.get(boxPage.arrowRight).click();
  cy.get(boxPage.sixthIcon).click();
  cy.get(boxPage.arrowRight).click({ force: true });
  cy.contains("Стоимость подарков").should("exist");
  cy.get(boxPage.arrowRight).click();
  cy.contains("Дополнительные настройки").should("exist");
  cy.get(boxPage.arrowRight).click();
});

Cypress.Commands.add("createCard", (userWish) => {
  cy.get(generalElements.submitButton).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(inviteeBoxPage.wishesInput).type(userWish);
  cy.get(generalElements.arrowRight).click();
});

Cypress.Commands.add("deleteBox", (boxName) => {
  cy.get(generalElements.boxesButton).click();
  cy.contains(boxName).click();
  cy.get(settingsPage.settings).click();
  cy.get(settingsPage.deleteSettings).click();
  cy.get(settingsPage.deleteField).type("Удалить коробку");
  cy.get(settingsPage.deleteConfirm).click();
});
