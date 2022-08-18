describe("Search View Tests", () => {
  beforeEach(() => {
    cy.omdbIntercept();
    cy.visit("/search");
  });

  it("can not click search without entering any text", function () {
    cy.get("[data-cy=form-search]").submit();
    cy.get("[data-cy=container-notifications]").contains(
      "Movie name must be set before searching!"
    );
  });

  it("can not set type to be anything other than movie, series or episode", function () {
    cy.get("[data-cy=input-movieName]")
      .type("Bad Search")
      .should("have.value", "Bad Search");
    cy.get("[data-cy=input-movieType]")
      .children()
      .last()
      .then(($el) => {
        $el.before('<option value="Bad Option">Bad Option</option>');
      });
    cy.get("[data-cy=input-movieType]").contains("select", "Bad Option");
    cy.get("[data-cy=input-movieType]")
      .select("Bad Option")
      .should("have.value", "Bad Option");
    cy.get("[data-cy=form-search]").submit();
    cy.get("[data-cy=container-notifications]").contains(
      "Movie type is wrong!"
    );
  });

  it("can not set year to be negative", function () {
    cy.get("[data-cy=input-movieName]")
      .type("Bad Search")
      .should("have.value", "Bad Search");
    cy.get("[data-cy=input-movieYear]").type("-1").should("have.value", "-1");
    cy.get("[data-cy=form-search]").submit();
    cy.get("[data-cy=container-notifications]").contains(
      "Movie year must be a number between 0 and 9999!"
    );
  });

  it("can not set year to be over 9999", function () {
    cy.get("[data-cy=input-movieName]")
      .type("Bad Search")
      .should("have.value", "Bad Search");
    cy.get("[data-cy=input-movieYear]")
      .type("12897")
      .should("have.value", "12897");
    cy.get("[data-cy=form-search]").submit();
    cy.get("[data-cy=container-notifications]").contains(
      "Movie year must be a number between 0 and 9999!"
    );
  });

  it("search for 'Spider-Man'", () => {
    cy.get("[data-cy=card-search-results]")
      .get("[data-cy=card-search-results]")
      .children()
      .should("have.length", 0);
    cy.get("[data-cy=input-movieName]")
      .type("Spider-Man")
      .should("have.value", "Spider-Man");
    cy.get("[data-cy=form-search]")
      .submit()
      .get("[data-cy=card-search-results]")
      .children()
      .should("have.length.at.least", 1);
  });

  context(
    "after having searched for 'Hero', starting at page 1 and at least 2 pages exists",
    () => {
      beforeEach(() => {
        cy.get("[data-cy=input-movieName]")
          .type("Hero")
          .should("have.value", "Hero");
        cy.get("[data-cy=form-search]")
          .submit()
          .get("[data-cy=card-search-results]")
          .children()
          .should("have.length.at.least", 10);
        cy.get("[data-cy=nav-pages]").scrollIntoView().should("be.visible");
        cy.get("[data-cy=page-link-page-1]")
          .parent()
          .should("have.class", "active");
        cy.get("[data-cy=page-link-page-next]")
          .parent()
          .prev()
          .invoke("text")
          .as("totalPages");
        cy.get("@totalPages").then((totalPages) => {
          expect(parseInt(totalPages)).greaterThan(2);
        });
      });

      it("can go to a next page", function () {
        cy.get("[data-cy=page-link-page-next]")
          .click()
          .get("[data-cy=page-link-page-2]")
          .parent()
          .should("have.class", "active");
      });

      it("can go to last page", function () {
        cy.get("[data-cy=page-link-page-" + this.totalPages + "]")
          .click()
          .get("[data-cy=page-link-page-" + this.totalPages + "]")
          .parent()
          .should("have.class", "active");
      });

      it("can go to last page and then previous page", function () {
        cy.get("[data-cy=page-link-page-" + this.totalPages + "]")
          .click()
          .get("[data-cy=page-link-page-" + this.totalPages + "]")
          .parent()
          .should("have.class", "active");
        cy.get("[data-cy=page-link-page-previous]")
          .click()
          .get(
            "[data-cy=page-link-page-" + (parseInt(this.totalPages) - 1) + "]"
          )
          .parent()
          .should("have.class", "active");
      });
    }
  );
});
