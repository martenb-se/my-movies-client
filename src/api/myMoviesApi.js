import InvalidArgumentError from "@/util/customError/invalidArgumentError";
import { HttpMethod } from "@/enum/httpMethodEnum";

/**
 * OMDbAPI handler.
 */
export default class myMoviesApi {
  STANDARD_API_URL = "http://localhost:8080/api/movies";
  API_PATH_END_UPDATE_RATING = "rating";
  API_PATH_END_UPDATE_NAME = "name"; // TODO Implement me
  API_PATH_END_UPDATE_IMDBID = "imdbid"; // TODO Implement me
  API_PATH_END_UPDATE_SEEN = "seen";
  API_PATH_END_UPDATE_UNSEEN = "unseen";

  /**
   * My Movies API handler constructor that takes an API key and an optional alternative API url.
   * @param {string} apiUrl (Optional) Use different API url than the standard URL.
   */
  constructor({ apiUrl } = {}) {
    if (apiUrl !== undefined && typeof apiUrl !== "string")
      throw new InvalidArgumentError(
        "Optional argument 'apiUrl' must be a string.",
        "apiUrl"
      );

    this.apiUrl =
      apiUrl === undefined || apiUrl.length > 0
        ? this.STANDARD_API_URL
        : apiUrl;
  }

  /**
   * Call the API with the provided query and get the result.
   * @param {string} apiQuery The query to send to the api.
   * @param {({name: string} | {})=} httpMethod (Optional) Set the HTTP method to use, if not set GET is used.
   * @param {{}|string|number} requestData (Optional) Data to send along with the request, if not set, nothing is sent.
   * @returns {Promise<*>} The response from the api call, or if there was an error, the error is returned.
   */
  _callApi(apiQuery, httpMethod = HttpMethod.GET, requestData = {}) {
    return new Promise((doResolve, doReject) => {
      fetch(this.apiUrl + apiQuery, {
        method: httpMethod.name,
        headers:
          requestData !== undefined &&
          requestData !== null &&
          ((typeof requestData === "object" &&
            Object.keys(requestData).length) ||
            typeof requestData === "string" ||
            typeof requestData === "number")
            ? { "Content-Type": "application/json" }
            : undefined,
        body:
          requestData !== undefined &&
          requestData !== null &&
          ((typeof requestData === "object" &&
            Object.keys(requestData).length) ||
            typeof requestData === "string" ||
            typeof requestData === "number")
            ? JSON.stringify(requestData)
            : undefined,
      })
        .then(
          /**
           * Callback function to handle JSON output from the API and pass data along.
           * @param {{ok: bool, headers: {}, text: function(): Promise<{}>, json: function(): Promise<{}>}} response The
           * response from the API is either a raw text string (status) or an object.
           */
          (response) => {
            if (response.headers.get("content-type") === "application/json") {
              response.json().then(
                /**
                 * Callback function to handle JSON output from the API and pass data along.
                 * @param {*} data The response from the API can be anything.
                 */
                (data) => {
                  if (response.ok) {
                    doResolve(data);
                  } else {
                    doReject(data);
                  }
                }
              );
            } else {
              response.text().then(
                /**
                 * Callback function to handle textual output from the API and pass data along.
                 * @param {*} data The response from the API can be anything.
                 */
                (data) => {
                  if (response.ok) {
                    doResolve(data);
                  } else {
                    doReject(data);
                  }
                }
              );
            }
          }
        )
        .catch(
          /**
           * Callback function to handle fetch failures
           * @param {*} response The error
           */
          (response) => {
            if (response instanceof TypeError) {
              console.error(
                "[MyMovies integration error]: Could not reach MyMovies back-end. Read the following error message: " +
                  response.message
              );
              doReject("MyMovies server could not be reached!");
            } else {
              doReject("unknown network error");
            }
          }
        );
    });
  }

