import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { shallowMount } from "@vue/test-utils";
import MyMovieList from "@/components/MyMovieList.vue";

import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";
import { useErrorMessageStore } from "@/stores/errorMessage";
import { useMyMoviesStore } from "@/stores/myMovies";

import myMoviesGeneralSelection from "@/__fixtures__/mymovies/generalSelection.json";
import { MovieSorting } from "@/enum/movieSortingEnum";

describe("MyMovieList.vue Test", () => {
  let pinia;

  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    setActivePinia(pinia);
  });

  describe("when mounted with a general selection of added movies", () => {
    let myMovieListWrapper;
    let myMoviesStore;
    let errorMessageStore;

    beforeEach(() => {
      myMoviesStore = useMyMoviesStore();
      errorMessageStore = useErrorMessageStore();

      myMoviesStore.movies = myMoviesGeneralSelection.reduce(
        (movieObj, curMovie) => {
          movieObj[curMovie.imdbId] = curMovie;
          return movieObj;
        },
        {}
      );

      myMovieListWrapper = shallowMount(MyMovieList, {
        global: {
          plugins: [pinia],
        },
      });
    });

    afterEach(() => {
      myMovieListWrapper.unmount();
    });

    it("should show table for movie with column for ID", () => {
      const colId = myMovieListWrapper.findAll("[data-vitest=col-id]");
      expect(colId.length).toBe(Object.keys(myMoviesStore.movies).length + 1);
    });

    it("should show table for movie with column for name", () => {
      const colId = myMovieListWrapper.findAll("[data-vitest=col-name]");
      expect(colId.length).toBe(Object.keys(myMoviesStore.movies).length + 1);
    });

    it("should show table for movie with column for IMDB id", () => {
      const colId = myMovieListWrapper.findAll("[data-vitest=col-imdbId]");
      expect(colId.length).toBe(Object.keys(myMoviesStore.movies).length + 1);
    });

    it("should show table for movie with column for seen", () => {
      const colId = myMovieListWrapper.findAll("[data-vitest=col-seen]");
      expect(colId.length).toBe(Object.keys(myMoviesStore.movies).length + 1);
    });

    it("should show table for movie with column for rating", () => {
      const colId = myMovieListWrapper.findAll("[data-vitest=col-rating]");
      expect(colId.length).toBe(Object.keys(myMoviesStore.movies).length + 1);
    });

    it("should show table for movie with column for removal", () => {
      const colId = myMovieListWrapper.findAll("[data-vitest=col-delete]");
      expect(colId.length).toBe(Object.keys(myMoviesStore.movies).length + 1);
    });

    it("should show all movies found in myMoviesStore.movies", () => {
      Object.keys(myMoviesStore.movies).forEach((imdbId) => {
        const movieRow = myMovieListWrapper.findAll(
          "[data-vitest=table-row-movie-" + imdbId + "]"
        );
        expect(movieRow.length).toBe(1);
        expect(movieRow[0].find("[data-vitest=col-imdbId]").text()).toBe(
          imdbId
        );
      });
    });

    it("should show ID for all movies", () => {
      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      allMovieRows.forEach((movieRow) => {
        expect(
          Object.keys(movieRow.find("[data-vitest=col-id]")).length
        ).toBeGreaterThan(0);
      });
    });

    it("should show name for all movies", () => {
      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      allMovieRows.forEach((movieRow) => {
        expect(
          Object.keys(movieRow.find("[data-vitest=col-name]")).length
        ).toBeGreaterThan(0);
      });
    });

    it("should show IMDB id for all movies", () => {
      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      allMovieRows.forEach((movieRow) => {
        expect(
          Object.keys(movieRow.find("[data-vitest=col-imdbId]")).length
        ).toBeGreaterThan(0);
      });
    });

    it("should show seen as checked for all seen movies", () => {
      Object.keys(myMoviesStore.movies).forEach((imdbId) => {
        if (myMoviesStore.movies[imdbId].seen) {
          const movieColSeenCheckbox = myMovieListWrapper.find(
            "[data-vitest=table-row-movie-" +
              imdbId +
              "] > [data-vitest=col-seen] input"
          );
          expect(movieColSeenCheckbox.element.checked).toBeTruthy();
        }
      });
    });

    it("should show seen as unchecked for all unseen movies", () => {
      Object.keys(myMoviesStore.movies).forEach((imdbId) => {
        if (!myMoviesStore.movies[imdbId].seen) {
          const movieColSeenCheckbox = myMovieListWrapper.find(
            "[data-vitest=table-row-movie-" +
              imdbId +
              "] > [data-vitest=col-seen] input"
          );
          expect(movieColSeenCheckbox.element.checked).toBeFalsy();
        }
      });
    });

    it("should show rating for all movies", () => {
      Object.keys(myMoviesStore.movies).forEach((imdbId) => {
        if (myMoviesStore.movies[imdbId].seen) {
          const movieColRatingAlreadySet = myMovieListWrapper.findAll(
            "[data-vitest=table-row-movie-" +
              imdbId +
              "] > [data-vitest=col-rating] .btn-rating-set"
          );
          expect(movieColRatingAlreadySet.length).toBe(
            myMoviesStore.movies[imdbId].rating
          );
        }
      });
    });

    it("should show removal for all movies", () => {
      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      allMovieRows.forEach((movieRow) => {
        expect(
          Object.keys(movieRow.find("[data-vitest=col-delete] > .btn-delete"))
            .length
        ).toBeGreaterThan(0);
      });
    });

    it("should show all movies sorted by ID in ascending order by default", () => {
      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      const expectedOrder = ["1", "2", "3", "4"];

      allMovieRows.forEach((movieRow, index) => {
        expect(movieRow.find("[data-vitest=col-id]").text()).toBe(
          expectedOrder[index]
        );
      });
    });

    it("should be able to sort movies by ID in descending order", async () => {
      const sortById = myMovieListWrapper.find(
        "[data-vitest=table-thead-movies] [data-vitest=col-id] .sorting-icon > *"
      );

      expect(sortById.element.tagName).toBe("ICON-SORT-NUMERIC-UP-STUB");

      await sortById.trigger("click");

      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      const expectedOrder = ["4", "3", "2", "1"];

      allMovieRows.forEach((movieRow, index) => {
        expect(movieRow.find("[data-vitest=col-id]").text()).toBe(
          expectedOrder[index]
        );
      });
    });

    it("should be able to sort movies by rating in descending order", async () => {
      const sortById = myMovieListWrapper.find(
        "[data-vitest=table-thead-movies] [data-vitest=col-rating] .sorting-icon > *"
      );

      expect(sortById.element.tagName).toBe("ICON-SORT-NUMERIC-UP-STUB");

      await sortById.trigger("click");

      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      const expectedOrder = [10, 8, 0, 0];

      allMovieRows.forEach((movieRow, index) => {
        expect(
          movieRow.findAll("[data-vitest=col-rating] .btn-rating-set").length
        ).toBe(expectedOrder[index]);
      });
    });

    it("should be able to sort movies by rating in ascending order", async () => {
      const sortById = myMovieListWrapper.find(
        "[data-vitest=table-thead-movies] [data-vitest=col-rating] .sorting-icon"
      );

      expect(sortById.find("*").element.tagName).toBe(
        "ICON-SORT-NUMERIC-UP-STUB"
      );
      await sortById.find("*").trigger("click");
      expect(sortById.find("*").element.tagName).toBe(
        "ICON-SORT-NUMERIC-DOWN-STUB"
      );
      await sortById.find("*").trigger("click");

      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      const expectedOrder = [0, 0, 8, 10];

      allMovieRows.forEach((movieRow, index) => {
        expect(
          movieRow.findAll("[data-vitest=col-rating] .btn-rating-set").length
        ).toBe(expectedOrder[index]);
      });
    });

    it("should be able to sort movies by name in descending order", async () => {
      const sortById = myMovieListWrapper.find(
        "[data-vitest=table-thead-movies] [data-vitest=col-name] .sorting-icon > *"
      );

      expect(sortById.element.tagName).toBe("ICON-SORT-ALPHA-UP-STUB");

      await sortById.trigger("click");

      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      const expectedOrder = [
        "Zombieland",
        "Spider-Man: No Way Home",
        "Guardians of the Galaxy",
        "Avengers: Endgame",
      ];

      allMovieRows.forEach((movieRow, index) => {
        expect(movieRow.find("[data-vitest=col-name]").text()).toBe(
          expectedOrder[index]
        );
      });
    });

    it("should be able to sort movies by name in ascending order", async () => {
      const sortById = myMovieListWrapper.find(
        "[data-vitest=table-thead-movies] [data-vitest=col-name] .sorting-icon"
      );

      expect(sortById.find("*").element.tagName).toBe(
        "ICON-SORT-ALPHA-UP-STUB"
      );
      await sortById.find("*").trigger("click");
      expect(sortById.find("*").element.tagName).toBe(
        "ICON-SORT-ALPHA-DOWN-STUB"
      );
      await sortById.find("*").trigger("click");

      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      const expectedOrder = [
        "Avengers: Endgame",
        "Guardians of the Galaxy",
        "Spider-Man: No Way Home",
        "Zombieland",
      ];

      allMovieRows.forEach((movieRow, index) => {
        expect(movieRow.find("[data-vitest=col-name]").text()).toBe(
          expectedOrder[index]
        );
      });
    });

    it("should be able to sort movies by IMDB id in descending order", async () => {
      const sortById = myMovieListWrapper.find(
        "[data-vitest=table-thead-movies] [data-vitest=col-imdbId] .sorting-icon > *"
      );

      expect(sortById.element.tagName).toBe("ICON-SORT-ALPHA-UP-STUB");

      await sortById.trigger("click");

      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      const expectedOrder = [
        "tt4154796",
        "tt2015381",
        "tt1156398",
        "tt10872600",
      ];

      allMovieRows.forEach((movieRow, index) => {
        expect(movieRow.find("[data-vitest=col-imdbId]").text()).toBe(
          expectedOrder[index]
        );
      });
    });

    it("should be able to sort movies by IMDB id in ascending order", async () => {
      const sortById = myMovieListWrapper.find(
        "[data-vitest=table-thead-movies] [data-vitest=col-imdbId] .sorting-icon"
      );

      expect(sortById.find("*").element.tagName).toBe(
        "ICON-SORT-ALPHA-UP-STUB"
      );
      await sortById.find("*").trigger("click");
      expect(sortById.find("*").element.tagName).toBe(
        "ICON-SORT-ALPHA-DOWN-STUB"
      );
      await sortById.find("*").trigger("click");

      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      const expectedOrder = [
        "tt10872600",
        "tt1156398",
        "tt2015381",
        "tt4154796",
      ];

      allMovieRows.forEach((movieRow, index) => {
        expect(movieRow.find("[data-vitest=col-imdbId]").text()).toBe(
          expectedOrder[index]
        );
      });
    });

    it("should be able to sort movies by seen in descending order", async () => {
      const sortById = myMovieListWrapper.find(
        "[data-vitest=table-thead-movies] [data-vitest=col-seen] .sorting-icon > *"
      );

      expect(sortById.element.tagName).toBe("ICON-SORT-UP-STUB");

      await sortById.trigger("click");

      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      const expectedOrder = [true, true, false, false];

      allMovieRows.forEach((movieRow, index) => {
        expect(
          movieRow.find("[data-vitest=col-seen] input").element.checked
        ).toBe(expectedOrder[index]);
      });
    });

    it("should be able to sort movies by seen in ascending order", async () => {
      const sortById = myMovieListWrapper.find(
        "[data-vitest=table-thead-movies] [data-vitest=col-seen] .sorting-icon"
      );

      expect(sortById.find("*").element.tagName).toBe("ICON-SORT-UP-STUB");
      await sortById.find("*").trigger("click");
      expect(sortById.find("*").element.tagName).toBe("ICON-SORT-DOWN-STUB");
      await sortById.find("*").trigger("click");

      const allMovieRows = myMovieListWrapper.findAll(
        "[data-vitest=table-tbody-movies] > tr"
      );

      const expectedOrder = [false, false, true, true];

      allMovieRows.forEach((movieRow, index) => {
        expect(
          movieRow.find("[data-vitest=col-seen] input").element.checked
        ).toBe(expectedOrder[index]);
      });
    });

    it("should be able to rate movie", async () => {
      const imdbId = "tt4154796";
      const rating = 5;

      const movieColRatingSet = myMovieListWrapper.find(
        "[data-vitest=table-row-movie-" +
          imdbId +
          "-button-rate-" +
          rating +
          "]"
      );

      await movieColRatingSet.trigger("click");

      expect(myMoviesStore.setMovieRating).toHaveBeenCalledTimes(1);
      expect(myMoviesStore.setMovieRating).toHaveBeenCalledWith(
        imdbId,
        rating,
        myMovieListWrapper.find(
          "[data-vitest=table-row-movie-" +
            imdbId +
            "] > [data-vitest=col-seen] input"
        ).element.checked
      );
    });

    it("should be able to set movie as unseen", async () => {
      const imdbId = "tt2015381";

      const movieColUnseenSet = myMovieListWrapper.find(
        "[data-vitest=table-row-movie-" + imdbId + "-checkbox-seen]"
      );

      await movieColUnseenSet.trigger("click");

      expect(myMoviesStore.setMovieUnseen).toHaveBeenCalledTimes(1);
      expect(myMoviesStore.setMovieUnseen).toHaveBeenCalledWith(imdbId);
    });

    it("should be able to remove movie", async () => {
      const imdbId = "tt2015381";

      const movieColUnseenSet = myMovieListWrapper.find(
        "[data-vitest=table-row-movie-" + imdbId + "-button-delete]"
      );

      await movieColUnseenSet.trigger("click");

      expect(myMoviesStore.deleteMovie).toHaveBeenCalledTimes(1);
      expect(myMoviesStore.deleteMovie).toHaveBeenCalledWith(imdbId);
    });

    it("should show error message if trying to sort a movie when given sorting is not an object", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      myMovieListWrapper.vm.sortListBy();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[MyMovies implementation error]: Cannot sort list when 'chosenSort' is not an MovieSorting enum object."
      );
      expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
      expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
        "Unable to perform sorting operation. Contact the system administrator."
      );
    });

    it("should show error message if trying to sort a movie when given sorting object does not include required data", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      myMovieListWrapper.vm.sortListBy({ stuff: false });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[MyMovies implementation error]: Cannot sort list when 'chosenSort' is not a valid MovieSorting enum " +
          "containing the 'name' property."
      );
      expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
      expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
        "Unable to perform sorting operation. Contact the system administrator."
      );
    });

    it("should show error message if trying to sort a movie when given sorting method object is not a valid MovieSorting enum object", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");
      myMovieListWrapper.vm.sortListBy({ name: "BadSort" });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[MyMovies implementation error]: Argument 'chosenSort' is not a valid MovieSorting enum, " +
          "the given object's name property is 'BadSort'! Valid name property values for a MovieSorting enum object are: " +
          Object.keys(MovieSorting)
            .reduce((res, key) => {
              return res + ", " + MovieSorting[key].name;
            }, "")
            .substring(2),
        "."
      );
      expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
      expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
        "Unable to perform sorting operation. Contact the system administrator."
      );
    });

    // TODO: <<< END
  });

  describe("when mounted with a bad movie", () => {
    let myMovieListWrapper;
    let myMoviesStore;
    let errorMessageStore;
    let consoleErrorSpy;

    beforeEach(() => {
      myMoviesStore = useMyMoviesStore();
      errorMessageStore = useErrorMessageStore();
      consoleErrorSpy = vi.spyOn(console, "error");

      myMoviesStore.movies = {
        tt2015381: {
          id: 1,
          imdbId: "tt2015381",
          name: "Guardians of the Galaxy",
          seen: true,
          rating: 10,
        },
        BadMovieNoImdbId: {
          id: 2,
          imdbId: "",
          name: "Guardians of the Galaxy",
          seen: true,
          rating: 10,
        },
      };

      myMovieListWrapper = shallowMount(MyMovieList, {
        global: {
          plugins: [pinia],
        },
      });
    });

    afterEach(() => {
      myMovieListWrapper.unmount();
    });

    it("should show error message if trying to rate a movie with no valid IMDB id", async () => {
      const movieColRatingSet = myMovieListWrapper.find(
        "[data-vitest=table-row-movie--button-rate-5]"
      );

      await movieColRatingSet.trigger("click");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[MyMovies implementation error]: Cannot set rating when 'imdbId' is not valid."
      );
      expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
      expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
        "Unable to set rating. Contact the system administrator."
      );
    });

    it("should show error message if trying to rate a movie where rating is out of range", () => {
      myMovieListWrapper.vm.setRating("tt2015381", 11);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[MyMovies implementation error]: Cannot set rating when 'rating' is not a number between 1 and 10."
      );
      expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
      expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
        "Unable to set rating. Contact the system administrator."
      );
    });

    it("should show error message if trying to rate a movie when seen is not a boolean", () => {
      myMovieListWrapper.vm.setRating("tt2015381", 5, 9);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[MyMovies implementation error]: Cannot set rating when 'seen' is not a boolean."
      );
      expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
      expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
        "Unable to set rating. Contact the system administrator."
      );
    });

    it("should show error message if trying to set a movie as unseen when no valid IMDB id is given", async () => {
      const movieColRatingSet = myMovieListWrapper.find(
        "[data-vitest=table-row-movie--checkbox-seen]"
      );

      await movieColRatingSet.trigger("click");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[MyMovies implementation error]: Cannot set movie as unseen when when 'imdbId' is not valid."
      );
      expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
      expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
        "Unable to set movie as no longer having been seen. Contact the system administrator."
      );
    });

    it("should show error message if trying to remove a movie when no valid IMDB id is given", async () => {
      const movieColRatingSet = myMovieListWrapper.find(
        "[data-vitest=table-row-movie--button-delete]"
      );

      await movieColRatingSet.trigger("click");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[MyMovies implementation error]: Cannot remove movie if 'imdbId' is not valid."
      );
      expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
      expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
        "Unable to remove movie from personal collection. Contact the system administrator."
      );
    });

    it("should show error message during the removal of a movie, the imdbId was allowed to be invalid and an attempt was made to remove the added status from the search results", () => {
      myMovieListWrapper.vm.setNotAddedInSearchStore("");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[MyMovies implementation error]: Cannot remove a movie's status as being added if 'imdbId' is not valid."
      );
      expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
      expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
        "Unable to remove the movie's status from being added. Contact the system administrator."
      );
    });
  });
});
