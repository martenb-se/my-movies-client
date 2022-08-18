#!/bin/bash
# ~~~~~~~ Get Environment
source env.load.sh

# ~~~~~~~ Execution
# Make temporary video dir
mkdir -p ./cypress/videos/docker

# Run e2e tests
docker compose -f docker-compose.testing.yml run --rm e2etest

# Cleanup after testing
docker image rm vuejs/my-movies-client-e2etest

# Remove temporary video dir
rm -rf ./cypress/videos/docker