  /**
   * Get a list of all movies.
   * @returns {Promise<{
   *     id: number,
   *     imdbId: string,
   *     name: string,
   *     seen: boolean,
   *     rating: number
   *   }[]|string>} Get the list of all movies if any are found, or if an error occurred the error message is returned.
   */
  async getAllMovies() {
    return new Promise((doResolve, doReject) => {
      this._callApi("")
        .then((searchData) => {
          doResolve(searchData);
        })
        .catch((errorData) => {
          doReject(errorData);
        });
    });
  }

  /**
   * Set rating for a movie.
   * @param imdbId The IMDB id of the movie to set the rating for.
   * @param rating The updated rating for the movie.
   * @returns {Promise<string>} A status message confirming the change, or if an error occurred the error message.
   */
  async setRating(imdbId, rating) {
    return new Promise((doResolve, doReject) => {
      this._callApi(
        "/" + imdbId + "/" + this.API_PATH_END_UPDATE_RATING,
        HttpMethod.PUT,
        rating
      )
        .then((searchData) => {
          doResolve(searchData);
        })
        .catch((errorData) => {
          doReject(errorData);
        });
    });
  }

  /**
   * Change a movie's status as having been seen, and also give it a rating.
   * @param imdbId The IMDB id of the movie that has now been seen.
   * @param rating The rating of the newly seen movie.
   * @returns {Promise<string>} A status message confirming the change, or if an error occurred the error message.
   */
  async setSeen(imdbId, rating) {
    return new Promise((doResolve, doReject) => {
      this._callApi(
        "/" + imdbId + "/" + this.API_PATH_END_UPDATE_SEEN,
        HttpMethod.PUT,
        rating
      )
        .then((searchData) => {
          doResolve(searchData);
        })
        .catch((errorData) => {
          doReject(errorData);
        });
    });
  }

  /**
   * Change a movie's status as having no longer been seen.
   * @param imdbId The IMDB id of the movie that is no longer seen.
   * @returns {Promise<string>} A status message confirming the change, or if an error occurred the error message.
   */
  async setUnseen(imdbId) {
    return new Promise((doResolve, doReject) => {
      this._callApi(
        "/" + imdbId + "/" + this.API_PATH_END_UPDATE_UNSEEN,
        HttpMethod.PUT,
        undefined
      )
        .then((searchData) => {
          doResolve(searchData);
        })
        .catch((errorData) => {
          doReject(errorData);
        });
    });
  }

  /**
   * Add a new movie to the personal collection.
   * @param imdbId The IMDB id of the movie to add.
   * @param name The name of the movie to add.
   * @returns {Promise<string>} A status message confirming the change, or if an error occurred the error message.
   */
  async addMovie(imdbId, name) {
    return new Promise((doResolve, doReject) => {
      this._callApi("", HttpMethod.POST, { imdbId, name })
        .then((searchData) => {
          doResolve(searchData);
        })
        .catch((errorData) => {
          doReject(errorData);
        });
    });
  }

  /**
   * Get a movie from the collection by its IMDB id.
   * @param imdbId The IMDB id of the movie to get.
   * @returns {Promise<{
   *     id: number,
   *     imdbId: string,
   *     name: string,
   *     seen: boolean,
   *     rating: number
   *   }|string>} If the IMDB id is found, the movie is returned, otherwise nothing is returned. If an error occurs,
   *   the error message is returned.
   */
  async getMovie(imdbId) {
    return new Promise((doResolve, doReject) => {
      this._callApi("/" + imdbId, HttpMethod.GET, undefined)
        .then((searchData) => {
          doResolve(searchData);
        })
        .catch((errorData) => {
          doReject(errorData);
        });
    });
  }

  /**
   * Remove a movie from the personal collection.
   * @param imdbId The IMDB id of the movie to remove.
   * @returns {Promise<string>} A status message confirming the change, or if an error occurred the error message.
   */
  async deleteMovie(imdbId) {
    return new Promise((doResolve, doReject) => {
      this._callApi("/" + imdbId, HttpMethod.DELETE, undefined)
        .then((searchData) => {
          doResolve(searchData);
        })
        .catch((errorData) => {
          doReject(errorData);
        });
    });
  }
}
