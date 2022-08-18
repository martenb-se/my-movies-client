import omdbApiData from "@/__fixtures__/api/omdbApi.json";
import { rest } from "msw";

/**
 * OMDB API interceptor handler.
 */
export const omdbApiMsw = (() => {
  const baseConfiguration = {
    baseUrl: "",
  };

  /**
   * Get all unique path mappings from an object with path mappings that might also include query searches.
   * @param {{}} pathMappings All path mappings
   * @returns {{}|void} An object with only unique path mappings.
   */
  const getUniqueMappingPaths = (pathMappings) => {
    const uniquePathMappings = {};
    Object.keys(pathMappings).forEach((path) => {
      const mappingUrl = new URL(configuration.baseUrl + path);

      if (
        Object.keys(uniquePathMappings).length === 0 ||
        !Object.prototype.hasOwnProperty.call(
          uniquePathMappings,
          mappingUrl.pathname
        )
      )
        uniquePathMappings[mappingUrl.pathname] = 1;
      else uniquePathMappings[mappingUrl.pathname]++;
    });
    return uniquePathMappings;
  };

  /**
   * Create handlers that resolves requests with the given "make handler" function
   * @param {function(method: string, path: string)} makeHandlerFn The function to resolve requests with.
   * @returns {*[]} The created handlers.
   */
  const createHandlers = (makeHandlerFn) => {
    const getHandlers = [];

    const uniquePathMappings = getUniqueMappingPaths(omdbApiData.get);

    Object.keys(uniquePathMappings).forEach((path) => {
      const handlerFn = makeHandlerFn("get", path);
      getHandlers.push(rest.get(configuration.baseUrl + path, handlerFn));
    });

    return [...getHandlers];
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
          const foundMapping = Object.keys(omdbApiData[method]).filter(
            (mappingPath) => {
              const mappingUrl = new URL(configuration.baseUrl + mappingPath);

              const reqUrlParameters = Array.from(req.url.searchParams);
              const mappingUrlParameters = Array.from(mappingUrl.searchParams);

              if (
                path === mappingUrl.pathname &&
                Array.from(reqUrlParameters).length ===
                  Array.from(mappingUrlParameters).length
              ) {
                let handlerMatchingMapping = true;
                reqUrlParameters.forEach((reqUrlParameter) => {
                  if (handlerMatchingMapping === false) return;
                  let foundMatch = false;
                  mappingUrlParameters.forEach((handlerUrlParameter) => {
                    if (foundMatch === true) return;
                    if (
                      handlerUrlParameter[0] === reqUrlParameter[0] &&
                      handlerUrlParameter[1] === reqUrlParameter[1]
                    )
                      foundMatch = true;
                  });
                  if (foundMatch === false) handlerMatchingMapping = false;
                });
                return handlerMatchingMapping;
              } else return false;
            }
          );

          if (foundMapping.length > 0) {
            return res(
              ctx.status(omdbApiData[method][foundMapping[0]].status),
              ctx.json(omdbApiData[method][foundMapping[0]].content)
            );
          } else {
            return res(
              ctx.status(omdbApiData.nomatch.status),
              ctx.json(omdbApiData.nomatch.content)
            );
          }
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
          const foundMapping = Object.keys(omdbApiData.error[method]).filter(
            (mappingPath) => {
              const mappingUrl = new URL(configuration.baseUrl + mappingPath);

              const reqUrlParameters = Array.from(req.url.searchParams);
              const mappingUrlParameters = Array.from(mappingUrl.searchParams);

              if (
                path === mappingUrl.pathname &&
                Array.from(reqUrlParameters).length ===
                  Array.from(mappingUrlParameters).length
              ) {
                let handlerMatchingMapping = true;
                reqUrlParameters.forEach((reqUrlParameter) => {
                  if (handlerMatchingMapping === false) return;
                  let foundMatch = false;
                  mappingUrlParameters.forEach((handlerUrlParameter) => {
                    if (foundMatch === true) return;
                    if (
                      handlerUrlParameter[0] === reqUrlParameter[0] &&
                      handlerUrlParameter[1] === reqUrlParameter[1]
                    )
                      foundMatch = true;
                  });
                  if (foundMatch === false) handlerMatchingMapping = false;
                });
                return handlerMatchingMapping;
              } else return false;
            }
          );

          if (foundMapping.length > 0) {
            return res(
              ctx.status(errorCode),
              ctx.json(omdbApiData.error[method][foundMapping[0]][errorCode])
            );
          } else {
            return res(
              ctx.status(omdbApiData.nomatch.status),
              ctx.json(omdbApiData.nomatch.content)
            );
          }
        };
      };

      return createHandlers(makeHandlerFn);
    },
  };
})();
