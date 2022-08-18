// TODO: REMOVE ME!!!!!! Using MSW instead!!!

import { vi } from "vitest";
import { HttpMethod } from "@/enum/httpMethodEnum";

export const fetchMockConfiguration = (() => {
  const baseConfiguration = {
    apiToFixtureMapping: [],
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
     * Register an API to Fixture mapping with the fetch() mock.
     * @param {string} apiBaseUrl The base url to handle.
     * @param {JSON} fixtureJson The fixture data to reply with.
     */
    registerApiToFixture: (apiBaseUrl, fixtureJson) => {
      configuration.apiToFixtureMapping.push([apiBaseUrl, fixtureJson]);
    },
    /**
     * Get the fixture mapping for a given url if it exists, if multiple fixtures matches, then the one with the
     * longest apiBaseUrl will be used (the matcher that matches most of the provided url)
     * @param {string} url The requested URL to get a fixture mapping for.
     * @returns {null|JSON} If a matcher is found, the fixture is returned. Otherwise null is returned.
     */
    getFixtureMappingForUrl: (url) => {
      const matchingMapping = configuration.apiToFixtureMapping.reduce(
        (bestMapping, curMapping) => {
          const [curApiBaseUrl] = curMapping;
          const curApiUrlMatcher = new RegExp(
            "^" +
              curApiBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
              "/?(.*)$",
            "g"
          );
          if (url.match(curApiUrlMatcher) !== null) {
            if (
              bestMapping.length !== 0 &&
              curApiBaseUrl.length > bestMapping[0]
            )
              return curMapping;
            else return bestMapping;
          } else return bestMapping;
        },
        []
      );
      if (matchingMapping.length > 0) return matchingMapping[1];
      else return null;
    },
  };
})();

export const fetchMock = vi.fn(
  (
    input,
    init = ({ method, headers, body } = { method: HttpMethod.GET.name })
  ) => {
    return new Promise((doResolve, doReject) => {
      const dataFixture = fetchMockConfiguration.getFixtureMappingForUrl(input);
      let dataMatch = "";

      if (dataFixture !== null) {
        //dataFixture.
      }

      const Headers = { "content-type": dataFixture !== null ? "application/json" : "text/html" };

      const Response = {
        body: null,
        bodyUsed: false,
        headers: {
          get: (header) => {
            if (Object.prototype.hasOwnProperty.call(Headers, header))
              return Headers[header];
            else return "";
          },
        },
        ok: true,
        redirected: false,
        status: 200,
        statusText: "OK",
        type: "basic",
        url: input,
      };

      if (Response.status >= 200 && Response.status <= 299) doResolve(Response);
      else doReject(Response);
    });
  }
);
