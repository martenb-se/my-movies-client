describe("Home View Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("when a general selection of movies are added", () => {
    beforeEach(() => {
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .should("have.length", 0);
      cy.fixture("mymovies/general_selection").then((movies) => {
        cy.request("POST", "http://localhost:8080/api/movies", movies[0]);
        cy.request("POST", "http://localhost:8080/api/movies", movies[1]);
        cy.request("POST", "http://localhost:8080/api/movies", movies[2]);
        cy.request("POST", "http://localhost:8080/api/movies", movies[3]);
      });
      cy.visit("/");
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .should("have.length", 4);
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .should("contain.text", "tt2015381")
        .next()
        .should("contain.text", "tt4154796")
        .next()
        .should("contain.text", "tt10872600")
        .next()
        .should("contain.text", "tt1156398");
    });

    afterEach(() => {
      cy.get("[data-cy=table-row-movie-tt2015381-button-delete]").click();
      cy.get("[data-cy=table-row-movie-tt4154796-button-delete]").click();
      cy.get("[data-cy=table-row-movie-tt10872600-button-delete]").click();
      cy.get("[data-cy=table-row-movie-tt1156398-button-delete]").click();
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .should("have.length", 0);
    });

    it("can rate movie", function () {
      cy.get("[data-cy=table-row-movie-tt10872600-button-rate-5]").click();
      cy.get("[data-cy=table-row-movie-tt10872600]")
        .find(".btn-rating-set")
        .should("have.length", 5);
    });

    it("can rate movie twice", function () {
      cy.get("[data-cy=table-row-movie-tt10872600-button-rate-10]").click();
      cy.get("[data-cy=table-row-movie-tt10872600]")
        .find(".btn-rating-set")
        .should("have.length", 10);
      cy.get("[data-cy=table-row-movie-tt10872600-button-rate-2]").click();
      cy.get("[data-cy=table-row-movie-tt10872600]")
        .find(".btn-rating-set")
        .should("have.length", 2);
    });

    it("can rate movie and set as unseen", function () {
      cy.get("[data-cy=table-row-movie-tt10872600-button-rate-10]").click();
      cy.get("[data-cy=table-row-movie-tt10872600]")
        .find(".btn-rating-set")
        .should("have.length", 10);
      cy.get("[data-cy=table-row-movie-tt10872600-checkbox-seen]").click();
      cy.get("[data-cy=table-row-movie-tt10872600]")
        .find(".btn-rating-set")
        .should("have.length", 0);
    });

    it("should show all movies sorted by ID in ascending order by default", function () {
      const expectedOrder = ["1", "2", "3", "4"];
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .children("[data-cy=col-id]")
        .should("contain.text", expectedOrder[0])
        .parent()
        .next()
        .children("[data-cy=col-id]")
        .should("contain.text", expectedOrder[1])
        .parent()
        .next()
        .children("[data-cy=col-id]")
        .should("contain.text", expectedOrder[2])
        .parent()
        .next()
        .children("[data-cy=col-id]")
        .should("contain.text", expectedOrder[3]);
    });

    it("can sort movies by ID in descending order", function () {
      const expectedOrder = ["4", "3", "2", "1"];
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-id] .sorting-icon"
      ).click();
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .children("[data-cy=col-id]")
        .should("contain.text", expectedOrder[0])
        .parent()
        .next()
        .children("[data-cy=col-id]")
        .should("contain.text", expectedOrder[1])
        .parent()
        .next()
        .children("[data-cy=col-id]")
        .should("contain.text", expectedOrder[2])
        .parent()
        .next()
        .children("[data-cy=col-id]")
        .should("contain.text", expectedOrder[3]);
    });

    it("can sort movies by name in descending order", function () {
      const expectedOrder = [
        "Zombieland",
        "Spider-Man: No Way Home",
        "Guardians of the Galaxy",
        "Avengers: Endgame",
      ];
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-name] .sorting-icon"
      ).click();
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .children("[data-cy=col-name]")
        .should("contain.text", expectedOrder[0])
        .parent()
        .next()
        .children("[data-cy=col-name]")
        .should("contain.text", expectedOrder[1])
        .parent()
        .next()
        .children("[data-cy=col-name]")
        .should("contain.text", expectedOrder[2])
        .parent()
        .next()
        .children("[data-cy=col-name]")
        .should("contain.text", expectedOrder[3]);
    });

    it("can sort movies by name in ascending order", function () {
      const expectedOrder = [
        "Avengers: Endgame",
        "Guardians of the Galaxy",
        "Spider-Man: No Way Home",
        "Zombieland",
      ];
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-name] .sorting-icon"
      )
        .click()
        .children("svg")
        .should("have.class", "bi-sort-alpha-down");
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-name] .sorting-icon"
      )
        .click()
        .children("svg")
        .should("have.class", "bi-sort-alpha-up");
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .children("[data-cy=col-name]")
        .should("contain.text", expectedOrder[0])
        .parent()
        .next()
        .children("[data-cy=col-name]")
        .should("contain.text", expectedOrder[1])
        .parent()
        .next()
        .children("[data-cy=col-name]")
        .should("contain.text", expectedOrder[2])
        .parent()
        .next()
        .children("[data-cy=col-name]")
        .should("contain.text", expectedOrder[3]);
    });

    it("can sort movies by IMDB id in descending order", function () {
      const expectedOrder = [
        "tt4154796",
        "tt2015381",
        "tt1156398",
        "tt10872600",
      ];
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-imdbId] .sorting-icon"
      ).click();
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .children("[data-cy=col-imdbId]")
        .should("contain.text", expectedOrder[0])
        .parent()
        .next()
        .children("[data-cy=col-imdbId]")
        .should("contain.text", expectedOrder[1])
        .parent()
        .next()
        .children("[data-cy=col-imdbId]")
        .should("contain.text", expectedOrder[2])
        .parent()
        .next()
        .children("[data-cy=col-imdbId]")
        .should("contain.text", expectedOrder[3]);
    });

    it("can sort movies by IMDB id in ascending order", function () {
      const expectedOrder = [
        "tt10872600",
        "tt1156398",
        "tt2015381",
        "tt4154796",
      ];
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-imdbId] .sorting-icon"
      )
        .click()
        .children("svg")
        .should("have.class", "bi-sort-alpha-down");
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-imdbId] .sorting-icon"
      )
        .click()
        .children("svg")
        .should("have.class", "bi-sort-alpha-up");
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .children("[data-cy=col-imdbId]")
        .should("contain.text", expectedOrder[0])
        .parent()
        .next()
        .children("[data-cy=col-imdbId]")
        .should("contain.text", expectedOrder[1])
        .parent()
        .next()
        .children("[data-cy=col-imdbId]")
        .should("contain.text", expectedOrder[2])
        .parent()
        .next()
        .children("[data-cy=col-imdbId]")
        .should("contain.text", expectedOrder[3]);
    });

    it("can sort movies by seen status in descending order", function () {
      const expectedOrder = [
        "be.checked",
        "be.checked",
        "not.be.checked",
        "not.be.checked",
      ];
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-seen] .sorting-icon"
      ).click();
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .find("[data-cy=col-seen] input")
        .should(expectedOrder[0])
        .parent()
        .parent()
        .parent()
        .next()
        .find("[data-cy=col-seen] input")
        .should(expectedOrder[1])
        .parent()
        .parent()
        .parent()
        .next()
        .find("[data-cy=col-seen] input")
        .should(expectedOrder[2])
        .parent()
        .parent()
        .parent()
        .next()
        .find("[data-cy=col-seen] input")
        .should(expectedOrder[3]);
    });

    it("can sort movies by seen status in ascending order", function () {
      const expectedOrder = [
        "not.be.checked",
        "not.be.checked",
        "be.checked",
        "be.checked",
      ];
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-seen] .sorting-icon"
      )
        .click()
        .children("svg")
        .should("have.class", "bi-sort-down");
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-seen] .sorting-icon"
      )
        .click()
        .children("svg")
        .should("have.class", "bi-sort-up");
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .find("[data-cy=col-seen] input")
        .should(expectedOrder[0])
        .parent()
        .parent()
        .parent()
        .next()
        .find("[data-cy=col-seen] input")
        .should(expectedOrder[1])
        .parent()
        .parent()
        .parent()
        .next()
        .find("[data-cy=col-seen] input")
        .should(expectedOrder[2])
        .parent()
        .parent()
        .parent()
        .next()
        .find("[data-cy=col-seen] input")
        .should(expectedOrder[3]);
    });

    it("can sort movies by rating in descending order", function () {
      const expectedOrder = [
        ["have.length", 10],
        ["have.length", 8],
        ["have.length", 0],
        ["have.length", 0],
      ];
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-rating] .sorting-icon"
      ).click();

      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .then((entryOne) => {
          cy.get(entryOne)
            .find("[data-cy=col-rating] .btn-rating-set")
            .should(...expectedOrder[0]);
          cy.get(entryOne)
            .next()
            .then((entryTwo) => {
              cy.get(entryTwo)
                .find("[data-cy=col-rating] .btn-rating-set")
                .should(...expectedOrder[1]);
              cy.get(entryTwo)
                .next()
                .then((entryThree) => {
                  cy.get(entryThree)
                    .find("[data-cy=col-rating] .btn-rating-set")
                    .should(...expectedOrder[2]);
                  cy.get(entryThree)
                    .next()
                    .then((entryFour) => {
                      cy.get(entryFour)
                        .find("[data-cy=col-rating] .btn-rating-set")
                        .should(...expectedOrder[3]);
                    });
                });
            });
        });
    });

    it("can sort movies by rating in ascending order", function () {
      const expectedOrder = [
        ["have.length", 0],
        ["have.length", 0],
        ["have.length", 8],
        ["have.length", 10],
      ];
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-rating] .sorting-icon"
      )
        .click()
        .children("svg")
        .should("have.class", "bi-sort-numeric-down");
      cy.get(
        "[data-cy=table-thead-movies] [data-vitest=col-rating] .sorting-icon"
      )
        .click()
        .children("svg")
        .should("have.class", "bi-sort-numeric-up");
      cy.get("[data-cy=table-tbody-movies]")
        .children()
        .first()
        .then((entryOne) => {
          cy.get(entryOne)
            .find("[data-cy=col-rating] .btn-rating-set")
            .should(...expectedOrder[0]);
          cy.get(entryOne)
            .next()
            .then((entryTwo) => {
              cy.get(entryTwo)
                .find("[data-cy=col-rating] .btn-rating-set")
                .should(...expectedOrder[1]);
              cy.get(entryTwo)
                .next()
                .then((entryThree) => {
                  cy.get(entryThree)
                    .find("[data-cy=col-rating] .btn-rating-set")
                    .should(...expectedOrder[2]);
                  cy.get(entryThree)
                    .next()
                    .then((entryFour) => {
                      cy.get(entryFour)
                        .find("[data-cy=col-rating] .btn-rating-set")
                        .should(...expectedOrder[3]);
                    });
                });
            });
        });
    });
  });
});
