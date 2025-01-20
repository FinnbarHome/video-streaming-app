@echo off
echo Running database seeder...

:: Load environment variables from env.txt
if not exist env.txt (
    echo env.txt not found. Aborting.
    exit /b 1
)

for /f "tokens=1,2 delims==" %%A in (env.txt) do set "%%A=%%B"

:: Ensure VIDEO_HOST_PORT is set
if "%VIDEO_HOST_PORT%"=="" (
    echo VIDEO_HOST_PORT is not defined. Aborting.
    exit /b 1
)

:: Dynamically set SEED_API_BASE_URL based on VIDEO_HOST_PORT
set "SEED_API_BASE_URL=http://localhost:%VIDEO_HOST_PORT%/videos"

:: Debugging - Display variables
echo Using MONGO_URI=%MONGO_URI%
echo Using SEED_API_BASE_URL=%SEED_API_BASE_URL%

:: Navigate to the db-seeder directory
cd db-seeder

:: Install dependencies
call npm install
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies. Aborting seeder script.
    exit /b 1
)

:: Debug before running the seeder script
echo Running seeder script with MONGO_URI=%MONGO_URI% and SEED_API_BASE_URL=%SEED_API_BASE_URL%

:: Run the seed script
call node seed.js
IF %ERRORLEVEL% NEQ 0 (
    echo Seeder script failed.
    exit /b 1
)

:: Navigate back to the original directory
cd ..

echo Seeder script succeeded. Starting Docker containers...

:: Start Docker containers
call docker-compose up --build
