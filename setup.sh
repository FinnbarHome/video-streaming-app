#!/bin/bash

# Ensure the script exits if any command fails
set -e

# Stop and remove any existing Docker containers
docker compose down

get_env_value() {
  # Reads VAR=value from .env, returns value (strips trailing CR for Windows line endings)
  local key="$1"
  local line
  line="$(grep -E "^${key}=" .env 2>/dev/null | head -n 1 | cut -d '=' -f2-)"
  printf "%s" "${line}" | tr -d '\r'
}

env_key_present_but_empty() {
  local key="$1"
  grep -Eq "^${key}=" .env 2>/dev/null || return 1
  local val
  val="$(get_env_value "$key")"
  [[ -z "$val" ]]
}

# If .env exists, validate any provided keys aren't empty and map legacy keys -> DOCKER_* keys.
if [ -f ".env" ]; then
  echo "Validating environment variables in .env..."

  # If a key exists but has an empty value, fail fast.
  for key in DOCKER_MONGO_URI MONGO_URI DOCKER_JWT_SECRET JWT_SECRET BACKEND_PORT FRONTEND_PORT VIDEO_HOST_PORT VITE_API_BASE_URL VIDEO_PUBLIC_BASE_URL; do
    if env_key_present_but_empty "$key"; then
      echo "Error: $key is present but empty in .env. Please set it and try again."
      exit 1
    fi
  done

  # Backwards-compat: allow older .env files using MONGO_URI/JWT_SECRET.
  if [[ -z "${DOCKER_MONGO_URI}" ]]; then
    DOCKER_MONGO_URI_FILE="$(get_env_value DOCKER_MONGO_URI)"
    MONGO_URI_FILE="$(get_env_value MONGO_URI)"
    if [[ -n "${DOCKER_MONGO_URI_FILE}" ]]; then
      export DOCKER_MONGO_URI="${DOCKER_MONGO_URI_FILE}"
    elif [[ -n "${MONGO_URI_FILE}" ]]; then
      export DOCKER_MONGO_URI="${MONGO_URI_FILE}"
    fi
  fi

  if [[ -z "${DOCKER_JWT_SECRET}" ]]; then
    DOCKER_JWT_SECRET_FILE="$(get_env_value DOCKER_JWT_SECRET)"
    JWT_SECRET_FILE="$(get_env_value JWT_SECRET)"
    if [[ -n "${DOCKER_JWT_SECRET_FILE}" ]]; then
      export DOCKER_JWT_SECRET="${DOCKER_JWT_SECRET_FILE}"
    elif [[ -n "${JWT_SECRET_FILE}" ]]; then
      export DOCKER_JWT_SECRET="${JWT_SECRET_FILE}"
    fi
  fi

  # Default VIDEO_PUBLIC_BASE_URL if missing (keeps URLs browser-reachable)
  if [[ -z "${VIDEO_PUBLIC_BASE_URL}" ]]; then
    VIDEO_PUBLIC_BASE_URL_FILE="$(get_env_value VIDEO_PUBLIC_BASE_URL)"
    if [[ -n "${VIDEO_PUBLIC_BASE_URL_FILE}" ]]; then
      export VIDEO_PUBLIC_BASE_URL="${VIDEO_PUBLIC_BASE_URL_FILE}"
    else
      VIDEO_HOST_PORT_FILE="$(get_env_value VIDEO_HOST_PORT)"
      VIDEO_HOST_PORT_EFFECTIVE="${VIDEO_HOST_PORT_FILE:-3000}"
      export VIDEO_PUBLIC_BASE_URL="http://localhost:${VIDEO_HOST_PORT_EFFECTIVE}/videos"
    fi
  fi
else
  echo "No .env found; using docker-compose.yml defaults."
  echo "Tip: copy env.example to .env if you want to customize ports/secrets."
fi

echo "Starting services..."
docker compose up --build -d

echo "Seeding database (clears + re-seeds videos collection)..."
docker compose --profile seed run --rm db-seeder

echo "Done. Services are running."
if [ -f ".env" ]; then
  echo "Frontend: http://localhost:$(grep -E '^FRONTEND_PORT=' .env | cut -d '=' -f2-)"
  echo "Backend:  http://localhost:$(grep -E '^BACKEND_PORT=' .env | cut -d '=' -f2-)/api"
  echo "Videos:   http://localhost:$(grep -E '^VIDEO_HOST_PORT=' .env | cut -d '=' -f2-)/videos"
else
  echo "Frontend: http://localhost:8081"
  echo "Backend:  http://localhost:5000/api"
  echo "Videos:   http://localhost:3000/videos"
fi
