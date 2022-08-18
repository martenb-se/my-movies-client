describe("Full App Tests", () => {
  beforeEach(() => {
    cy.omdbIntercept();
  });

  it("search for 'guardians', add first movie, remove movie", () => {
    cy.visit("/");
    cy.get("[data-cy=table-tbody-movies]").children().should("have.length", 0);

    cy.visit("/search");
    cy.get("[data-cy=card-search-results]")
      .get("[data-cy=card-search-results]")
      .children()
      .should("have.length", 0);
    cy.get("[data-cy=input-movieName]")
      .type("guardians")
      .should("have.value", "guardians");
    cy.get("[data-cy=form-search]")
      .submit()
      .get("[data-cy=card-search-results]")
      .children()
      .should("have.length.at.least", 1);
    cy.get("[data-cy=card-search-result-1]")
      .find("a:contains(Add movie)")
      .click()
      .should("contain.text", "Already added");
    cy.get("[data-cy=card-search-result-1-imdbid").invoke("text").as("imdbId");
    cy.get("@imdbId").then((imdbId) => {
      cy.visit("/");
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .should("have.length", 1);
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .should("contain.text", imdbId);

      cy.get("[data-cy=table-row-movie-" + imdbId + "-button-delete").click();

      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .should("have.length", 0);
    });
  });

  context("after having searched for 'Hero'", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .should("have.length", 0);

      cy.visit("/search");
      cy.get("[data-cy=input-movieName]")
        .type("Hero")
        .should("have.value", "Hero");
      cy.get("[data-cy=form-search]")
        .submit()
        .get("[data-cy=card-search-results]")
        .children()
        .should("have.length.at.least", 10);
    });

    it("can add and remove 5 movies", function () {
      cy.get("[data-cy=card-search-result-1]")
        .find("a:contains(Add movie)")
        .click()
        .should("contain.text", "Already added");
      cy.get("[data-cy=card-search-result-2]")
        .find("a:contains(Add movie)")
        .click()
        .should("contain.text", "Already added");
      cy.get("[data-cy=card-search-result-3]")
        .find("a:contains(Add movie)")
        .click()
        .should("contain.text", "Already added");
      cy.get("[data-cy=card-search-result-4]")
        .find("a:contains(Add movie)")
        .click()
        .should("contain.text", "Already added");
      cy.get("[data-cy=card-search-result-5]")
        .find("a:contains(Add movie)")
        .click()
        .should("contain.text", "Already added");

      cy.visit("/");
      cy.get("[data-cy=table-tbody-movies]")
        .find(".btn-delete")
        .click({ multiple: true });
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .should("have.length", 0);
    });
  });
});
