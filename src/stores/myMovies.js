import { defineStore } from "pinia";
import myMoviesApi from "@/api/myMoviesApi";
import { useErrorMessageStore } from "@/stores/errorMessage";
import InvalidArgumentError from "@/util/customError/invalidArgumentError";

/**
 * Store to hold and manage the movies in the personal collection.
 */
export const useMyMoviesStore = defineStore({
  id: "myMovies",
  state: () => ({
    apiInstance: {},
    movies: {},
    sorting: "",
  }),
  actions: {
    /**
     * Get all movies from the personal collection.
     * @returns {Promise<void>} Nothing
     */
    async fetchAllMovies() {
      if (!(this.apiInstance instanceof myMoviesApi))
        throw new InvalidArgumentError(
          "Argument 'apiInstance' is not correctly initiated, fetchAllMovies() cannot run!",
          "apiInstance"
        );

      try {
        const movieData = await this.apiInstance.getAllMovies();
        if (
          movieData !== undefined &&
          movieData !== null &&
          typeof movieData === "object" &&
          Object.keys(movieData).length
        ) {
          this.movies = movieData.reduce((movieObj, curMovie) => {
            movieObj[curMovie.imdbId] = curMovie;
            return movieObj;
          }, {});
        } else this.movies = {};
      } catch (errorData) {
        const errorMessageStore = useErrorMessageStore();
        errorMessageStore.addMessage(
          "Listing failed because of an unknown error: " + errorData
        );
      }
    },
    /**
     * Set movie rating for a specified movie.
     * @param {string} imdbId The IMDB id of the movie to set the rating for.
     * @param {number} rating The new rating for the movie.
     * @param {boolean=} seen (Optional) If the movie has been seen already or not, if not set it will be assumed it
     * has been seen.
     * @returns {Promise<void>} Nothing
     */
    async setMovieRating(imdbId, rating, seen = true) {
      if (!(this.apiInstance instanceof myMoviesApi))
        throw new InvalidArgumentError(
          "Argument 'apiInstance' is not correctly initiated, setMovieRating() cannot run!",
          "apiInstance"
        );

      if (typeof imdbId !== "string")
        throw new InvalidArgumentError(
          "Argument 'imdbId' must be a string!",
          "imdbId"
        );

      if (imdbId.length < 1)
        throw new InvalidArgumentError(
          "Argument 'imdbId' is too short!",
          "imdbId"
        );

      if (typeof rating !== "number")
        throw new InvalidArgumentError(
          "Argument 'rating' must be a number!",
          "rating"
        );

      if (rating < 1 || rating > 10)
        throw new InvalidArgumentError(
          "Argument 'rating' must be between 1 and 10!",
          "rating"
        );

      if (typeof seen !== "boolean")
        throw new InvalidArgumentError(
          "Argument 'seen' must be a boolean!",
          "seen"
        );

      try {
        if (seen) {
          await this.apiInstance.setRating(imdbId, rating);
        } else {
          await this.apiInstance.setSeen(imdbId, rating);
        }
        this.movies[imdbId]["rating"] = rating;
        if (seen === false) this.movies[imdbId]["seen"] = true;
      } catch (errorMessage) {
        const errorMessageStore = useErrorMessageStore();
        errorMessageStore.addMessage(
          "Updating movie rating failed because of the following error: " +
            errorMessage
        );
      }
    },
    /**
     * Mark movie to not having been seen anymore.
     * @param {string} imdbId The IMDB id of the movie to mark as no longer having been seen.
     * @returns {Promise<void>} Nothing
     */
    async setMovieUnseen(imdbId) {
      if (!(this.apiInstance instanceof myMoviesApi))
        throw new InvalidArgumentError(
          "Argument 'apiInstance' is not correctly initiated, setMovieUnseen() cannot run!",
          "apiInstance"
        );

      if (typeof imdbId !== "string")
        throw new InvalidArgumentError(
          "Argument 'imdbId' must be a string!",
          "imdbId"
        );

      if (imdbId.length < 1)
        throw new InvalidArgumentError(
          "Argument 'imdbId' is too short!",
          "imdbId"
        );

      try {
        await this.apiInstance.setUnseen(imdbId);
        this.movies[imdbId]["rating"] = 0;
        this.movies[imdbId]["seen"] = false;
      } catch (errorMessage) {
        const errorMessageStore = useErrorMessageStore();
        errorMessageStore.addMessage(
          "Updating movie seen failed because of the following error: " +
            errorMessage
        );
      }
    },
    /**
     * Remove a movie from the personal collection.
     * @param {string} imdbId The IMDB id of the movie to remove.
     * @returns {Promise<void>} Nothing
     */
    async deleteMovie(imdbId) {
      if (!(this.apiInstance instanceof myMoviesApi))
        throw new InvalidArgumentError(
          "Argument 'apiInstance' is not correctly initiated, deleteMovie() cannot run!",
          "apiInstance"
        );

      if (typeof imdbId !== "string")
        throw new InvalidArgumentError(
          "Argument 'imdbId' must be a string!",
          "imdbId"
        );

      if (imdbId.length < 1)
        throw new InvalidArgumentError(
          "Argument 'imdbId' is too short!",
          "imdbId"
        );

      try {
        await this.apiInstance.deleteMovie(imdbId);
        delete this.movies[imdbId];
      } catch (errorMessage) {
        const errorMessageStore = useErrorMessageStore();
        errorMessageStore.addMessage(
          "Deleting movie seen failed because of the following error: " +
            errorMessage
        );
      }
    },
    /**
     * Add a movie to the personal collection.
     * @param {string} imdbId The IMDB id of the movie to add.
     * @param {string} name The name of the movie to add.
     * @returns {Promise<void>} Nothing
     */
    async addMovie(imdbId, name) {
      if (!(this.apiInstance instanceof myMoviesApi))
        throw new InvalidArgumentError(
          "Argument 'apiInstance' is not correctly initiated, addMovie() cannot run!",
          "apiInstance"
        );

      if (typeof imdbId !== "string")
        throw new InvalidArgumentError(
          "Argument 'imdbId' must be a string!",
          "imdbId"
        );

      if (imdbId.length < 1)
        throw new InvalidArgumentError(
          "Argument 'imdbId' is too short!",
          "imdbId"
        );

      if (typeof name !== "string")
        throw new InvalidArgumentError(
          "Argument 'name' must be a string!",
          "imdbId"
        );

      if (name.length < 1)
        throw new InvalidArgumentError(
          "Argument 'name' is too short!",
          "imdbId"
        );

      try {
        await this.apiInstance.addMovie(imdbId, name);
        this.movies[imdbId] = await this.apiInstance.getMovie(imdbId);
      } catch (errorMessage) {
        throw new Error(errorMessage);
      }
    },
  },
});
