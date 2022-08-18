import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { setActivePinia, createPinia } from "pinia";
import { useMyMoviesStore } from "@/stores/myMovies";
import { useErrorMessageStore } from "@/stores/errorMessage";

import myMoviesApi from "@/api/myMoviesApi";
import {
  stubAddMovie,
  stubDeleteMovie,
  stubGetAllMovies,
  stubGetMovie,
  resetTableMoviesMock,
  stubSetRating,
  stubSetSeen,
  stubSetUnseen,
  stubAddMovie_RejectAlreadyExists,
  stubDeleteMovie_RejectNotFound,
  stubSetSeen_RejectNotFound,
  stubSetRating_RejectNotFound,
  stubSetUnseen_RejectNotFound,
} from "@/api/__stubs__/myMoviesApi.stub";
import InvalidArgumentError from "@/util/customError/invalidArgumentError";

describe("My Movies Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should fetch all movies via api instance", async () => {
    const getAllMoviesMock = vi
      .spyOn(myMoviesApi.prototype, "getAllMovies")
      .mockImplementation(stubGetAllMovies);

    const myMoviesStore = useMyMoviesStore();
    expect(Object.keys(myMoviesStore.movies).length).toBe(0);
    myMoviesStore.apiInstance = new myMoviesApi();
    await myMoviesStore.fetchAllMovies();
    expect(getAllMoviesMock).toHaveBeenCalledTimes(1);
    expect(Object.keys(myMoviesStore.movies).length).toBe(4);
  });

  describe("when store is initialized with movies: 'Guardians of the Galaxy', 'Thor', 'Zootopia' and 'Avengers: Infinity War'", () => {
    let myMoviesStore,
      errorMessageStore,
      addMovieMock,
      getMovieMock,
      deleteMovieMock,
      setSeenMock,
      setRatingMock,
      setUnseenMock;
    const mockDbImdbId = {
      GuardiansOfTheGalaxy: "tt2015381",
      Thor: "tt0800369",
      Zootopia: "tt2948356",
      AvengersInfinityWar: "tt4154756",
    };

    beforeEach(async () => {
      vi.spyOn(myMoviesApi.prototype, "getAllMovies").mockImplementation(
        stubGetAllMovies
      );
      myMoviesStore = useMyMoviesStore();
      errorMessageStore = useErrorMessageStore();
      myMoviesStore.apiInstance = new myMoviesApi();
      await myMoviesStore.fetchAllMovies();
    });

    afterEach(() => {
      resetTableMoviesMock();
    });

    describe("when all local api calls succeed", () => {
      beforeEach(async () => {
        addMovieMock = vi
          .spyOn(myMoviesApi.prototype, "addMovie")
          .mockImplementation(stubAddMovie);
        getMovieMock = vi
          .spyOn(myMoviesApi.prototype, "getMovie")
          .mockImplementation(stubGetMovie);
        deleteMovieMock = vi
          .spyOn(myMoviesApi.prototype, "deleteMovie")
          .mockImplementation(stubDeleteMovie);
        setSeenMock = vi
          .spyOn(myMoviesApi.prototype, "setSeen")
          .mockImplementation(stubSetSeen);
        setRatingMock = vi
          .spyOn(myMoviesApi.prototype, "setRating")
          .mockImplementation(stubSetRating);
        setUnseenMock = vi
          .spyOn(myMoviesApi.prototype, "setUnseen")
          .mockImplementation(stubSetUnseen);
      });

      it("should be possible to add 'Spider-Man: No Way Home'", async () => {
        const imdbId = "tt10872600";
        const name = "Spider-Man: No Way Home";

        expect(Object.keys(myMoviesStore.movies).length).toBe(4);

        await myMoviesStore.addMovie(imdbId, name);
        expect(addMovieMock).toHaveBeenCalledTimes(1);
        expect(addMovieMock).toHaveBeenLastCalledWith(imdbId, name);
        expect(getMovieMock).toHaveBeenCalledTimes(1);
        expect(getMovieMock).toHaveBeenLastCalledWith(imdbId);
        expect(Object.keys(myMoviesStore.movies).length).toBe(5);
        expect(myMoviesStore.movies[imdbId].name === name);
      });

      it("should not be possible to add a movie where imdb id is not a string", async () => {
        const imdbId = 1;
        const name = "Spider-Man: No Way Home";

        expect(Object.keys(myMoviesStore.movies).length).toBe(4);

        try {
          await myMoviesStore.addMovie(imdbId, name);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'imdbId' must be a string!"
          );
          expect(Object.keys(myMoviesStore.movies).length).toBe(4);
        }
      });

      it("should not be possible to add a movie where imdb id is empty", async () => {
        const imdbId = "";
        const name = "Spider-Man: No Way Home";

        expect(Object.keys(myMoviesStore.movies).length).toBe(4);

        try {
          await myMoviesStore.addMovie(imdbId, name);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe("Argument 'imdbId' is too short!");
          expect(Object.keys(myMoviesStore.movies).length).toBe(4);
        }
      });

      it("should not be possible to add a movie where the name is not a string", async () => {
        const imdbId = "tt10872600";
        const name = false;

        expect(Object.keys(myMoviesStore.movies).length).toBe(4);

        try {
          await myMoviesStore.addMovie(imdbId, name);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe("Argument 'name' must be a string!");
          expect(Object.keys(myMoviesStore.movies).length).toBe(4);
        }
      });

      it("should not be possible to add a movie where the name is empty", async () => {
        const imdbId = "tt10872600";
        const name = "";

        expect(Object.keys(myMoviesStore.movies).length).toBe(4);

        try {
          await myMoviesStore.addMovie(imdbId, name);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe("Argument 'name' is too short!");
          expect(Object.keys(myMoviesStore.movies).length).toBe(4);
        }
      });

      it("should be possible to remove 'Thor'", async () => {
        expect(Object.keys(myMoviesStore.movies).length).toBe(4);

        await myMoviesStore.deleteMovie(mockDbImdbId.Thor);
        expect(deleteMovieMock).toHaveBeenCalledTimes(1);
        expect(deleteMovieMock).toHaveBeenLastCalledWith(mockDbImdbId.Thor);
        expect(Object.keys(myMoviesStore.movies).length).toBe(3);
        expect(
          Object.prototype.hasOwnProperty.call(
            myMoviesStore.movies,
            mockDbImdbId.Thor
          )
        ).toBeFalsy();
      });

      it("should not be possible to remove a movie where imdb id is not a string", async () => {
        const imdbId = 1;

        expect(Object.keys(myMoviesStore.movies).length).toBe(4);

        try {
          await myMoviesStore.deleteMovie(imdbId);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'imdbId' must be a string!"
          );
          expect(Object.keys(myMoviesStore.movies).length).toBe(4);
        }
      });

      it("should not be possible to remove a movie where imdb id is empty", async () => {
        const imdbId = "";

        expect(Object.keys(myMoviesStore.movies).length).toBe(4);

        try {
          await myMoviesStore.deleteMovie(imdbId, name);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe("Argument 'imdbId' is too short!");
          expect(Object.keys(myMoviesStore.movies).length).toBe(4);
        }
      });

      it("should be possible to set 'Zootopia' as having been seen", async () => {
        const newRating = 10;

        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].seen).toBeFalsy();
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].rating).toBe(0);

        await myMoviesStore.setMovieRating(
          mockDbImdbId.Zootopia,
          newRating,
          false
        );
        expect(setSeenMock).toHaveBeenCalledTimes(1);
        expect(setSeenMock).toHaveBeenLastCalledWith(
          mockDbImdbId.Zootopia,
          newRating
        );
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].seen).toBeTruthy();
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].rating).toBe(
          newRating
        );
      });

      it("should not be possible to set movie as seen where imdb id is not a string", async () => {
        const imdbId = 1;
        const newRating = 10;
        const previouslySeen = false;

        try {
          await myMoviesStore.setMovieRating(imdbId, newRating, previouslySeen);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'imdbId' must be a string!"
          );
        }
      });

      it("should not be possible to set movie as seen where imdb id is empty", async () => {
        const imdbId = "";
        const newRating = 10;
        const previouslySeen = false;

        try {
          await myMoviesStore.setMovieRating(imdbId, newRating, previouslySeen);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe("Argument 'imdbId' is too short!");
        }
      });

      it("should not be possible to set 'Zootopia' as seen where rating is not a number", async () => {
        const newRating = false;
        const previouslySeen = false;

        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].seen).toBeFalsy();
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].rating).toBe(0);
        try {
          await myMoviesStore.setMovieRating(
            mockDbImdbId.Zootopia,
            newRating,
            previouslySeen
          );
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'rating' must be a number!"
          );
        }
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].seen).toBeFalsy();
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].rating).toBe(0);
      });

      it("should not be possible to set 'Zootopia' as seen where rating is less than 1", async () => {
        const newRating = 0;
        const previouslySeen = false;

        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].seen).toBeFalsy();
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].rating).toBe(0);
        try {
          await myMoviesStore.setMovieRating(
            mockDbImdbId.Zootopia,
            newRating,
            previouslySeen
          );
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'rating' must be between 1 and 10!"
          );
        }
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].seen).toBeFalsy();
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].rating).toBe(0);
      });

      it("should not be possible to set 'Zootopia' as seen where rating is more than 10", async () => {
        const newRating = 11;
        const previouslySeen = false;

        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].seen).toBeFalsy();
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].rating).toBe(0);
        try {
          await myMoviesStore.setMovieRating(
            mockDbImdbId.Zootopia,
            newRating,
            previouslySeen
          );
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'rating' must be between 1 and 10!"
          );
        }
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].seen).toBeFalsy();
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].rating).toBe(0);
      });

      it("should not be possible to set 'Zootopia' as seen where seen is not a boolean", async () => {
        const seen = "seen";

        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].seen).toBeFalsy();
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].rating).toBe(0);
        try {
          await myMoviesStore.setMovieRating(mockDbImdbId.Zootopia, 10, seen);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'seen' must be a boolean!"
          );
        }
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].seen).toBeFalsy();
        expect(myMoviesStore.movies[mockDbImdbId.Zootopia].rating).toBe(0);
      });

      it("should be possible to change rating of 'Thor'", async () => {
        const prevRating = 5;
        const newRating = 7;

        expect(myMoviesStore.movies[mockDbImdbId.Thor].rating).toBe(prevRating);

        await myMoviesStore.setMovieRating(mockDbImdbId.Thor, newRating);
        expect(setRatingMock).toHaveBeenCalledTimes(1);
        expect(setRatingMock).toHaveBeenLastCalledWith(
          mockDbImdbId.Thor,
          newRating
        );
        expect(myMoviesStore.movies[mockDbImdbId.Thor].rating).toBe(newRating);
      });

      it("should not be possible to change rating of movie where imdb id is not a string", async () => {
        const imdbId = 1;
        const newRating = 10;

        try {
          await myMoviesStore.setMovieRating(imdbId, newRating);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'imdbId' must be a string!"
          );
        }
      });

      it("should not be possible to change rating of movie where imdb id is empty", async () => {
        const imdbId = "";
        const newRating = 10;

        try {
          await myMoviesStore.setMovieRating(imdbId, newRating);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe("Argument 'imdbId' is too short!");
        }
      });

      it("should not be possible to change rating of 'Thor' where rating is not a number", async () => {
        const prevRating = 5;
        const newRating = false;

        expect(myMoviesStore.movies[mockDbImdbId.Thor].rating).toBe(prevRating);
        try {
          await myMoviesStore.setMovieRating(mockDbImdbId.Thor, newRating);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'rating' must be a number!"
          );
        }
        expect(myMoviesStore.movies[mockDbImdbId.Thor].rating).toBe(prevRating);
      });

      it("should not be possible to change rating of 'Thor' where rating is less than 1", async () => {
        const prevRating = 5;
        const newRating = 0;

        expect(myMoviesStore.movies[mockDbImdbId.Thor].rating).toBe(prevRating);
        try {
          await myMoviesStore.setMovieRating(mockDbImdbId.Thor, newRating);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'rating' must be between 1 and 10!"
          );
        }
        expect(myMoviesStore.movies[mockDbImdbId.Thor].rating).toBe(prevRating);
      });

      it("should not be possible to change rating of 'Thor' where rating is more than 10", async () => {
        const prevRating = 5;
        const newRating = 11;

        expect(myMoviesStore.movies[mockDbImdbId.Thor].rating).toBe(prevRating);
        try {
          await myMoviesStore.setMovieRating(mockDbImdbId.Thor, newRating);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'rating' must be between 1 and 10!"
          );
        }
        expect(myMoviesStore.movies[mockDbImdbId.Thor].rating).toBe(prevRating);
      });

      it("should be possible to set 'Thor' as having no longer been seen", async () => {
        const prevRating = 5;

        expect(myMoviesStore.movies[mockDbImdbId.Thor].seen).toBeTruthy();
        expect(myMoviesStore.movies[mockDbImdbId.Thor].rating).toBe(prevRating);

        await myMoviesStore.setMovieUnseen(mockDbImdbId.Thor);
        expect(setUnseenMock).toHaveBeenCalledTimes(1);
        expect(setUnseenMock).toHaveBeenLastCalledWith(mockDbImdbId.Thor);
        expect(myMoviesStore.movies[mockDbImdbId.Thor].seen).toBeFalsy();
        expect(myMoviesStore.movies[mockDbImdbId.Thor].rating).toBe(0);
      });

      it("should not be possible to set movie as having no longer been seen when imdb id is not a string", async () => {
        const imdbId = 1;

        try {
          await myMoviesStore.setMovieUnseen(imdbId);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe(
            "Argument 'imdbId' must be a string!"
          );
        }
      });

      it("should not be possible to set movie as having no longer been seen when imdb id is empty", async () => {
        const imdbId = "";

        try {
          await myMoviesStore.setMovieUnseen(imdbId);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(InvalidArgumentError);
          expect(thrownError.message).toBe("Argument 'imdbId' is too short!");
        }
      });
    });

    describe("when each test decide what api calls succeed or not", () => {
      it("should not be possible to add a movie when it already exists", async () => {
        const imdbId = "tt2015381";
        const name = "Guardians of the Galaxy";

        addMovieMock = vi
          .spyOn(myMoviesApi.prototype, "addMovie")
          .mockImplementation(stubAddMovie_RejectAlreadyExists);

        expect(Object.keys(myMoviesStore.movies).length).toBe(4);
        try {
          await myMoviesStore.addMovie(imdbId, name);
          expect("Is here").toBe("Should not be here");
        } catch (thrownError) {
          expect(thrownError).toBeInstanceOf(Error);
          expect(thrownError.message).toBe("Movie already exists");
          expect(addMovieMock).toHaveBeenCalledTimes(1);
          expect(addMovieMock).toHaveBeenLastCalledWith(imdbId, name);
          expect(getMovieMock).not.toHaveBeenCalled();
          expect(Object.keys(myMoviesStore.movies).length).toBe(4);
        }
      });

      it("should not be possible to remove a movie when it does not exist", async () => {
        const imdbId = "tt9999999";

        deleteMovieMock = vi
          .spyOn(myMoviesApi.prototype, "deleteMovie")
          .mockImplementation(stubDeleteMovie_RejectNotFound);

        expect(Object.keys(myMoviesStore.movies).length).toBe(4);
        expect(errorMessageStore.message.length).toBe(0);
        await myMoviesStore.deleteMovie(imdbId, name);
        expect(deleteMovieMock).toHaveBeenCalledTimes(1);
        expect(deleteMovieMock).toHaveBeenLastCalledWith(imdbId);
        expect(Object.keys(myMoviesStore.movies).length).toBe(4);
        expect(errorMessageStore.message.length).toBe(1);
        expect(errorMessageStore.message[0][2]).toBe(
          "Deleting movie seen failed because of the following error: Movie not found"
        );
      });

      it("should not be possible to set a movie as seen when it does not exist", async () => {
        const imdbId = "tt9999999";
        const newRating = 7;
        const previouslySeen = false;

        setSeenMock = vi
          .spyOn(myMoviesApi.prototype, "setSeen")
          .mockImplementation(stubSetSeen_RejectNotFound);

        expect(errorMessageStore.message.length).toBe(0);
        await myMoviesStore.setMovieRating(imdbId, newRating, previouslySeen);
        expect(setSeenMock).toHaveBeenCalledTimes(1);
        expect(setSeenMock).toHaveBeenLastCalledWith(imdbId, newRating);
        expect(errorMessageStore.message.length).toBe(1);
        expect(errorMessageStore.message[0][2]).toBe(
          "Updating movie rating failed because of the following error: Movie not found"
        );
      });

      it("should not be possible to change rating of a movie when it does not exist", async () => {
        const imdbId = "tt9999999";
        const newRating = 7;

        setRatingMock = vi
          .spyOn(myMoviesApi.prototype, "setRating")
          .mockImplementation(stubSetRating_RejectNotFound);

        expect(errorMessageStore.message.length).toBe(0);
        await myMoviesStore.setMovieRating(imdbId, newRating);
        expect(setRatingMock).toHaveBeenCalledTimes(1);
        expect(setRatingMock).toHaveBeenLastCalledWith(imdbId, newRating);
        expect(errorMessageStore.message.length).toBe(1);
        expect(errorMessageStore.message[0][2]).toBe(
          "Updating movie rating failed because of the following error: Movie not found"
        );
      });

      it("should not be possible to set movie as no longer having been seen when it does not exist", async () => {
        const imdbId = "tt9999999";

        setUnseenMock = vi
          .spyOn(myMoviesApi.prototype, "setUnseen")
          .mockImplementation(stubSetUnseen_RejectNotFound);

        expect(errorMessageStore.message.length).toBe(0);
        await myMoviesStore.setMovieUnseen(imdbId);
        expect(setUnseenMock).toHaveBeenCalledTimes(1);
        expect(setUnseenMock).toHaveBeenLastCalledWith(imdbId);
        expect(errorMessageStore.message.length).toBe(1);
        expect(errorMessageStore.message[0][2]).toBe(
          "Updating movie seen failed because of the following error: Movie not found"
        );
      });
    });
  });
});
