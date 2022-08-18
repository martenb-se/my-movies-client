/**
 * Mocked representation of the database table 'movies'.
 * @type {{
 * setUnseen: (function(imdbId: string): void),
 * setSeen: (function(imdbId: string, rating: number): void),
 * deleteMovie: (function(imdbId: string): void),
 * clear: (function(): void),
 * addMovie: (function(imdbId: string, name: string): void),
 * getAllMovies: (function(): {imdbId: string, name: string, rating: number, id: number, seen: boolean}[]),
 * getMovie: (function(imdbId: string): {imdbId: string, name: string, rating: number, id: number, seen: boolean}),
 * setRating: (function(imdbId: string, rating: number): void)}}
 */
const dbTableMoviesMock = (() => {
  const baseDb = [
    {
      id: 1,
      imdbId: "tt2015381",
      name: "Guardians of the Galaxy",
      seen: true,
      rating: 10,
    },
    {
      id: 2,
      imdbId: "tt0800369",
      name: "Thor",
      seen: true,
      rating: 5,
    },
    {
      id: 3,
      imdbId: "tt2948356",
      name: "Zootopia",
      seen: false,
      rating: 0,
    },
    {
      id: 4,
      imdbId: "tt4154756",
      name: "Avengers: Infinity War",
      seen: true,
      rating: 2,
    },
  ];

  let idCount = 5;

  let db = JSON.parse(JSON.stringify(baseDb));
  return {
    /**
     * Clear the table to its original state.
     */
    clear: () => {
      db = JSON.parse(JSON.stringify(baseDb));
    },
    /**
     * Get all movies from the table.
     * @returns {{id: number,
     * imdbId: string,
     * name: string,
     * seen: boolean,
     * rating: number}[]} A list of movies.
     */
    getAllMovies: () => {
      return db;
    },
    /**
     * Add a movie to the table.
     * @param imdbId The IMDB id of the movie to add.
     * @param name The name of the movie to att.
     */
    addMovie: (imdbId, name) => {
      db.push({ id: idCount++, imdbId, name, seen: false, rating: 0 });
    },
    /**
     * Get a movie from the table.
     * @param imdbId The IMDB id of the movie to get.
     * @returns {{id: number,
     * imdbId: string,
     * name: string,
     * seen: boolean,
     * rating: number}} The movie.
     */
    getMovie: (imdbId) => {
      return db.filter((row) => {
        return row.imdbId === imdbId;
      })[0];
    },
    /**
     * Delete a movie from the table.
     * @param imdbId The IMDB id of the movie to delete.
     */
    deleteMovie: (imdbId) => {
      db = db.filter((row) => {
        return row.imdbId !== imdbId;
      });
    },
    /**
     * Change rating of a movie from the table.
     * @param imdbId The IMDB id of the movie to change the rating for.
     * @param rating The new rating.
     */
    setRating: (imdbId, rating) => {
      db.forEach((row) => {
        if (row.imdbId === imdbId) row.rating = rating;
      });
    },
    /**
     * Update a movie from the table as having now been seen.
     * @param imdbId The IMDB id of the movie that has now been seen.
     * @param rating The rating for the newly seen movie.
     */
    setSeen: (imdbId, rating) => {
      db.forEach((row) => {
        if (row.imdbId === imdbId) {
          row.seen = true;
          row.rating = rating;
        }
      });
    },
    /**
     * Update a movie from the table as no longer having been seen.
     * @param imdbId The IMDB id of the movie that is no longer seen.
     */
    setUnseen: (imdbId) => {
      db.forEach((row) => {
        if (row.imdbId === imdbId) {
          row.seen = false;
          row.rating = 0;
        }
      });
    },
  };
})();

export default dbTableMoviesMock;
