import myMoviesApiData from "@/__fixtures__/api/myMoviesApi.json";
import { rest } from "msw";

/**
 * My Movies API interceptor handler.
 */
export const myMoviesApiMsw = (() => {
  const baseConfiguration = {
    baseUrl: "",
  };

  /**
   * Create handlers that resolves requests with the given "make handler" function
   * @param {function(method: string, path: string)} makeHandlerFn The function to resolve requests with.
   * @returns {*[]} The created handlers.
   */
  const createHandlers = (makeHandlerFn) => {
    const getHandlers = [];
    const postHandlers = [];
    const putHandlers = [];
    const deleteHandlers = [];

    Object.keys(myMoviesApiData.get).forEach((path) => {
      const handlerFn = makeHandlerFn("get", path);
      getHandlers.push(rest.get(configuration.baseUrl + path, handlerFn));
      if (path === "/")
        getHandlers.push(rest.get(configuration.baseUrl, handlerFn));
    });

    Object.keys(myMoviesApiData.post).forEach((path) => {
      const handlerFn = makeHandlerFn("post", path);
      postHandlers.push(rest.post(configuration.baseUrl + path, handlerFn));
      if (path === "/")
        postHandlers.push(rest.post(configuration.baseUrl, handlerFn));
    });

    Object.keys(myMoviesApiData.put).forEach((path) => {
      const handlerFn = makeHandlerFn("put", path);
      putHandlers.push(rest.put(configuration.baseUrl + path, handlerFn));
      if (path === "/")
        putHandlers.push(rest.put(configuration.baseUrl, handlerFn));
    });

    Object.keys(myMoviesApiData.delete).forEach((path) => {
      const handlerFn = makeHandlerFn("delete", path);
      deleteHandlers.push(rest.delete(configuration.baseUrl + path, handlerFn));
      if (path === "/")
        deleteHandlers.push(rest.delete(configuration.baseUrl, handlerFn));
    });

    return [...getHandlers, ...postHandlers, ...putHandlers, ...deleteHandlers];
  };

  let configuration = JSON.parse(JSON.stringify(baseConfiguration));
  return {
    /**
     * Clear the configuration to its original state.
     */
    clear: () => {
      configuration = JSON.parse(JSON.stringify(baseConfiguration));
    },
    /**
     * Set the base URL for the handlers.
     * @param baseUrl The base url for the API.
     */
    setBaseUrl: (baseUrl) => {
      configuration.baseUrl = baseUrl;
    },
    /**
     * Get all rest handlers for successful requests.
     * @returns All handlers
     */
    handlers: () => {
      const makeHandlerFn = (method, path) => {
        return (req, res, ctx) => {
          return res(
            ctx.status(myMoviesApiData[method][path].status),
            ctx.json(myMoviesApiData[method][path].content)
          );
        };
      };

      return createHandlers(makeHandlerFn);
    },
    /**
     * Get all rest handlers for failed requests.
     * @param errorCode The error code to always return.
     * @returns All handlers
     */
    handlersWithErrorCode: (errorCode) => {
      const makeHandlerFn = (method, path) => {
        return (req, res, ctx) => {
          if (
            Object.prototype.hasOwnProperty.call(
              myMoviesApiData.error[method][path],
              errorCode
            )
          )
            return res(
              ctx.status(errorCode),
              ctx.json(myMoviesApiData.error[method][path][errorCode])
            );
          else return res(ctx.status(errorCode), ctx.json("No Data"));
        };
      };

      return createHandlers(makeHandlerFn);
    },
  };
})();
