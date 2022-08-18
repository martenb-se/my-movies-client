import dbTableMoviesMock from "@/__mocks__/dbTableMovies.mock";

/**
 * Resets the mock stub data to its original state.
 */
export const resetTableMoviesMock = () => {
  dbTableMoviesMock.clear();
};

/**
 * Get all movies from the mocked database 'movies' table.
 * @returns {Promise<{id: number,
 * imdbId: string,
 * name: string,
 * seen: boolean,
 * rating: number}[]>} A list of movies.
 */
export const stubGetAllMovies = async () => {
  return new Promise((doResolve) => {
    doResolve(dbTableMoviesMock.getAllMovies());
  });
};

/**
 * Add a movie to the mocked database 'movies' table.
 * @param imdbId The IMDB id of the movie to add.
 * @param name The name of the movie to att.
 * @returns {Promise<string>} Operation status message.
 */
export const stubAddMovie = async (imdbId, name) => {
  dbTableMoviesMock.addMovie(imdbId, name);
  return new Promise((doResolve) => {
    doResolve("Movie is saved successfully");
  });
};

/**
 * (Always Throws 'Already Exists' Error)
 * Add a movie to the mocked database 'movies' table.
 * @param imdbId The IMDB id of the movie to add.
 * @param name The name of the movie to att.
 * @returns {Promise<string>} Failed operation status message.
 */
export const stubAddMovie_RejectAlreadyExists = async (imdbId, name) => {
  return new Promise((doResolve, doReject) => {
    doReject("Movie already exists");
  });
};

/**
 * Get a movie from the mocked database 'movies' table.
 * @param imdbId The IMDB id of the movie to get.
 * @returns {Promise<{id: number,
 * imdbId: string,
 * name: string,
 * seen: boolean,
 * rating: number}>} The movie.
 */
export const stubGetMovie = async (imdbId) => {
  return new Promise((doResolve) => {
    doResolve(dbTableMoviesMock.getMovie(imdbId));
  });
};

/**
 * (Always Throws 'Not Found' Error)
 * Get a movie from the mocked database 'movies' table.
 * @param imdbId The IMDB id of the movie to get.
 * @returns {Promise<string>} Failed operation status message.
 */
export const stubGetMovie_RejectNotFound = async (imdbId) => {
  return new Promise((doResolve, doReject) => {
    doReject("Movie not found");
  });
};

/**
 * Delete a movie from the mocked database 'movies' table.
 * @param imdbId The IMDB id of the movie to delete.
 * @returns {Promise<string>} Operation status message.
 */
export const stubDeleteMovie = async (imdbId) => {
  dbTableMoviesMock.deleteMovie(imdbId);
  return new Promise((doResolve) => {
    doResolve("Movie is deleted successfully");
  });
};

/**
 * (Always Throws 'Not Found' Error)
 * Delete a movie from the mocked database 'movies' table.
 * @param imdbId The IMDB id of the movie to delete.
 * @returns {Promise<string>} Failed operation status message.
 */
export const stubDeleteMovie_RejectNotFound = async (imdbId) => {
  return new Promise((doResolve, doReject) => {
    doReject("Movie not found");
  });
};

/**
 * Change rating of a movie from the mocked database 'movies' table.
 * @param imdbId The IMDB id of the movie to change the rating for.
 * @param rating The new rating.
 * @returns {Promise<string>} Operation status message.
 */
export const stubSetRating = async (imdbId, rating) => {
  dbTableMoviesMock.setRating(imdbId, rating);
  return new Promise((doResolve) => {
    doResolve("Movie rating was updated successfully");
  });
};

/**
 * (Always Throws 'Not Found' Error)
 * Change rating of a movie from the mocked database 'movies' table.
 * @param imdbId The IMDB id of the movie to change the rating for.
 * @param rating The new rating.
 * @returns {Promise<string>} Failed operation status message.
 */
export const stubSetRating_RejectNotFound = async (imdbId, rating) => {
  return new Promise((doResolve, doReject) => {
    doReject("Movie not found");
  });
};

/**
 * Update a movie from the mocked database 'movies' table as having now been seen.
 * @param imdbId The IMDB id of the movie that has now been seen.
 * @param rating The rating for the newly seen movie.
 * @returns {Promise<string>} Operation status message.
 */
export const stubSetSeen = async (imdbId, rating) => {
  dbTableMoviesMock.setSeen(imdbId, rating);
  return new Promise((doResolve) => {
    doResolve("Movie seen status and rating updated successfully");
  });
};

/**
 * (Always Throws 'Not Found' Error)
 * Update a movie from the mocked database 'movies' table as having now been seen.
 * @param imdbId The IMDB id of the movie that has now been seen.
 * @param rating The rating for the newly seen movie.
 * @returns {Promise<string>} Failed operation status message.
 */
export const stubSetSeen_RejectNotFound = async (imdbId, rating) => {
  return new Promise((doResolve, doReject) => {
    doReject("Movie not found");
  });
};

/**
 * Update a movie from the mocked database 'movies' table as no longer having been seen.
 * @param imdbId The IMDB id of the movie that is no longer seen.
 * @returns {Promise<string>} Operation status message.
 */
export const stubSetUnseen = async (imdbId) => {
  dbTableMoviesMock.setUnseen(imdbId);
  return new Promise((doResolve) => {
    doResolve("Movie seen status and rating removed successfully");
  });
};

/**
 * (Always Throws 'Not Found' Error)
 * Update a movie from the mocked database 'movies' table as no longer having been seen.
 * @param imdbId The IMDB id of the movie that is no longer seen.
 * @returns {Promise<string>} Failed operation status message.
 */
export const stubSetUnseen_RejectNotFound = async (imdbId, rating) => {
  return new Promise((doResolve, doReject) => {
    doReject("Movie not found");
  });
};
