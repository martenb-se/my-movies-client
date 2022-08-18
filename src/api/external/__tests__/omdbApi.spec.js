import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { setupServer } from "msw/node";
import omdbApi from "@/api/external/omdbApi";
import { omdbApiMsw } from "@/__msw__/omdbApi.handlers";
import { SearchType } from "@/enum/omdbApiEnum";
import omdbApiData from "@/__fixtures__/api/omdbApi.json";
import InvalidArgumentError from "@/util/customError/invalidArgumentError";

describe("OMDB Api", () => {
  let server;
  let omdbApiInst;

  it("should be possible to instantiate omdbApi with a good API key and no other settings", async () => {
    expect(() => new omdbApi("00000000")).not.toThrowError();
  });

  it("should be possible to instantiate omdbApi with a good API key and a custom API url", async () => {
    expect(
      () => new omdbApi("00000000", { apiUrl: "http://example.com" })
    ).not.toThrowError();
  });

  it("should not be possible to instantiate omdbApi when apiKey is not a string", async () => {
    expect(() => new omdbApi(123)).toThrowError("API key must be a string.");
  });

  it("should not be possible to instantiate omdbApi when apiUrl is not a string", async () => {
    expect(() => new omdbApi("00000000", { apiUrl: 123 })).toThrowError(
      "Optional argument 'apiUrl' must be a string."
    );
  });

  describe("when omdbApi is instantiated", () => {
    beforeEach(() => {
      omdbApiInst = new omdbApi("00000000");
      omdbApiMsw.setBaseUrl(omdbApiInst.apiUrl);
      server = setupServer(...omdbApiMsw.handlers());
      server.listen({ onUnhandledRequest: "error" });
    });

    afterEach(() => {
      server.close();
      omdbApiMsw.clear();
      server.resetHandlers();
    });

    it("should be possible to search for 'Guardians'", async () => {
      let searchResults;
      try {
        searchResults = await omdbApiInst.searchByMovieName("Guardians");
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(searchResults).toEqual(
        omdbApiData.get["?apikey=00000000&s=Guardians"].content
      );
    });

    it("should be possible to search for 'Guardians' and get page 1", async () => {
      let searchResults;
      try {
        searchResults = await omdbApiInst.searchByMovieName("Guardians", {
          page: "1",
        });
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(searchResults).toEqual(
        omdbApiData.get["?apikey=00000000&s=Guardians&page=1"].content
      );
    });

    it("should be possible to search for 'Guardians' and get page 2", async () => {
      let searchResults;
      try {
        searchResults = await omdbApiInst.searchByMovieName("Guardians", {
          page: "2",
        });
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(searchResults).toEqual(
        omdbApiData.get["?apikey=00000000&s=Guardians&page=2"].content
      );
    });

    it("should be possible to search for 'Guardians' and get type 'SearchType.MOVIE'", async () => {
      let searchResults;
      try {
        searchResults = await omdbApiInst.searchByMovieName("Guardians", {
          type: SearchType.MOVIE,
        });
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(searchResults).toEqual(
        omdbApiData.get["?apikey=00000000&s=Guardians&type=movie"].content
      );
    });

    it("should be possible to search for 'Guardians' and get type 'SearchType.SERIES'", async () => {
      let searchResults;
      try {
        searchResults = await omdbApiInst.searchByMovieName("Guardians", {
          type: SearchType.SERIES,
        });
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(searchResults).toEqual(
        omdbApiData.get["?apikey=00000000&s=Guardians&type=series"].content
      );
    });

    it("should be possible to search for 'Guardians' get type 'SearchType.MOVIE', year 2015", async () => {
      let searchResults;
      try {
        searchResults = await omdbApiInst.searchByMovieName("Guardians", {
          type: SearchType.MOVIE,
          year: "2015",
        });
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(searchResults).toEqual(
        omdbApiData.get["?apikey=00000000&s=Guardians&type=movie&y=2015"]
          .content
      );
    });

    it("should be possible to search for 'Guardians' get type 'SearchType.SERIES', year 2015", async () => {
      let searchResults;
      try {
        searchResults = await omdbApiInst.searchByMovieName("Guardians", {
          type: SearchType.SERIES,
          year: "2015",
        });
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(searchResults).toEqual(
        omdbApiData.get["?apikey=00000000&s=Guardians&type=series&y=2015"]
          .content
      );
    });

    it("should not be possible to search when name is not a string", async () => {
      try {
        await omdbApiInst.searchByMovieName(123);
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toBeInstanceOf(InvalidArgumentError);
        expect(wantedError.message).toBe("Name must be a string");
      }
    });

    it("should not be possible to search when name is empty", async () => {
      try {
        await omdbApiInst.searchByMovieName("");
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toBeInstanceOf(InvalidArgumentError);
        expect(wantedError.message).toBe("Name cannot be empty");
      }
    });

    it("should not be possible to search for 'Guardians' when type is not an object or undefined", async () => {
      try {
        await omdbApiInst.searchByMovieName("Guardians", {
          type: "movie",
        });
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toBeInstanceOf(InvalidArgumentError);
        expect(wantedError.message).toBe(
          "Optional argument 'type' must be an object."
        );
      }
    });

    it("should not be possible to search for 'Guardians' when year is not a string", async () => {
      try {
        await omdbApiInst.searchByMovieName("Guardians", {
          year: 2015,
        });
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toBeInstanceOf(InvalidArgumentError);
        expect(wantedError.message).toBe(
          "Optional argument 'year' must be a string."
        );
      }
    });

    it("should not be possible to search for 'Guardians' when page is not a string", async () => {
      try {
        await omdbApiInst.searchByMovieName("Guardians", {
          page: 2,
        });
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toBeInstanceOf(InvalidArgumentError);
        expect(wantedError.message).toBe(
          "Optional argument 'page' must be a string."
        );
      }
    });
  });

  describe("when omdbApi is instantiated with bas API key", () => {
    beforeEach(() => {
      omdbApiInst = new omdbApi("00000000");
      omdbApiMsw.setBaseUrl(omdbApiInst.apiUrl);
      server = setupServer(...omdbApiMsw.handlersWithErrorCode(401));
      server.listen({ onUnhandledRequest: "error" });
    });

    afterEach(() => {
      server.close();
      omdbApiMsw.clear();
      server.resetHandlers();
    });

    it("should not be possible to search for 'Guardians' if API key is bad", async () => {
      try {
        await omdbApiInst.searchByMovieName("Guardians");
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          omdbApiData.error.get["?apikey=00000000&s=Guardians"]["401"]
        );
      }
    });
  });
});
