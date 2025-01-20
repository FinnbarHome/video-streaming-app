#!/bin/bash

# Run the seeder script
echo "Running database seeder..."
node db-seeder/seed.js

# Check if the seeder script succeeded
if [ $? -eq 0 ]; then
  echo "Database seeder succeeded. Starting Docker containers..."
  docker-compose up
else
  echo "Database seeder failed. Aborting Docker container startup."
  exit 1
fi
