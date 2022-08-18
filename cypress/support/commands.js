/* global Cypress, cy */
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

Cypress.Commands.add("omdbIntercept", () => {
  cy.intercept("https://www.omdbapi.com/*", (req) => {
    if (
      Object.prototype.hasOwnProperty.call(req.query, "apikey") &&
      req.query["apikey"].length > 0 &&
      Object.prototype.hasOwnProperty.call(req.query, "s")
    ) {
      let current_page = "1";
      if (Object.prototype.hasOwnProperty.call(req.query, "page"))
        current_page = req.query["page"];

      if (req.query["s"] === "Spider-Man" && current_page === "1")
        req.reply({
          fixture: "search/Spider-Man/any_any_1",
        });
      else if (req.query["s"] === "guardians" && current_page === "1")
        req.reply({
          fixture: "search/guardians/any_any_1",
        });
      else if (req.query["s"] === "Hero" && current_page === "1")
        req.reply({
          fixture: "search/Hero/any_any_1",
        });
      else if (req.query["s"] === "Hero" && current_page === "2")
        req.reply({
          fixture: "search/Hero/any_any_2",
        });
      else if (req.query["s"] === "Hero" && current_page === "180")
        req.reply({
          fixture: "search/Hero/any_any_180",
        });
      else if (req.query["s"] === "Hero" && current_page === "181")
        req.reply({
          fixture: "search/Hero/any_any_181",
        });
      else
        req.reply({
          fixture: "search/not_yet_added",
        });
    } else {
      req.reply({
        fixture: "search/no_search",
      });
    }
  }).as("omdbInterceptor");
});
