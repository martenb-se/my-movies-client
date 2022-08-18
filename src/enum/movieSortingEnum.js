/**
 * Enum for movie sorting alternatives.
 * @readonly
 * @enum {name: string}
 */
const MovieSorting = Object.freeze({
  IDASC: { name: "idAscending" },
  IDDESC: { name: "idDescending" },
  NAMEASC: { name: "nameAscending" },
  NAMEDESC: { name: "nameDescending" },
  IMDBIDASC: { name: "imdbIdAscending" },
  IMDBIDDESC: { name: "imdbIdDescending" },
  SEENASC: { name: "seenAscending" },
  SEENDESC: { name: "seenDescending" },
  RATINGASC: { name: "ratingAscending" },
  RATINGDESC: { name: "ratingDescending" },
});

export { MovieSorting };
