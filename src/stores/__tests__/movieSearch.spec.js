import { describe, it, expect, beforeEach, vi } from "vitest";

import { setActivePinia, createPinia } from "pinia";
import { useMovieSearchStore } from "@/stores/movieSearch";
import { useErrorMessageStore } from "@/stores/errorMessage";
import { SearchType } from "@/enum/omdbApiEnum";

import omdbApi from "@/api/external/omdbApi";
import searchGuardiansAnyAny1 from "@/__fixtures__/search/guardians/any_any_1.json";
import searchHeroAnyAny1 from "@/__fixtures__/search/Hero/any_any_1.json";
import {
  stubSearchByMovieName,
  stubSearchByMovieName_RejectInvalidApiKey,
  stubSearchByMovieName_RejectUnknownError,
} from "@/api/external/__stubs__/omdbApi.stub";
import InvalidArgumentError from "@/util/customError/invalidArgumentError";
import SetupCallMissingError from "@/util/customError/setupCallMissingError";

describe("Movie Search Store", () => {
  let movieSearchStore, errorMessageStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    movieSearchStore = useMovieSearchStore();
    errorMessageStore = useErrorMessageStore();
  });

  it("should be possible to find results for 'Guardians'", async () => {
    const apiKey = "GoodKey";
    const searchName = "Guardians";
    const searchType = undefined;
    const searchTypeInApi = {};
    const searchYear = undefined;

    const searchByMovieNameMock = vi
      .spyOn(omdbApi.prototype, "searchByMovieName")
      .mockImplementation(stubSearchByMovieName);

    expect(movieSearchStore.movie).toBe("");
    expect(movieSearchStore.type).toBe("");
    expect(movieSearchStore.year).toBe("");
    expect(Object.keys(movieSearchStore.search).length).toBe(0);
    expect(movieSearchStore.results).toBe(0);
    expect(movieSearchStore.page).toBe(0);

    movieSearchStore.apiInstance = new omdbApi(apiKey);
    await movieSearchStore.searchByMovieName(searchName);
    expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
    expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
      type: searchTypeInApi,
      year: searchYear,
    });

    expect(movieSearchStore.movie).toBe(searchName);
    expect(movieSearchStore.type).toBe(searchType);
    expect(movieSearchStore.year).toBe(searchYear);
    expect(Object.keys(movieSearchStore.search).length).toBe(10);
    expect(movieSearchStore.results).toBe(215);
    expect(movieSearchStore.page).toBe(1);
  });

  it("should not be possible to search for 'Guardians' if API key is bad", async () => {
    const apiKey = "BadKey";
    const searchName = "Guardians";
    const searchTypeInApi = {};
    const searchYear = undefined;

    const searchByMovieNameMock = vi
      .spyOn(omdbApi.prototype, "searchByMovieName")
      .mockImplementation(stubSearchByMovieName_RejectInvalidApiKey);

    expect(movieSearchStore.movie).toBe("");
    expect(movieSearchStore.type).toBe("");
    expect(movieSearchStore.year).toBe("");
    expect(Object.keys(movieSearchStore.search).length).toBe(0);
    expect(movieSearchStore.results).toBe(0);
    expect(movieSearchStore.page).toBe(0);

    movieSearchStore.apiInstance = new omdbApi(apiKey);
    expect(errorMessageStore.message.length).toBe(0);
    await movieSearchStore.searchByMovieName(searchName);
    expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
    expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
      type: searchTypeInApi,
      year: searchYear,
    });
    expect(errorMessageStore.message.length).toBe(1);
    expect(errorMessageStore.message[0][2]).toBe(
      "Searching failed because the used API key (" + apiKey + ") is invalid."
    );

    expect(movieSearchStore.movie).toBe("");
    expect(movieSearchStore.type).toBe("");
    expect(movieSearchStore.year).toBe("");
    expect(Object.keys(movieSearchStore.search).length).toBe(0);
    expect(movieSearchStore.results).toBe(0);
    expect(movieSearchStore.page).toBe(0);
  });

  it("should not be possible to search for 'Guardians' if the API returned an unknown error", async () => {
    const apiKey = "GoodKey";
    const searchName = "Guardians";
    const searchTypeInApi = {};
    const searchYear = undefined;

    const searchByMovieNameMock = vi
      .spyOn(omdbApi.prototype, "searchByMovieName")
      .mockImplementation(stubSearchByMovieName_RejectUnknownError);

    expect(movieSearchStore.movie).toBe("");
    expect(movieSearchStore.type).toBe("");
    expect(movieSearchStore.year).toBe("");
    expect(Object.keys(movieSearchStore.search).length).toBe(0);
    expect(movieSearchStore.results).toBe(0);
    expect(movieSearchStore.page).toBe(0);

    movieSearchStore.apiInstance = new omdbApi(apiKey);
    expect(errorMessageStore.message.length).toBe(0);
    await movieSearchStore.searchByMovieName(searchName);
    expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
    expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
      type: searchTypeInApi,
      year: searchYear,
    });
    expect(errorMessageStore.message.length).toBe(1);
    expect(errorMessageStore.message[0][2]).toMatch(
      /^Searching failed because of an unknown error:/
    );

    expect(movieSearchStore.movie).toBe("");
    expect(movieSearchStore.type).toBe("");
    expect(movieSearchStore.year).toBe("");
    expect(Object.keys(movieSearchStore.search).length).toBe(0);
    expect(movieSearchStore.results).toBe(0);
    expect(movieSearchStore.page).toBe(0);
  });

  it("should not be possible to go to next page for 'Guardians' search if API key is now bad", async () => {
    const apiKey = "KeyDidPerhapsExpire";
    const searchName = "Guardians";
    const searchType = undefined;
    const searchTypeInApi = {};
    const searchYear = undefined;

    const searchByMovieNameMock = vi
      .spyOn(omdbApi.prototype, "searchByMovieName")
      .mockImplementation(stubSearchByMovieName_RejectInvalidApiKey);

    movieSearchStore.movie = searchName;
    movieSearchStore.type = searchType;
    movieSearchStore.year = searchYear;
    movieSearchStore.search = searchGuardiansAnyAny1.Search;
    movieSearchStore.results = 215;
    movieSearchStore.page = 1;
    movieSearchStore.apiInstance = new omdbApi(apiKey);

    expect(errorMessageStore.message.length).toBe(0);
    await movieSearchStore.searchByMovieName(searchName);
    expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
    expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
      type: searchTypeInApi,
      year: searchYear,
    });
    expect(errorMessageStore.message.length).toBe(1);
    expect(errorMessageStore.message[0][2]).toBe(
      "Searching failed because the used API key (" + apiKey + ") is invalid."
    );

    expect(movieSearchStore.movie).toBe(searchName);
    expect(movieSearchStore.type).toBe(searchType);
    expect(movieSearchStore.year).toBe(searchYear);
    expect(Object.keys(movieSearchStore.search).length).toBe(10);
    expect(movieSearchStore.results).toBe(215);
    expect(movieSearchStore.page).toBe(1);
  });

  it("should not be possible to go to next page for 'Guardians' search if API returned an unknown error", async () => {
    const apiKey = "GoodKey";
    const searchName = "Guardians";
    const searchType = undefined;
    const searchTypeInApi = {};
    const searchYear = undefined;

    const searchByMovieNameMock = vi
      .spyOn(omdbApi.prototype, "searchByMovieName")
      .mockImplementation(stubSearchByMovieName_RejectUnknownError);

    movieSearchStore.movie = searchName;
    movieSearchStore.type = searchType;
    movieSearchStore.year = searchYear;
    movieSearchStore.search = searchGuardiansAnyAny1.Search;
    movieSearchStore.results = 215;
    movieSearchStore.page = 1;
    movieSearchStore.apiInstance = new omdbApi(apiKey);

    expect(errorMessageStore.message.length).toBe(0);
    await movieSearchStore.searchByMovieName(searchName);
    expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
    expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
      type: searchTypeInApi,
      year: searchYear,
    });
    expect(errorMessageStore.message.length).toBe(1);
    expect(errorMessageStore.message[0][2]).toMatch(
      /^Searching failed because of an unknown error:/
    );

    expect(movieSearchStore.movie).toBe(searchName);
    expect(movieSearchStore.type).toBe(searchType);
    expect(movieSearchStore.year).toBe(searchYear);
    expect(Object.keys(movieSearchStore.search).length).toBe(10);
    expect(movieSearchStore.results).toBe(215);
    expect(movieSearchStore.page).toBe(1);
  });

  describe("when api is instantiated with a good key", () => {
    let searchByMovieNameMock;

    beforeEach(() => {
      searchByMovieNameMock = vi
        .spyOn(omdbApi.prototype, "searchByMovieName")
        .mockImplementation(stubSearchByMovieName);

      movieSearchStore.apiInstance = new omdbApi("GoodKey");
    });

    it("should be possible to search for 'Guardians' if type is SearchType.MOVIE.name", async () => {
      const searchName = "Guardians";
      const searchType = SearchType.MOVIE.name;
      const searchTypeInApi = SearchType.MOVIE;
      const searchYear = undefined;

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      await movieSearchStore.searchByMovieName(searchName, {
        type: searchType,
      });
      expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
      expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
        type: searchTypeInApi,
        year: searchYear,
      });

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(165);
      expect(movieSearchStore.page).toBe(1);
    });

    it("should be possible to search for 'Guardians' if type is SearchType.SERIES.name", async () => {
      const searchName = "Guardians";
      const searchType = SearchType.SERIES.name;
      const searchTypeInApi = SearchType.SERIES;
      const searchYear = undefined;

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      await movieSearchStore.searchByMovieName(searchName, {
        type: searchType,
      });
      expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
      expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
        type: searchTypeInApi,
        year: searchYear,
      });

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(33);
      expect(movieSearchStore.page).toBe(1);
    });

    it("should be possible to search for 'Guardians' if year is 2015", async () => {
      const searchName = "Guardians";
      const searchType = undefined;
      const searchTypeInApi = {};
      const searchYear = "2015";

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      await movieSearchStore.searchByMovieName(searchName, {
        year: searchYear,
      });
      expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
      expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
        type: searchTypeInApi,
        year: searchYear,
      });

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(21);
      expect(movieSearchStore.page).toBe(1);
    });

    it("should be possible to search for 'Guardians' if type is SearchType.MOVIE.name and year is 2015", async () => {
      const searchName = "Guardians";
      const searchType = SearchType.MOVIE.name;
      const searchTypeInApi = SearchType.MOVIE;
      const searchYear = "2015";

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      await movieSearchStore.searchByMovieName(searchName, {
        type: searchType,
        year: searchYear,
      });
      expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
      expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
        type: searchTypeInApi,
        year: searchYear,
      });

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(12);
      expect(movieSearchStore.page).toBe(1);
    });

    it("should be possible to search for 'Guardians' if type is SearchType.SERIES.name and year is 2015", async () => {
      const searchName = "Guardians";
      const searchType = SearchType.SERIES.name;
      const searchTypeInApi = SearchType.SERIES;
      const searchYear = "2015";

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      await movieSearchStore.searchByMovieName(searchName, {
        type: searchType,
        year: searchYear,
      });
      expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
      expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
        type: searchTypeInApi,
        year: searchYear,
      });

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(3);
      expect(movieSearchStore.results).toBe(3);
      expect(movieSearchStore.page).toBe(1);
    });

    it("should be possible to go to page 2 for 'Hero'", async () => {
      const searchName = "Hero";
      const searchType = undefined;
      const searchTypeInApi = {};
      const searchYear = undefined;
      const curPage = 1;
      const newPage = 2;

      movieSearchStore.movie = searchName;
      movieSearchStore.type = searchType;
      movieSearchStore.year = searchYear;
      movieSearchStore.search = searchHeroAnyAny1.Search;
      movieSearchStore.results = 1804;
      movieSearchStore.page = curPage;

      await movieSearchStore.goToPage(newPage);
      expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
      expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
        type: searchTypeInApi,
        year: searchYear,
        page: String(newPage),
      });

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(1804);
      expect(movieSearchStore.page).toBe(newPage);
    });

    it("should be possible to go to previous page for 'Hero' if current page is 2", async () => {
      const searchName = "Hero";
      const searchType = undefined;
      const searchTypeInApi = {};
      const searchYear = undefined;
      const curPage = 2;

      movieSearchStore.movie = searchName;
      movieSearchStore.type = searchType;
      movieSearchStore.year = searchYear;
      movieSearchStore.search = searchHeroAnyAny1.Search;
      movieSearchStore.results = 1804;
      movieSearchStore.page = curPage;

      await movieSearchStore.previousPage();
      expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
      expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
        type: searchTypeInApi,
        year: searchYear,
        page: String(curPage - 1),
      });

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(1804);
      expect(movieSearchStore.page).toBe(curPage - 1);
    });

    it("should be possible to go to next page for 'Hero' if current page is 1", async () => {
      const searchName = "Hero";
      const searchType = undefined;
      const searchTypeInApi = {};
      const searchYear = undefined;
      const curPage = 1;

      movieSearchStore.movie = searchName;
      movieSearchStore.type = searchType;
      movieSearchStore.year = searchYear;
      movieSearchStore.search = searchHeroAnyAny1.Search;
      movieSearchStore.results = 1804;
      movieSearchStore.page = curPage;

      await movieSearchStore.nextPage();
      expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
      expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
        type: searchTypeInApi,
        year: searchYear,
        page: String(curPage + 1),
      });

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(1804);
      expect(movieSearchStore.page).toBe(curPage + 1);
    });

    it("should not be possible to search for movie by name if name is not a string", async () => {
      const searchName = 5;

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      try {
        await movieSearchStore.searchByMovieName(searchName);
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe("Movie name must be a string!");
      }

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);
    });

    it("should not be possible to search for movie by name if name is empty", async () => {
      const searchName = "";

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      try {
        await movieSearchStore.searchByMovieName(searchName);
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe(
          "Movie name must be set before searching!"
        );
      }

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);
    });

    it("should not be possible to search for 'Guardians' if type is not undefined or string", async () => {
      const searchName = "Guardians";
      const searchType = 4598;

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      try {
        await movieSearchStore.searchByMovieName(searchName, {
          type: searchType,
        });
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe("Movie type must be a string!");
      }

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);
    });

    it("should not be possible to search for 'Guardians' if type is not 'movie' or 'series'", async () => {
      const searchName = "Guardians";
      const searchType = "cookie";

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      try {
        await movieSearchStore.searchByMovieName(searchName, {
          type: searchType,
        });
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe(
          "Movie type must be any of: movie, series"
        );
      }

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);
    });

    it("should not be possible to search for 'Guardians' if year is not undefined or a string", async () => {
      const searchName = "Guardians";
      const searchYear = 1000;

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      try {
        await movieSearchStore.searchByMovieName(searchName, {
          year: searchYear,
        });
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe("Movie year must be a string!");
      }

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);
    });

    it("should not be possible to search for 'Guardians' if year is less than 0", async () => {
      const searchName = "Guardians";
      const searchYear = "-1";

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      try {
        await movieSearchStore.searchByMovieName(searchName, {
          year: searchYear,
        });
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe(
          "Movie year must be between 0 - 9999!"
        );
      }

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);
    });

    it("should not be possible to search for 'Guardians' if year is greater than 9999", async () => {
      const searchName = "Guardians";
      const searchYear = "10000";

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);

      try {
        await movieSearchStore.searchByMovieName(searchName, {
          year: searchYear,
        });
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe(
          "Movie year must be between 0 - 9999!"
        );
      }

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);
    });

    it("should not be possible to go to next page for 'Guardians' search if API key is now bad", async () => {
      const apiKey = "KeyDidPerhapsExpire";
      const searchName = "Guardians";
      const searchType = undefined;
      const searchTypeInApi = {};
      const searchYear = undefined;

      const searchByMovieNameMock = vi
        .spyOn(omdbApi.prototype, "searchByMovieName")
        .mockImplementation(stubSearchByMovieName_RejectInvalidApiKey);

      movieSearchStore.movie = searchName;
      movieSearchStore.type = searchType;
      movieSearchStore.year = searchYear;
      movieSearchStore.search = searchGuardiansAnyAny1.Search;
      movieSearchStore.results = 215;
      movieSearchStore.page = 1;
      movieSearchStore.apiInstance = new omdbApi(apiKey);

      expect(errorMessageStore.message.length).toBe(0);
      await movieSearchStore.searchByMovieName(searchName);
      expect(searchByMovieNameMock).toHaveBeenCalledTimes(1);
      expect(searchByMovieNameMock).toHaveBeenLastCalledWith(searchName, {
        type: searchTypeInApi,
        year: searchYear,
      });
      expect(errorMessageStore.message.length).toBe(1);
      expect(errorMessageStore.message[0][2]).toBe(
        "Searching failed because the used API key (" + apiKey + ") is invalid."
      );

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(215);
      expect(movieSearchStore.page).toBe(1);
    });

    it("should not be possible to go to page 2 for a movie if there has been no prior successful search", async () => {
      const newPage = 2;

      try {
        await movieSearchStore.goToPage(newPage);
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(SetupCallMissingError);
        expect(thrownError.message).toBe(
          "Method searchByMovieName() must first be called before goToPage() can be called!"
        );
      }

      expect(movieSearchStore.movie).toBe("");
      expect(movieSearchStore.type).toBe("");
      expect(movieSearchStore.year).toBe("");
      expect(Object.keys(movieSearchStore.search).length).toBe(0);
      expect(movieSearchStore.results).toBe(0);
      expect(movieSearchStore.page).toBe(0);
    });

    it("should not be possible to go to page 2 for 'Hero' if page is not a number", async () => {
      const searchName = "Hero";
      const searchType = undefined;
      const searchYear = undefined;
      const curPage = 1;
      const newPage = "next";

      movieSearchStore.movie = searchName;
      movieSearchStore.type = searchType;
      movieSearchStore.year = searchYear;
      movieSearchStore.search = searchHeroAnyAny1.Search;
      movieSearchStore.results = 1804;
      movieSearchStore.page = curPage;

      try {
        await movieSearchStore.goToPage(newPage);
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe("Argument 'page' must be a number!");
      }

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(1804);
      expect(movieSearchStore.page).toBe(curPage);
    });

    it("should not be possible to go to page 2 for 'Hero' if page is the same as the current page", async () => {
      const searchName = "Hero";
      const searchType = undefined;
      const searchYear = undefined;
      const curPage = 1;
      const newPage = 1;

      movieSearchStore.movie = searchName;
      movieSearchStore.type = searchType;
      movieSearchStore.year = searchYear;
      movieSearchStore.search = searchHeroAnyAny1.Search;
      movieSearchStore.results = 1804;
      movieSearchStore.page = curPage;

      try {
        await movieSearchStore.goToPage(newPage);
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe(
          "Argument 'page' must be a different page than what is currently set!"
        );
      }

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(1804);
      expect(movieSearchStore.page).toBe(curPage);
    });

    it("should not be possible to go to page 2 for 'Hero' if page is less than 1", async () => {
      const searchName = "Hero";
      const searchType = undefined;
      const searchYear = undefined;
      const curPage = 1;
      const newPage = 0;

      movieSearchStore.movie = searchName;
      movieSearchStore.type = searchType;
      movieSearchStore.year = searchYear;
      movieSearchStore.search = searchHeroAnyAny1.Search;
      movieSearchStore.results = 1804;
      movieSearchStore.page = curPage;

      try {
        await movieSearchStore.goToPage(newPage);
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe(
          "Argument 'page' cannot be less than one!"
        );
      }

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(1804);
      expect(movieSearchStore.page).toBe(curPage);
    });

    it("should not be possible to go to page 2 for 'Hero' if page is greater than the total number of pages", async () => {
      const searchName = "Hero";
      const searchType = undefined;
      const searchYear = undefined;
      const curPage = 1;
      const newPage = 1000;

      movieSearchStore.movie = searchName;
      movieSearchStore.type = searchType;
      movieSearchStore.year = searchYear;
      movieSearchStore.search = searchHeroAnyAny1.Search;
      movieSearchStore.results = 1804;
      movieSearchStore.page = curPage;

      try {
        await movieSearchStore.goToPage(newPage);
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(InvalidArgumentError);
        expect(thrownError.message).toBe(
          "Argument 'page' is out of bounds, it must be less than or equal to: 181"
        );
      }

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(1804);
      expect(movieSearchStore.page).toBe(curPage);
    });

    it("should not be possible to go to previous page for 'Hero' if current page is 1", async () => {
      const searchName = "Hero";
      const searchType = undefined;
      const searchYear = undefined;
      const curPage = 1;

      movieSearchStore.movie = searchName;
      movieSearchStore.type = searchType;
      movieSearchStore.year = searchYear;
      movieSearchStore.search = searchHeroAnyAny1.Search;
      movieSearchStore.results = 1804;
      movieSearchStore.page = curPage;

      try {
        await movieSearchStore.previousPage();
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toBe(
          "Current page is currently 1, there is no previous page."
        );
      }

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(1804);
      expect(movieSearchStore.page).toBe(curPage);
    });

    it("should not be possible to go to next page for 'Hero' if current page is last page", async () => {
      const searchName = "Hero";
      const searchType = undefined;
      const searchYear = undefined;
      const curPage = 181;

      movieSearchStore.movie = searchName;
      movieSearchStore.type = searchType;
      movieSearchStore.year = searchYear;
      movieSearchStore.search = searchHeroAnyAny1.Search;
      movieSearchStore.results = 1804;
      movieSearchStore.page = curPage;

      try {
        await movieSearchStore.nextPage();
        expect("Is here").toBe("Should not be here");
      } catch (thrownError) {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toBe(
          "Current page is currently 181, and the final page is 181. There is no next page."
        );
      }

      expect(movieSearchStore.movie).toBe(searchName);
      expect(movieSearchStore.type).toBe(searchType);
      expect(movieSearchStore.year).toBe(searchYear);
      expect(Object.keys(movieSearchStore.search).length).toBe(10);
      expect(movieSearchStore.results).toBe(1804);
      expect(movieSearchStore.page).toBe(curPage);
    });
  });
});
