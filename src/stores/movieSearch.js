import { defineStore } from "pinia";
import omdbApi from "@/api/external/omdbApi";
import { getEnumByName } from "@/util/enumHandling";
import { SearchType } from "@/enum/omdbApiEnum";
import { useErrorMessageStore } from "@/stores/errorMessage";
import InvalidArgumentError from "@/util/customError/invalidArgumentError";
import { useMyMoviesStore } from "@/stores/myMovies";
import SetupCallMissingError from "@/util/customError/setupCallMissingError";

/**
 * Update search results from the OMDB api to also have a mark if the movie is in the personal collection or not.
 * @param {{
 *     Title: string,
 *     Year: string,
 *     imdbID: string,
 *     Type: string,
 *     Poster: string
 *   }[]} searchResults The search results to update.
 * @returns {{
 *     Title: string,
 *     Year: string,
 *     imdbID: string,
 *     Type: string,
 *     Poster: string,
 *     inMyMovies: boolean
 *   }[]} The updated search results now including the inMyMovies flag.
 */
const appendMovieStatusToSearchResult = (searchResults) => {
  const myMoviesStore = useMyMoviesStore();
  return searchResults.reduce((newSearchData, curResult) => {
    const curResultCopy = JSON.parse(JSON.stringify(curResult));
    curResultCopy["inMyMovies"] = Object.prototype.hasOwnProperty.call(
      myMoviesStore.movies,
      curResultCopy.imdbID
    );
    return [...newSearchData, curResultCopy];
  }, []);
};

/**
 * Store to hold search results when searching via the OMDB api
 */
export const useMovieSearchStore = defineStore({
  id: "movieSearch",
  state: () => ({
    apiInstance: {},
    movie: "",
    type: "",
    year: "",
    search: [],
    results: 0,
    page: 0,
  }),
  actions: {
    /**
     * Search for a movie by its name and apply optional search filters if necessary.
     * @param {string} name The name of the movie.
     * @param {string=} type (Optional) Filter search results to only show a certain media type.
     * @param {string=} year (Optional) Filter search results to only show results from a certain year.
     * @returns {Promise<void>} Nothing
     */
    async searchByMovieName(name, { type, year } = {}) {
      if (!(this.apiInstance instanceof omdbApi))
        throw new InvalidArgumentError(
          "Argument 'apiInstance' is not correctly initiated, searchByMovieName() cannot run!",
          "apiInstance"
        );

      if (typeof name !== "string") {
        throw new InvalidArgumentError("Movie name must be a string!", "name");
      }

      if (name.length === 0) {
        throw new InvalidArgumentError(
          "Movie name must be set before searching!",
          "name"
        );
      }

      if (type !== undefined && typeof type !== "string") {
        throw new InvalidArgumentError("Movie type must be a string!", "type");
      }

      if (
        type !== undefined &&
        type !== "" &&
        Object.keys(getEnumByName(SearchType, type)).length === 0
      ) {
        throw new InvalidArgumentError(
          "Movie type must be any of: " +
            Object.keys(SearchType)
              .reduce((res, key) => {
                return res + ", " + SearchType[key].name;
              }, "")
              .substring(2),
          "type"
        );
      }

      if (year !== undefined && typeof year !== "string") {
        throw new InvalidArgumentError("Movie year must be a string!", "year");
      }

      if (year !== undefined && year !== "" && !/^[0-9]{1,4}$/.test(year)) {
        throw new InvalidArgumentError(
          "Movie year must be between 0 - 9999!",
          "year"
        );
      }

      try {
        const searchData = await this.apiInstance.searchByMovieName(name, {
          type: getEnumByName(SearchType, type),
          year: year,
        });

        this.search = appendMovieStatusToSearchResult(searchData.Search);
        this.results = parseInt(searchData.totalResults);

        this.movie = name;
        this.type = type;
        this.year = year;
        this.page = 1;
      } catch (errorData) {
        const errorMessageStore = useErrorMessageStore();
        if (errorData.Error === "Invalid API key!")
          errorMessageStore.addMessage(
            "Searching failed because the used API key (" +
              this.apiInstance.apiKey +
              ") is invalid."
          );
        else
          errorMessageStore.addMessage(
            "Searching failed because of an unknown error: " + errorData.Error
          );
      }
    },
    /**
     * Go to a specific page in the search results.
     * @param {number} page The page to go to.
     * @returns {Promise<void>} Nothing
     */
    async goToPage(page) {
      if (!(this.apiInstance instanceof omdbApi))
        throw new InvalidArgumentError(
          "Argument 'apiInstance' is not correctly initiated, goToPage() cannot run!",
          "apiInstance"
        );

      if (this.movie === "" || this.page === 0) {
        throw new SetupCallMissingError(
          "Method searchByMovieName() must first be called before goToPage() can be called!",
          "searchByMovieName()"
        );
      }

      if (typeof page !== "number") {
        throw new InvalidArgumentError(
          "Argument 'page' must be a number!",
          "page"
        );
      }

      if (page === this.page) {
        throw new InvalidArgumentError(
          "Argument 'page' must be a different page than what is currently set!",
          "page"
        );
      }

      if (page < 1) {
        throw new InvalidArgumentError(
          "Argument 'page' cannot be less than one!",
          "page"
        );
      }

      if (page > Math.ceil(this.results / 10)) {
        throw new InvalidArgumentError(
          "Argument 'page' is out of bounds, it must be less than or equal to: " +
            Math.ceil(this.results / 10),
          "page"
        );
      }

      try {
        const searchData = await this.apiInstance.searchByMovieName(
          this.movie,
          {
            type: getEnumByName(SearchType, this.type),
            year: this.year,
            page: String(page),
          }
        );
        this.search = appendMovieStatusToSearchResult(searchData.Search);
        this.results = parseInt(searchData.totalResults);
        this.page = page;
      } catch (errorData) {
        const errorMessageStore = useErrorMessageStore();
        if (errorData.Error === "Invalid API key!")
          errorMessageStore.addMessage(
            "Changing page failed because the used API key (" +
              this.apiInstance.apiKey +
              ") is invalid."
          );
        else
          errorMessageStore.addMessage(
            "Changing page failed because of an unknown error: " +
              errorData.Error
          );
      }
    },
    /**
     * Go to the previous page in the search results.
     * @returns {Promise<void>} Nothing
     */
    async previousPage() {
      if (this.page <= 1) {
        throw new Error(
          "Current page is currently " +
            this.page +
            ", there is no previous page."
        );
      }

      await this.goToPage(this.page - 1);
    },
    /**
     * Go to the next page in the search results.
     * @returns {Promise<void>} Nothing
     */
    async nextPage() {
      if (this.page >= Math.ceil(this.results / 10)) {
        throw new Error(
          "Current page is currently " +
            this.page +
            ", and the final page is " +
            Math.ceil(this.results / 10) +
            ". There is no next page."
        );
      }

      await this.goToPage(this.page + 1);
    },
  },
});
