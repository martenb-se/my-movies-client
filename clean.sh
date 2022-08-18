#!/bin/bash
# ~~~~~~~ Get Environment
source env.load.sh

# ~~~~~~~ Constants
# Build
DOCKER_CONTAINER="$DEV_DOCKER_CONTAINER_NAME"

# ~~~~~~~ Execution
# Stop container
result_docker_stop=$(docker container stop "$DOCKER_CONTAINER" 2>&1)
exit_docker_stop=$?
if [ ! $exit_docker_stop -eq 0 ]; then
  if [[ ! "$result_docker_stop" =~ .*"No such container".* ]]; then
    echo "Could not stop '$DOCKER_CONTAINER' because of an unknown error: '$result_docker_stop'. Cannot continue"
    exit 1
  fi
fi

# Remove container
result_docker_rm=$(docker container rm "$DOCKER_CONTAINER" 2>&1)
exit_docker_rm=$?
if [ ! $exit_docker_rm -eq 0 ]; then
  if [[ ! "$result_docker_rm" =~ .*"No such container".* ]]; then
    echo "Could not remove '$DOCKER_CONTAINER'! Cannot continue"
    exit 1
  fi
fi

# Remove image
result_docker_rm=$(docker image rm "vuejs/my-movies-client" 2>&1)
exit_docker_rm=$?
if [ ! $exit_docker_rm -eq 0 ]; then
  if [[ ! "$result_docker_rm" =~ .*"No such image".* ]]; then
    echo "Could not remove '$DOCKER_CONTAINER'! Cannot continue"
    exit 1
  fi
fi

