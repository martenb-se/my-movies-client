import apiOmdbMock from "@/__mocks__/external/apiOmdb.mock";

/**
 * Search for 'Guardians', 'Hero' or 'Spider-Man'.
 * @param {string} name The name of the movie.
 * @param {string=} type (Optional) Filter search results to only show a certain media type.
 * @param {string=} year (Optional) Filter search results to only show results from a certain year.
 * @param {string=} page (Optional) The page to go to.
 * @returns {Promise<{Title: string, Year: string, imdbID: string, Type: string, Poster: string}[]>}
 * The search results.
 */
export const stubSearchByMovieName = async (
  name,
  { type, year, page } = {}
) => {
  return new Promise((doResolve) => {
    doResolve(apiOmdbMock.search(name, { type, year, page }));
  });
};

/**
 * (Always Throws 'Invalid API Key' Error)
 * Search for 'Guardians', 'Hero' or 'Spider-Man'.
 * @param {string} name The name of the movie.
 * @param {string=} type (Optional) Filter search results to only show a certain media type.
 * @param {string=} year (Optional) Filter search results to only show results from a certain year.
 * @param {string=} page (Optional) The page to go to.
 * @returns {Promise<string>} Failed operation status message.
 */
export const stubSearchByMovieName_RejectInvalidApiKey = async (
  name,
  { type, year, page } = {}
) => {
  return new Promise((doResolve, doReject) => {
    doReject({ Error: "Invalid API key!" });
  });
};

/**
 * (Always Throws 'This Error Should Not Be Known' Error)
 * Search for 'Guardians', 'Hero' or 'Spider-Man'.
 * @param {string} name The name of the movie.
 * @param {string=} type (Optional) Filter search results to only show a certain media type.
 * @param {string=} year (Optional) Filter search results to only show results from a certain year.
 * @param {string=} page (Optional) The page to go to.
 * @returns {Promise<string>} Failed operation status message.
 */
export const stubSearchByMovieName_RejectUnknownError = async (
  name,
  { type, year, page } = {}
) => {
  return new Promise((doResolve, doReject) => {
    doReject({ Error: "This Error Should Not Be Known" });
  });
};
