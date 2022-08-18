# Client - MyMovies Project
This is a simple project created for fun, it allows you to keep track of your favourite movies or tv-series.
It was created using [PostgresSQL](https://www.postgresql.org/), [Spring Boot](https://spring.io/projects/spring-boot) and [VueJS](https://vuejs.org/).

This is the **client** for the project. The main repository is:
[MyMovies Project](https://github.com/martenb-se/my-movies)

## Requirements
In order to simply try this project you only need the following:
### Software
* **Docker Compose**, [Installation instructions](https://docs.docker.com/compose/install/).

### Other
* **OMDB API Key**, [Request an API key here (the free alternative is good enough)](http://www.omdbapi.com/apikey.aspx)

## Install
### Clone
Clone the repository and enter it
```shell
git clone git@github.com:martenb-se/my-movies-client.git
cd my-movies-client
```

### Preparation
In order to run or test the *MyMovies Project **client***, the following must be performed.

#### Environment Settings
Create a *.env* (dotenv) file in the root directory and fill out the following variables:
```dotenv
DEV_DOCKER_CONTAINER_NAME=EDIT_ME
DEV_CLIENT_PORT=3000

VITE_APP_API_KEY_OMDB=EDIT_ME
```

Where
* `DEV_DOCKER_CONTAINER_NAME` is the name of the docker container that will be created.
* `DEV_CLIENT_PORT` is the port where the client development server will be exposed.
* `VITE_APP_API_KEY_OMDB` is the API key you received from the [OMDB API](http://www.omdbapi.com/).

## Start
In order to load the environment, run the application, and to verify that health checks are good, run the Docker Compose Script
```shell
./run.sh
```

### Sample printout from running
```text
$ ./run.sh
[+] Building 55.0s (17/17) FINISHED
 => [internal] load build definition from Dockerfile       0.0s
...
 => => naming to docker.io/vuejs/my-movies-client          0.0s

[+] Running 1/1
 ⠿ Container dev-my-movies-client  Started                 0.5s
Waiting for container health-check to finish..
...
Waiting for container health-check to finish..
Docker container dev-my-movies-client is now ready!
```

Once you see "_Docker container `DEV_DOCKER_CONTAINER_NAME` is now ready!_", the client is now reachable at:

http://localhost:`DEV_CLIENT_PORT`

## Stop and Uninstall
In order to stop the container and clean everything up, run:
```shell
./clean.sh
```

## Run Tests
The following tests will run inside a Docker container, therefore you will not need anything else than *Docker Compose* (as previously written). Once the tests have run, all will be cleaned up.

### Unit Tests
In order to run unit tests, run the following:
```shell
./test.unit.sh
```

#### Sample printout from running unit tests
```text
...
... (lots of text removed)
...
 ✓ src/components/__tests__/MovieSearchList.spec.js (14) 453ms
 ✓ src/stores/__tests__/myMovies.spec.js (30)
 ✓ src/components/__tests__/AlertNotification.spec.js (18)
 ✓ src/stores/__tests__/movieSearch.spec.js (28)
 ✓ src/components/__tests__/MyMovieList.spec.js (36) 1275ms
 ✓ src/api/__tests__/myMoviesApi.spec.js (23) 443ms
 ✓ src/api/external/__tests__/omdbApi.spec.js (17) 358ms
 ✓ src/components/__tests__/MovieSearch.spec.js (14) 541ms
 ✓ src/util/__tests__/enumHandling.spec.js (6)
 ✓ src/stores/__tests__/errorMessage.spec.js (11)
 ✓ src/util/customError/__tests__/invalidArgumentError.spec.js (5)
 ✓ src/util/customError/__tests__/setupCallMissingError.spec.js (5)
 ✓ src/components/__tests__/NavbarMain.spec.js (3)
 ✓ src/components/__tests__/NotificationContainer.spec.js (1)
 ✓ src/__tests__/App.spec.js (4)
 ✓ src/views/__tests__/SearchView.spec.js (2)
 ✓ src/views/__tests__/HomeView.spec.js (1)

Test Files  17 passed (17)
     Tests  218 passed (218)
      Time  5.83s (in thread 3.84s, 151.85%)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
Untagged: my-movies-client-unittest:latest
Deleted: sha256:c0297847ffc0752a03ed9f56164a90927671a23976c9fffb96f5c767eec94de8
```

### End-To-End Tests
In order to run all tests, including system and integration tests, **make sure that the [Database for MyMovies Project](https://github.com/martenb-se/my-movies-database) is running**.
Then run the following:
```shell
./test.e2e.sh
```

#### Sample printout from running End-To-End tests
```text
...
... (lots of text removed)
...
====================================================================================================

  (Run Starting)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Cypress:        10.6.0                                                                         │
  │ Browser:        Electron 102 (headless)                                                        │
  │ Node Version:   v18.7.0 (/root/.nvm/versions/node/v18.7.0/bin/node)                            │
  │ Specs:          3 found (app.cy.js, home.cy.js, search.cy.js)                                  │
  │ Searched:       cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}                                     │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  app.cy.js                                                                       (1 of 3)


  Full App Tests
    ✓ search for 'guardians', add first movie, remove movie (1285ms)
    after having searched for 'Hero'
      ✓ can add and remove 5 movies (2033ms)


  2 passing (3s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        2                                                                                │
  │ Passing:      2                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        true                                                                             │
  │ Duration:     3 seconds                                                                        │
  │ Spec Ran:     app.cy.js                                                                        │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


  (Video)

  -  Started processing:  Compressing to 32 CRF                                                     
  -  Finished processing: /opt/my-movies-client/cypress/videos/app.cy.js.mp4              (0 seconds)


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  home.cy.js                                                                      (2 of 3)


  Home View Tests
    when a general selection of movies are added
      ✓ can rate movie (496ms)
      ✓ can rate movie twice (494ms)
      ✓ can rate movie and set as unseen (546ms)
      ✓ should show all movies sorted by ID in ascending order by default (301ms)
      ✓ can sort movies by ID in descending order (383ms)
      ✓ can sort movies by name in descending order (405ms)
      ✓ can sort movies by name in ascending order (500ms)
      ✓ can sort movies by IMDB id in descending order (357ms)
      ✓ can sort movies by IMDB id in ascending order (511ms)
      ✓ can sort movies by seen status in descending order (318ms)
      ✓ can sort movies by seen status in ascending order (471ms)
      ✓ can sort movies by rating in descending order (419ms)
      ✓ can sort movies by rating in ascending order (543ms)


  13 passing (11s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        13                                                                               │
  │ Passing:      13                                                                               │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        true                                                                             │
  │ Duration:     10 seconds                                                                       │
  │ Spec Ran:     home.cy.js                                                                       │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


  (Video)

  -  Started processing:  Compressing to 32 CRF                                                     
  -  Finished processing: /opt/my-movies-client/cypress/videos/home.cy.js.mp4              (1 second)


────────────────────────────────────────────────────────────────────────────────────────────────────
                                                                                                    
  Running:  search.cy.js                                                                    (3 of 3)


  Search View Tests
    ✓ can not click search without entering any text (254ms)
    ✓ can not set type to be anything other than movie, series or episode (657ms)
    ✓ can not set year to be negative (591ms)
    ✓ can not set year to be over 9999 (619ms)
    ✓ search for 'Spider-Man' (465ms)
    after having searched for 'Hero', starting at page 1 and at least 2 pages exists
      ✓ can go to a next page (536ms)
      ✓ can go to last page (482ms)
      ✓ can go to last page and then previous page (722ms)


  8 passing (4s)


  (Results)

  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Tests:        8                                                                                │
  │ Passing:      8                                                                                │
  │ Failing:      0                                                                                │
  │ Pending:      0                                                                                │
  │ Skipped:      0                                                                                │
  │ Screenshots:  0                                                                                │
  │ Video:        true                                                                             │
  │ Duration:     4 seconds                                                                        │
  │ Spec Ran:     search.cy.js                                                                     │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘


  (Video)

  -  Started processing:  Compressing to 32 CRF                                                     
  -  Finished processing: /opt/my-movies-client/cypress/videos/search.cy.js.mp4           (0 seconds)


====================================================================================================

  (Run Finished)


       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  app.cy.js                                00:03        2        2        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✔  home.cy.js                               00:10       13       13        -        -        - │
  ├────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✔  search.cy.js                             00:04        8        8        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:18       23       23        -        -        -  

E2E tests have finished.
Check the videos in ./cypress/videos/docker in order to see the runs. Otherwise press [ENTER] to finish testing.

```

#### Sample videos from running End-To-End tests
##### app.cy.js
[![End-To-End Tests for app.cy.js](https://img.youtube.com/vi/LyJGu_un4Yg/maxresdefault.jpg)](https://youtu.be/LyJGu_un4Yg)

##### home.cy.js
[![End-To-End Tests for app.cy.js](https://img.youtube.com/vi/4aI4mUyebuA/maxresdefault.jpg)](https://youtu.be/4aI4mUyebuA)

##### search.cy.js
[![End-To-End Tests for app.cy.js](https://img.youtube.com/vi/DgYWOpXxBPQ/maxresdefault.jpg)](https://youtu.be/DgYWOpXxBPQ)

## Alternative execution
### Requirements
In order to run or test the project **outside** Docker (for further development purposes), the following is needed.
#### Software
* **NodeJS v18.7.0**, [Installation instructions](https://nodejs.dev/en/learn/how-to-install-nodejs), or [simple installation instructions for Debian and Ubuntu](https://github.com/nodesource/distributions)

## Install
```shell
npm install
```

## Run
```shell
npm run dev
```

## Test
### Unit test
```shell
npm run test:unit
```
### End-To-End Tests
#### With Browser
```shell
npm run build
npm run test:e2e
```
#### Headless
```shell
npm run build
npm run test:e2e:ci
```