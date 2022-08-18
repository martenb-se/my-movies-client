import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

import { shallowMount } from "@vue/test-utils";
import MovieSearchList from "@/components/MovieSearchList.vue";

import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";
import { useErrorMessageStore } from "@/stores/errorMessage";
import { useMovieSearchStore } from "@/stores/movieSearch";
import { useMyMoviesStore } from "@/stores/myMovies";

import searchGuardiansAnyAny1 from "@/__fixtures__/search/guardians/any_any_1.json";

describe("MovieSearchList.vue Test", () => {
  let pinia;

  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    setActivePinia(pinia);
  });

  describe("when mounted with search results from 'Guardians' and some movies are already in the personal collection", () => {
    let movieSearchListWrapper;
    let movieSearchStore;
    let myMoviesStore;

    beforeEach(() => {
      movieSearchStore = useMovieSearchStore();
      myMoviesStore = useMyMoviesStore();

      myMoviesStore.movies = { tt2015381: true, tt4915672: true };

      movieSearchStore.search = searchGuardiansAnyAny1.Search.reduce(
        (newSearchData, curResult) => {
          const curResultCopy = JSON.parse(JSON.stringify(curResult));
          curResultCopy["inMyMovies"] = Object.prototype.hasOwnProperty.call(
            myMoviesStore.movies,
            curResultCopy.imdbID
          );
          return [...newSearchData, curResultCopy];
        },
        []
      );

      movieSearchStore.results = parseInt(searchGuardiansAnyAny1.totalResults);
      movieSearchStore.movie = "Guardians";
      movieSearchStore.type = "";
      movieSearchStore.year = "";
      movieSearchStore.page = 1;

      movieSearchListWrapper = shallowMount(MovieSearchList, {
        global: {
          plugins: [pinia],
        },
      });
    });

    afterEach(() => {
      movieSearchListWrapper.unmount();
    });

    it("should show all results from movieSearchStore.search", () => {
      const searchResultCards = movieSearchListWrapper.findAll(
        "[data-vitest=card-search-results] > div"
      );
      expect(searchResultCards).toHaveLength(10);
      searchResultCards.forEach((searchResultCard) => {
        expect(searchResultCard.element.getAttribute("data-vitest")).toMatch(
          /card-search-result-[a-z\d]+/
        );
      });
    });

    it("should show title for each search result", () => {
      const searchResultCards = movieSearchListWrapper.findAll(
        "[data-vitest=card-search-results] > div"
      );
      let titleExists = true;
      searchResultCards.forEach((searchResultCard) => {
        if (titleExists === true) {
          const cardTitleText = searchResultCard
            .find("[class=card-title]")
            .text();
          const matchingSearchResult = movieSearchStore.search.filter(
            (searchResult) => searchResult.Title === cardTitleText
          );
          if (matchingSearchResult.length === 0) titleExists = false;
        }
      });
      expect(titleExists).toBeTruthy();
    });

    it("should show type for each search result", () => {
      const searchResultCards = movieSearchListWrapper.findAll(
        "[data-vitest=card-search-results] > div"
      );
      let typeExists = true;
      searchResultCards.forEach((searchResultCard) => {
        if (typeExists === true) {
          const cardTypeText = searchResultCard
            .find("[data-vitest=card-search-result-type]")
            .text();
          const matchingSearchResult = movieSearchStore.search.filter(
            (searchResult) => searchResult.Type === cardTypeText
          );
          if (matchingSearchResult.length === 0) typeExists = false;
        }
      });
      expect(typeExists).toBeTruthy();
    });

    it("should show year for each search result", () => {
      const searchResultCards = movieSearchListWrapper.findAll(
        "[data-vitest=card-search-results] > div"
      );
      let yearExists = true;
      searchResultCards.forEach((searchResultCard) => {
        if (yearExists === true) {
          const cardYearText = searchResultCard
            .find("[data-vitest=card-search-result-year]")
            .text();
          const matchingSearchResult = movieSearchStore.search.filter(
            (searchResult) => searchResult.Year === cardYearText
          );
          if (matchingSearchResult.length === 0) yearExists = false;
        }
      });
      expect(yearExists).toBeTruthy();
    });

    it("should show IMDB id for each search result", () => {
      const searchResultCards = movieSearchListWrapper.findAll(
        "[data-vitest=card-search-results] > div"
      );
      let imdbIdExists = true;
      searchResultCards.forEach((searchResultCard) => {
        if (imdbIdExists === true) {
          const cardImdbIdText = searchResultCard
            .find("[data-vitest=card-search-result-imdbid]")
            .text();
          const matchingSearchResult = movieSearchStore.search.filter(
            (searchResult) => searchResult.imdbID === cardImdbIdText
          );
          if (matchingSearchResult.length === 0) imdbIdExists = false;
        }
      });
      expect(imdbIdExists).toBeTruthy();
    });

    it("should show 'add movie' for all movies that are not added", () => {
      const searchResultCards = movieSearchListWrapper.findAll(
        "[data-vitest=card-search-results] > div"
      );
      let addMovieExists = true;
      searchResultCards.forEach((searchResultCard) => {
        if (addMovieExists === true) {
          const cardImdbIdText = searchResultCard
            .find("[data-vitest=card-search-result-imdbid]")
            .text();
          if (
            !Object.prototype.hasOwnProperty.call(
              myMoviesStore.movies,
              cardImdbIdText
            )
          ) {
            const buttonAddMovieText = searchResultCard
              .find("[data-vitest=button-add-movie]")
              .text();
            expect(buttonAddMovieText).toBe("Add movie");
            if (buttonAddMovieText !== "Add movie") addMovieExists = false;
          }
        }
      });
      expect(addMovieExists).toBeTruthy();
    });

    it("should show 'already added' button for already added movies", () => {
      const searchResultCards = movieSearchListWrapper.findAll(
        "[data-vitest=card-search-results] > div"
      );
      let addMovieExists = true;
      searchResultCards.forEach((searchResultCard) => {
        if (addMovieExists === true) {
          const cardImdbIdText = searchResultCard
            .find("[data-vitest=card-search-result-imdbid]")
            .text();
          if (
            Object.prototype.hasOwnProperty.call(
              myMoviesStore.movies,
              cardImdbIdText
            )
          ) {
            const buttonAddMovieText = searchResultCard
              .find("[data-vitest=button-add-movie]")
              .text();
            expect(buttonAddMovieText).toBe("Already added");
            if (buttonAddMovieText !== "Already added") addMovieExists = false;
          }
        }
      });
      expect(addMovieExists).toBeTruthy();
    });

    it("should show a navigation for all available pages", () => {
      const lastDirectNavLinkText = movieSearchListWrapper.find(
        "[data-vitest=nav-pages] > ul > li.page-item:nth-last-child(2)"
      );
      expect(parseInt(lastDirectNavLinkText.text())).toBe(
        Math.ceil(movieSearchStore.results / 10)
      );
    });

    it("should add movie to the myMoviesStore if added, should set inMyMovies", async () => {
      const movieToAdd = "tt3896198";
      const searchResultMovie = movieSearchStore.search.filter(
        (searchResult) => searchResult.imdbID === movieToAdd
      )[0];

      const searchResult = movieSearchListWrapper.find(
        "[data-vitest=card-search-result-" + movieToAdd + "]"
      );

      const searchResultAddButton = searchResult.find(
        "[data-vitest=button-add-movie]"
      );

      expect(searchResultMovie.inMyMovies).toBeFalsy();
      await searchResultAddButton.trigger("click");
      expect(myMoviesStore.addMovie).toHaveBeenCalledTimes(1);
      expect(myMoviesStore.addMovie).toHaveBeenCalledWith(
        movieToAdd,
        "Guardians of the Galaxy Vol. 2"
      );
      expect(searchResultMovie.inMyMovies).toBeTruthy();
    });

    it("should be able to go to specific page using the navigation bar", async () => {
      const secondPageDirectLink = movieSearchListWrapper.find(
        "[data-vitest=page-link-page-2]"
      );

      await secondPageDirectLink.trigger("click");
      expect(movieSearchStore.goToPage).toHaveBeenCalledTimes(1);
      expect(movieSearchStore.goToPage).toHaveBeenCalledWith(2);
    });

    it("should be able to go to next page using the navigation bar", async () => {
      const nextPageLink = movieSearchListWrapper.find(
        "[data-vitest=page-link-page-next]"
      );

      await nextPageLink.trigger("click");
      expect(movieSearchStore.nextPage).toHaveBeenCalledTimes(1);
    });

    it("should be able to go to previous page using the navigation bar", async () => {
      const previousPageLink = movieSearchListWrapper.find(
        "[data-vitest=page-link-page-previous]"
      );

      await previousPageLink.trigger("click");
      expect(movieSearchStore.previousPage).toHaveBeenCalledTimes(1);
    });
  });

  it("should show an error message if trying to add a movie with no IMDB id", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error");

    const movieSearchStore = useMovieSearchStore();
    const errorMessageStore = useErrorMessageStore();

    movieSearchStore.search = searchGuardiansAnyAny1.Search.reduce(
      (newSearchData, curResult) => {
        const curResultCopy = JSON.parse(JSON.stringify(curResult));
        curResultCopy["inMyMovies"] = false;
        curResultCopy.imdbID = "";
        return [...newSearchData, curResultCopy];
      },
      []
    );

    movieSearchStore.results = parseInt(searchGuardiansAnyAny1.totalResults);
    movieSearchStore.movie = "Guardians";
    movieSearchStore.type = "";
    movieSearchStore.year = "";
    movieSearchStore.page = 1;

    const movieSearchListWrapper = shallowMount(MovieSearchList, {
      global: {
        plugins: [pinia],
      },
    });

    const searchResultCardsAddButton = movieSearchListWrapper.find(
      "[data-vitest=card-search-results] [data-vitest=card-search-result-]:nth-child(2) [data-vitest=button-add-movie]"
    );

    await searchResultCardsAddButton.trigger("click");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[MyMovies implementation error]: Cannot add movie if 'imdbId' is not correctly set."
    );
    expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
    expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
      "Could not add movie due to a client error. Contact the system administrator."
    );

    movieSearchListWrapper.unmount();
  });

  it("should show an error message if trying to add a movie with no name", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error");

    const movieSearchStore = useMovieSearchStore();
    const errorMessageStore = useErrorMessageStore();

    movieSearchStore.search = searchGuardiansAnyAny1.Search.reduce(
      (newSearchData, curResult) => {
        const curResultCopy = JSON.parse(JSON.stringify(curResult));
        curResultCopy["inMyMovies"] = false;
        curResultCopy.Title = "";
        return [...newSearchData, curResultCopy];
      },
      []
    );

    movieSearchStore.results = parseInt(searchGuardiansAnyAny1.totalResults);
    movieSearchStore.movie = "Guardians";
    movieSearchStore.type = "";
    movieSearchStore.year = "";
    movieSearchStore.page = 1;

    const movieSearchListWrapper = shallowMount(MovieSearchList, {
      global: {
        plugins: [pinia],
      },
    });

    const searchResultCardsAddButton = movieSearchListWrapper.find(
      "[data-vitest=card-search-result-tt3896198] [data-vitest=button-add-movie]"
    );

    await searchResultCardsAddButton.trigger("click");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[MyMovies implementation error]: Cannot add movie if 'name' is not correctly set."
    );
    expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
    expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
      "Could not add movie due to a client error. Contact the system administrator."
    );

    movieSearchListWrapper.unmount();
  });
});
