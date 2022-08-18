/**
 * Enum for OMDbAPI search types.
 * @readonly
 * @enum {name: string}
 */
const SearchType = Object.freeze({
  MOVIE: { name: "movie" },
  SERIES: { name: "series" },
  //EPISODE: { name: "episode" }, // This option is not working, it never returns anything. TODO Implement once its working
});

export { SearchType };
