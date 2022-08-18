/* global global */
// Replace fetch in order to use MSW in Node ( https://markus.oberlehner.net/blog/using-mock-service-worker-with-vitest-and-fetch/ )
import { fetch } from "cross-fetch";
global.fetch = fetch;
