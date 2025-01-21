#!/bin/bash

# Ensure the script exits if any command fails
set -e

# Remove the generated .env file if it exists
rm -rf generated.env

# Remove the db-seeder generated .env file if it exists
rm -rf db-seeder/.env

# Stop and remove any existing Docker containers
docker-compose down

# Define the path to the original .env file
ORIGINAL_ENV_FILE=".env"

# Define the path to the temporary .env file
GENERATED_ENV_FILE="generated.env"

# Check if the .env file exists in the main directory
if [ ! -f "$ORIGINAL_ENV_FILE" ]; then
    echo "Error: $ORIGINAL_ENV_FILE not found in the main directory."
    exit 1
fi

# List of required environment variables
REQUIRED_VARS=("MONGO_URI" "BACKEND_PORT" "JWT_SECRET" "VITE_API_BASE_URL" "FRONTEND_PORT" "VIDEO_HOST_PORT")

# Validate that all required variables are set
echo "Validating environment variables in $ORIGINAL_ENV_FILE..."
for var in "${REQUIRED_VARS[@]}"; do
    value=$(grep -E "^$var=" "$ORIGINAL_ENV_FILE" | cut -d '=' -f2-)
    if [[ -z "$value" ]]; then
        echo "Error: $var is not set in $ORIGINAL_ENV_FILE. Please set it and try again."
        exit 1
    fi

    # Specific check for MONGO_URI being still set to [YOUR_MONGO_URI]
    if [[ "$var" == "MONGO_URI" && "$value" == "[YOUR_MONGO_URI]" ]]; then
        echo "Error: MONGO_URI is still set to [YOUR_MONGO_URI] in $ORIGINAL_ENV_FILE."
        echo "Please set MONGO_URI to your actual MongoDB connection string and try again."
        exit 1
    fi
done

# Generate a new .env file
echo "Generating $GENERATED_ENV_FILE..."
> "$GENERATED_ENV_FILE" # Clear the file before appending

while IFS= read -r line; do
    if [[ "$line" =~ ^MONGO_URI=(.*)$ ]]; then
        BASE_MONGO_URI="${BASH_REMATCH[1]}"

        # Separate URI into base and query parameters
        URI_WITHOUT_QUERY=$(echo "$BASE_MONGO_URI" | sed -E 's|\?.*||')
        QUERY_STRING=$(echo "$BASE_MONGO_URI" | grep -oE '\?.*' || echo "")

        # Append /videostreaming before the query string
        if [[ "$URI_WITHOUT_QUERY" == */ ]]; then
            URI_WITHOUT_QUERY="${URI_WITHOUT_QUERY%/}"
        fi
        FINAL_MONGO_URI="${URI_WITHOUT_QUERY}/videostreaming${QUERY_STRING}"

        # Append the updated MONGO_URI to the generated file
        echo "MONGO_URI=${FINAL_MONGO_URI}" >> "$GENERATED_ENV_FILE"
    else
        # Append other lines unchanged
        echo "$line" >> "$GENERATED_ENV_FILE"
    fi
done < "$ORIGINAL_ENV_FILE"

# Ensure VIDEO_HOST_PORT is included
VIDEO_HOST_PORT=$(grep -E "^VIDEO_HOST_PORT=" "$ORIGINAL_ENV_FILE" | cut -d '=' -f2-)
if [[ -n "$VIDEO_HOST_PORT" ]]; then
    echo "VIDEO_HOST_PORT=$VIDEO_HOST_PORT" >> "$GENERATED_ENV_FILE"
fi

# Copy the new .env file into db-seeder
cp "$GENERATED_ENV_FILE" db-seeder/.env

# Change to db-seeder directory
cd db-seeder || exit

# Install dependencies
npm install

# Run the clear-db.js script to clear existing entries
echo "Clearing the database if entries exist..."
node clear-db.js

# Run the seed script
node seed.js

# Return to the main directory
cd ..

# Run Docker Compose, passing through the generated .env file
docker-compose --env-file "generated.env" up --build
