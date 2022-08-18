# File should only be sourced (thanks https://stackoverflow.com/a/28776166)
sourced=0
if [ -n "$ZSH_VERSION" ]; then
  case $ZSH_EVAL_CONTEXT in *:file) sourced=1;; esac
elif [ -n "$KSH_VERSION" ]; then
  [ "$(cd -- "$(dirname -- "$0")" && pwd -P)/$(basename -- "$0")" != "$(cd -- "$(dirname -- "${.sh.file}")" && pwd -P)/$(basename -- "${.sh.file}")" ] && sourced=1
elif [ -n "$BASH_VERSION" ]; then
  (return 0 2>/dev/null) && sourced=1
else # All other shells: examine $0 for known shell binary filenames.
     # Detects `sh` and `dash`; add additional shell filenames as needed.
  case ${0##*/} in sh|-sh|dash|-dash) sourced=1;; esac
fi

if [[ $sourced = 0 ]]; then
  echo "File should not be run directly, it should only be sourced.";
  exit 1;
fi

# Reset all variables
unset DEV_DOCKER_CONTAINER_NAME
unset DEV_CLIENT_PORT
unset VITE_APP_API_KEY_OMDB

# Verify .env file exists
if [ ! -f .env ]; then
  echo "Please create the .env file with all necessary variables before running script";
  exit 1;
fi

# Export env vars
export $(grep -v '^#' .env | xargs)

# Verify env vars
if [ -z ${DEV_DOCKER_CONTAINER_NAME} ] || [ -v "$DEV_DOCKER_CONTAINER_NAME" ]; then
  echo "Please set \$DEV_DOCKER_CONTAINER_NAME in the .env file";
  exit 1;
fi

if [ -z ${DEV_CLIENT_PORT} ] || [ -v "$DEV_CLIENT_PORT" ]; then
  echo "Please set \$DEV_CLIENT_PORT in the .env file";
  exit 1;
fi

if [ -z ${VITE_APP_API_KEY_OMDB} ] || [ -v "$VITE_APP_API_KEY_OMDB" ]; then
  echo "Please set \$VITE_APP_API_KEY_OMDB in the .env file";
  exit 1;
fi

if ! [[ $DEV_CLIENT_PORT =~ ^[0-9]+$ ]]; then
  echo "Please set \$DEV_CLIENT_PORT to a NUMERIC value only, not '$DEV_CLIENT_PORT'";
  exit 1;
fi
