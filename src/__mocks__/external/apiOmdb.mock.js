import searchNotYetAdded from "@/__fixtures__/search/not_yet_added.json";
import searchGuardiansAnyAny1 from "@/__fixtures__/search/guardians/any_any_1.json";
import searchGuardiansAny2015p1 from "@/__fixtures__/search/guardians/any_2015_1.json";
import searchGuardiansMovieAny1 from "@/__fixtures__/search/guardians/movie_any_1.json";
import searchGuardiansMovie2015p1 from "@/__fixtures__/search/guardians/movie_2015_1.json";
import searchGuardiansSeriesAny1 from "@/__fixtures__/search/guardians/series_any_1.json";
import searchGuardiansSeries2015p1 from "@/__fixtures__/search/guardians/series_2015_1.json";
import searchHeroAnyAny1 from "@/__fixtures__/search/Hero/any_any_1.json";
import searchHeroAnyAny2 from "@/__fixtures__/search/Hero/any_any_2.json";
import searchHeroAnyAny180 from "@/__fixtures__/search/Hero/any_any_180.json";
import searchHeroAnyAny181 from "@/__fixtures__/search/Hero/any_any_181.json";
import searchSpiderManAnyAny1 from "@/__fixtures__/search/Spider-Man/any_any_1.json";
import { SearchType } from "@/enum/omdbApiEnum";

/**
 * Mocked representation of the API resonses from OMDB (http://www.omdbapi.com/)
 * @type {{
 * search:
 *   (function(string, { type: string, year: string, page: string }):
 *     {Search: {Title: string, Year: string, imdbID: string, Type: string, Poster: string}[],
 *       totalResults: string,
 *       Response: string}|
 *     {Response: string,
 *       Error: string}
 *   )
 * }}
 */
const apiOmdbMock = (() => {
  return {
    /**
     * Search for a specific movie.
     * @param {string} name The name of the media to search for.
     * @param {string=} type (Optional) The type of media to search for: movie, series, episode.
     * @param {string=} year (Optional) The year when the media came out.
     * @param {string=} page (Optional) The search results page to show.
     * @returns {
     *   {Search:
     *     {Title: string,
     *       Year: string,
     *       imdbID: string,
     *       Type: string,
     *       Poster: string}[],
     *     totalResults: string,
     *     Response: string}|
     *     {Response: string,
     *       Error: string}
     * } The search results.
     */
    search: (name, { type, year, page } = {}) => {
      if (name === "Guardians") {
        if (
          type === undefined ||
          (type instanceof Object && Object.keys(type).length === 0)
        ) {
          if (year === undefined) {
            if (page === undefined || page === "1")
              return searchGuardiansAnyAny1;
          } else if (year === "2015") {
            if (page === undefined || page === "1")
              return searchGuardiansAny2015p1;
          }
        } else if (
          type instanceof Object &&
          Object.prototype.hasOwnProperty.call(type, "name")
        ) {
          if (type.name === SearchType.MOVIE.name) {
            if (year === undefined) {
              if (page === undefined || page === "1")
                return searchGuardiansMovieAny1;
            } else if (year === "2015") {
              if (page === undefined || page === "1")
                return searchGuardiansMovie2015p1;
            }
          } else if (type.name === SearchType.SERIES.name) {
            if (year === undefined) {
              if (page === undefined || page === "1")
                return searchGuardiansSeriesAny1;
            } else if (year === "2015") {
              if (page === undefined || page === "1")
                return searchGuardiansSeries2015p1;
            }
          }
        }
      } else if (name === "Hero") {
        if (
          (type === undefined ||
            (type instanceof Object && Object.keys(type).length === 0)) &&
          year === undefined
        ) {
          if (page === undefined || page === "1") return searchHeroAnyAny1;
          else if (page === "2") return searchHeroAnyAny2;
          else if (page === "180") return searchHeroAnyAny180;
          else if (page === "181") return searchHeroAnyAny181;
        }
      } else if (name === "Spider-Man") {
        if (
          (type === undefined ||
            (type instanceof Object && Object.keys(type).length === 0)) &&
          year === undefined
        )
          if (page === undefined || page === "1") return searchSpiderManAnyAny1;
      }

      return searchNotYetAdded;
    },
  };
})();

export default apiOmdbMock;
