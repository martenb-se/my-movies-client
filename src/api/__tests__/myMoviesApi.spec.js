import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { setupServer } from "msw/node";
import { myMoviesApiMsw } from "@/__msw__/myMoviesApi.handlers";
import myMoviesApi from "@/api/myMoviesApi";
import myMoviesApiData from "@/__fixtures__/api/myMoviesApi.json";

describe("My Movies Api", () => {
  let server;
  let myMoviesApiInst;

  it("should be possible to instantiate myMoviesApi without any settings", async () => {
    expect(() => new myMoviesApi()).not.toThrowError();
  });

  it("should be possible to instantiate myMoviesApi with a custom API url", async () => {
    expect(
      () => new myMoviesApi({ apiUrl: "http://example.com" })
    ).not.toThrowError();
  });

  it("should not be possible to instantiate myMoviesApi when apiUrl is not a string", async () => {
    expect(() => new myMoviesApi({ apiUrl: 123 })).toThrowError(
      "Optional argument 'apiUrl' must be a string."
    );
  });

  describe("when myMoviesApi is instantiated", () => {
    beforeEach(() => {
      myMoviesApiInst = new myMoviesApi();
      myMoviesApiMsw.setBaseUrl(myMoviesApiInst.apiUrl);
      server = setupServer(...myMoviesApiMsw.handlers());
      server.listen({ onUnhandledRequest: "error" });
    });

    afterEach(() => {
      server.close();
      myMoviesApiMsw.clear();
      server.resetHandlers();
    });

    it("should be possible to get all movies", async () => {
      let allMovies;
      try {
        allMovies = await myMoviesApiInst.getAllMovies();
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(allMovies).toEqual(myMoviesApiData.get["/"].content);
    });

    it("should be possible to set rating for a movie", async () => {
      let allMovies;
      try {
        allMovies = await myMoviesApiInst.setRating("tt2015381", 5);
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(allMovies).toBe("Movie rating was updated successfully");
    });

    it("should be possible to set seen status as seen for a movie", async () => {
      let allMovies;
      try {
        allMovies = await myMoviesApiInst.setSeen("tt4154796", 5);
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(allMovies).toBe(
        "Movie seen status and rating updated successfully"
      );
    });

    it("should be possible to set seen status as unseen for a movie", async () => {
      let allMovies;
      try {
        allMovies = await myMoviesApiInst.setUnseen("tt2015381");
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(allMovies).toBe(
        "Movie seen status and rating removed successfully"
      );
    });

    it("should be possible to add a new movie to the database", async () => {
      let allMovies;
      try {
        allMovies = await myMoviesApiInst.addMovie("tt1234567", "Test Movie");
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(allMovies).toBe("Movie is saved successfully");
    });

    it("should be possible to get a movie from the database", async () => {
      let allMovies;
      try {
        allMovies = await myMoviesApiInst.getMovie("tt2015381");
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(allMovies).toEqual(myMoviesApiData.get["/tt2015381"].content);
    });

    it("should be possible to delete a movie from the database", async () => {
      let allMovies;
      try {
        allMovies = await myMoviesApiInst.deleteMovie("tt2015381");
      } catch (unwantedError) {
        expect(unwantedError).toBe(undefined); // Should always fail
      }
      expect(allMovies).toBe("Movie is deleted successfully");
    });
  });

  describe("when myMoviesApi is instantiated and server always returns with error code 500", () => {
    beforeEach(() => {
      myMoviesApiInst = new myMoviesApi();
      myMoviesApiMsw.setBaseUrl(myMoviesApiInst.apiUrl);
      server = setupServer(...myMoviesApiMsw.handlersWithErrorCode(500));
      server.listen({ onUnhandledRequest: "error" });
    });

    afterEach(() => {
      server.close();
      myMoviesApiMsw.clear();
      server.resetHandlers();
    });

    it("should not be possible to get all movies when an error occurred on the server", async () => {
      try {
        await myMoviesApiInst.getAllMovies();
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(myMoviesApiData.error.get["/"]["500"]);
      }
    });

    it("should not be possible to set rating when an error occurred on the server", async () => {
      try {
        await myMoviesApiInst.setRating("tt2015381", 5);
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          myMoviesApiData.error.put["/tt2015381/rating"]["500"]
        );
      }
    });

    it("should not be possible to set seen status as seen for a movie when an error occurred on the server", async () => {
      try {
        await myMoviesApiInst.setSeen("tt4154796", 5);
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          myMoviesApiData.error.put["/tt4154796/seen"]["500"]
        );
      }
    });

    it("should not be possible to set seen status as unseen for a movie when an error occurred on the server", async () => {
      try {
        await myMoviesApiInst.setUnseen("tt2015381");
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          myMoviesApiData.error.put["/tt2015381/unseen"]["500"]
        );
      }
    });

    it("should not be possible to add a new movie to the database when an error occurred on the server", async () => {
      try {
        await myMoviesApiInst.addMovie("tt1234567", "Test Movie");
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(myMoviesApiData.error.post["/"]["500"]);
      }
    });

    it("should not be possible to get a movie from the database when an error occurred on the server", async () => {
      try {
        await myMoviesApiInst.getMovie("tt2015381");
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          myMoviesApiData.error.get["/tt2015381"]["500"]
        );
      }
    });

    it("should not be possible to delete a movie from the database when an error occurred on the server", async () => {
      try {
        await myMoviesApiInst.deleteMovie("tt2015381");
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          myMoviesApiData.error.delete["/tt2015381"]["500"]
        );
      }
    });
  });

  describe("when myMoviesApi is instantiated and server always says the movie doesn't exist", () => {
    beforeEach(() => {
      myMoviesApiInst = new myMoviesApi();
      myMoviesApiMsw.setBaseUrl(myMoviesApiInst.apiUrl);
      server = setupServer(...myMoviesApiMsw.handlersWithErrorCode(404));
      server.listen({ onUnhandledRequest: "error" });
    });

    afterEach(() => {
      server.close();
      myMoviesApiMsw.clear();
      server.resetHandlers();
    });

    it("should not be possible to set rating when server says the movie does not exist", async () => {
      try {
        await myMoviesApiInst.setRating("tt2015381", 5);
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          myMoviesApiData.error.put["/tt2015381/rating"]["404"]
        );
      }
    });

    it("should not be possible to set seen status as seen for a movie when server says the movie does not exist", async () => {
      try {
        await myMoviesApiInst.setSeen("tt4154796", 5);
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          myMoviesApiData.error.put["/tt4154796/seen"]["404"]
        );
      }
    });

    it("should not be possible to set seen status as unseen for a movie when server says the movie does not exist", async () => {
      try {
        await myMoviesApiInst.setUnseen("tt2015381");
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          myMoviesApiData.error.put["/tt2015381/unseen"]["404"]
        );
      }
    });

    it("should not be possible to get a movie from the database when server says the movie does not exist", async () => {
      try {
        await myMoviesApiInst.getMovie("tt2015381");
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          myMoviesApiData.error.get["/tt2015381"]["404"]
        );
      }
    });

    it("should not be possible to delete a movie from the database when server says the movie does not exist", async () => {
      try {
        await myMoviesApiInst.deleteMovie("tt2015381");
        expect("Should not be here").toBe(undefined); // Should always fail
      } catch (wantedError) {
        expect(wantedError).toEqual(
          myMoviesApiData.error.delete["/tt2015381"]["404"]
        );
      }
    });
  });

  it("should not be possible to add a new movie to the database when server says the movie already exists", async () => {
    myMoviesApiInst = new myMoviesApi();
    myMoviesApiMsw.setBaseUrl(myMoviesApiInst.apiUrl);
    server = setupServer(...myMoviesApiMsw.handlersWithErrorCode(409));
    server.listen({ onUnhandledRequest: "error" });

    try {
      await myMoviesApiInst.addMovie("tt1234567", "Test Movie");
      expect("Should not be here").toBe(undefined); // Should always fail
    } catch (wantedError) {
      expect(wantedError).toEqual(myMoviesApiData.error.post["/"]["409"]);
    }

    server.close();
    myMoviesApiMsw.clear();
    server.resetHandlers();
  });
});
