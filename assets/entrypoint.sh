# Modify Standard Host Data
sed -i -E "s/STANDARD_API_URL = \"[^\"]+\"/STANDARD_API_URL = \"http:\/\/$DEV_BACKEND_HOST:$DEV_BACKEND_PORT\/api\/movies\"/" ./src/api/myMoviesApi.js
sed -i -E "s/cy\.request\(\"POST\", \"[^\"]+\", movies\[([0-9]+)\]\)/cy.request(\"POST\", \"http:\/\/$DEV_BACKEND_HOST:$DEV_BACKEND_PORT\/api\/movies\", movies[\1])/" ./cypress/e2e/home.cy.js

# Build Front-End
npm run build

# Run Tests
npm run test:e2e:ci

# Allow Anyone to Do Anything With Video Files
chmod -R 777 ./cypress/videos

# Wait For User
echo "E2E tests have finished."
echo "Check the videos in ./cypress/videos/docker in order to see the runs. Otherwise press [ENTER] to finish testing."
read user_exit_verify
