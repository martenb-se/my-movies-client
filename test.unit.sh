#!/bin/bash
# ~~~~~~~ Get Environment
source env.load.sh

# ~~~~~~~ Execution
# Run unit tests
docker compose -f docker-compose.testing.yml run --rm unittest

# Cleanup after testing
docker image rm vuejs/my-movies-client-unittest