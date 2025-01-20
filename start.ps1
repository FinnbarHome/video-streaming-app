# Load environment variables from env.txt
Get-Content env.txt | ForEach-Object {
    $name, $value = $_ -split '='
    [System.Environment]::SetEnvironmentVariable($name, $value)
}

# Save the current directory
$OriginalDir = Get-Location

# Change directory to db-seeder
Set-Location -Path "./db-seeder"

# Run npm install
npm install

# Pass VIDEO_HOST_PORT and MONGO_URI to seed.js and run it
$env:VIDEO_HOST_PORT = $env:VIDEO_HOST_PORT
$env:MONGO_URI = $env:MONGO_URI
node seed.js

# Return to the original directory
Set-Location -Path $OriginalDir

# Create a docker-compose.override.yml file to pass environment variables
@"
version: '3.8'
services:
  backend:
    environment:
      - PORT=${env:BACKEND_PORT}
      - MONGO_URI=${env:MONGO_URI}
      - JWT_SECRET=${env:JWT_SECRET}

  frontend:
    environment:
      - PORT=${env:FRONTEND_PORT}
      - VITE_API_BASE_URL=${env:VITE_API_BASE_URL}

  video-host:
    environment:
      - PORT=${env:VIDEO_HOST_PORT}
"@ | Out-File -Encoding UTF8 docker-compose.override.yml

# Run Docker Compose
docker-compose up --build
