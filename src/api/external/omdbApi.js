import InvalidArgumentError from "@/util/customError/invalidArgumentError";

/**
 * OMDbAPI handler.
 */
export default class omdbApi {
  STANDARD_API_URL = "https://www.omdbapi.com";
  API_QUERY_KEY_APIKEY = "apikey";
  API_QUERY_KEY_SEARCH = "s";
  API_QUERY_KEY_SEARCH_PAGE = "page";
  API_QUERY_KEY_SEARCH_TYPE = "type";
  API_QUERY_KEY_SEARCH_YEAR = "y";

  /**
   * OMDbAPI handler constructor that takes an API key and an optional alternative API url.
   * @param {string} apiKey API key to use to access the OMDbAPI.
   * @param {string} apiUrl (Optional) Use different API url than the standard URL.
   */
  constructor(apiKey, { apiUrl } = {}) {
    if (typeof apiKey !== "string")
      throw new InvalidArgumentError("API key must be a string.", "apiKey");

    if (apiKey.length === 0)
      throw new InvalidArgumentError("API key cannot be empty.", "apiKey");

    if (apiUrl !== undefined && typeof apiUrl !== "string")
      throw new InvalidArgumentError(
        "Optional argument 'apiUrl' must be a string.",
        "apiUrl"
      );

    this.apiKey = apiKey;
    this.apiUrl =
      apiUrl === undefined || apiUrl.length > 0
        ? this.STANDARD_API_URL
        : apiUrl;
  }

  /**
   * Call the API with the provided query and get the result.
   * @param {string} apiQuery The query to send to the api.
   * @returns {Promise<{Search:
   *   {
   *     Title: string,
   *     Year: string,
   *     imdbID: string,
   *     Type: string,
   *     Poster: string
   *   }[],
   *   totalResults: string,
   *   Response: string} |
   *   {
   *     Response: string,
   *     Error: string}>
   * } The results from the search, or if there was an error, the error is returned.
   */
  _callApi(apiQuery) {
    return new Promise((doResolve, doReject) => {
      fetch(this.apiUrl + "/?" + apiQuery, {
        method: "GET",
      })
        .then((res) => res.json())
        .then(
          /**
           * Callback function to handle JSON output from the API and pass data along.
           * @param {{Response: string}} data The response from the API is an object
           * containing at least the key 'Response'.
           */
          (data) => {
            if (data.Response === "True") {
              doResolve(data);
            } else {
              doReject(data);
            }
          }
        );
    });
  }

  /**
   * Search for a movie by its name and apply optional search filters if necessary.
   * @param {string} name The name of the movie.
   * @param {({name: string} | {})=} type (Optional) Filter search results to only show a certain media type.
   * @param {string=} year (Optional) Filter search results to only show results from a certain year.
   * @param {string=} page (Optional) Show search results from a given page.
   * @returns {Promise<{Search:
   *   {
   *     Title: string,
   *     Year: string,
   *     imdbID: string,
   *     Type: string,
   *     Poster: string
   *   }[],
   *   totalResults: string,
   *   Response: string} |
   *   {
   *     Response: string,
   *     Error: string}>
   * } The results from the search, or if there was an error, the error is returned.
   */
  async searchByMovieName(name, { type, year, page } = {}) {
    if (typeof name !== "string")
      throw new InvalidArgumentError("Name must be a string", "name");

    if (name.length === 0)
      throw new InvalidArgumentError("Name cannot be empty", "name");

    if (type !== undefined && !(type instanceof Object))
      throw new InvalidArgumentError(
        "Optional argument 'type' must be an object.",
        "type"
      );

    if (year !== undefined && typeof year !== "string")
      throw new InvalidArgumentError(
        "Optional argument 'year' must be a string.",
        "year"
      );

    if (page !== undefined && typeof page !== "string")
      throw new InvalidArgumentError(
        "Optional argument 'page' must be a string.",
        "page"
      );

    const queryBuild = (
      this.API_QUERY_KEY_APIKEY +
      "=" +
      this.apiKey +
      "&" +
      this.API_QUERY_KEY_SEARCH +
      "=" +
      encodeURIComponent(name) +
      "&" +
      (type !== undefined && Object.keys(type).length > 0
        ? this.API_QUERY_KEY_SEARCH_TYPE + "=" + type.name + "&"
        : "") +
      (year !== undefined && year.length > 0
        ? this.API_QUERY_KEY_SEARCH_YEAR + "=" + year + "&"
        : "") +
      (page !== undefined && page.length > 0
        ? this.API_QUERY_KEY_SEARCH_PAGE + "=" + page + "&"
        : "")
    ).slice(0, -1);
    return new Promise((doResolve, doReject) => {
      this._callApi(queryBuild)
        .then((searchData) => {
          doResolve(searchData);
        })
        .catch((errorData) => {
          doReject(errorData);
        });
    });
  }
}
