# Video Streaming Platform

## Overview

This is a locally deployable video streaming platform designed to offer seamless browsing, streaming, and video management. Key features include:

- **User Authentication:** Secure login and registration.
- **Video Streaming:** High-quality playback.
- **Watch History:** Tracks previously viewed videos.
- **Watchlist Management:** Save videos for later.
- **Search Functionality:** Search videos by keywords.

The project was originally designed to run on AWS but has been enhanced to include new content and containers such as the `db-seeder` and `video-host`, enabling the platform to run locally using Docker.

## Architecture

The platform is built using:

- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Containerization:** Docker Compose

### Former AWS Hosting

Previously, the platform was hosted on AWS with the following architecture:

- **AWS ECS:** Orchestrated Docker containers for frontend and backend services.
- **AWS S3:** Stored video content securely.
- **AWS CloudFront:** Accelerated video delivery using a global Content Delivery Network (CDN).
- **AWS Elastic Load Balancer:** Routed traffic between frontend and backend services.
- **AWS ECR:** Stored Docker images for containerized services.

The deployment also included a CI/CD pipeline implemented using AWS CodePipeline and AWS CodeBuild, which automated builds and deployments for both frontend and backend services.

Now, additional content and containers like `db-seeder` and `video-host` have been added, allowing the platform to run entirely locally without AWS dependencies.

## Prerequisites

To run this project, ensure the following are installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/en/)

MongoDB is started automatically via Docker Compose (no separate Mongo install required).

Optional:

- [Git Bash](https://git-scm.com/) or WSL (required if you want to run `setup.sh` on Windows)

## Project Setup

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/FinnbarHome/video-streaming-app.git
cd video-streaming-platform
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory.

Your `.env` should contain values like:

```env
DOCKER_MONGO_URI=mongodb://mongo:27017/videostreaming
BACKEND_PORT=5000
DOCKER_JWT_SECRET=your_secret_key
VITE_API_BASE_URL=http://localhost:5000/api
FRONTEND_PORT=8081
VIDEO_HOST_PORT=3000
VIDEO_PUBLIC_BASE_URL=http://localhost:3000/videos
```

- Set a secure value for `DOCKER_JWT_SECRET`.
- Note: `setup.sh` also supports legacy keys `MONGO_URI` / `JWT_SECRET` and will map them automatically.

### 3. Add Videos

To add videos to the platform:

1. Place your video files in the `video-host/videos` directory.
2. Ensure each video has a corresponding thumbnail image:
   - **Format Requirements**:
     - Videos: `.mp4`
     - Thumbnails: `.png`
   - **Naming Convention**:
     - Video and thumbnail must share the same name (case-sensitive).
     - Example:
       - `VideoOfDog.mp4`
       - `VideoOfDog.png`

The `db-seeder` container automatically processes these files, extracting metadata and adding them to the database when the platform starts.

### 4. Run the Application

To start the application (and seed the DB) using the single setup script:

```bash
./setup.sh
```

Windows note: run `setup.sh` from **Git Bash** or **WSL** (not PowerShell).

What it does:

- Validates `.env` (if present)
- Starts MongoDB + backend + frontend + video-host via Docker Compose
- Clears and re-seeds the `videos` collection from `video-host/videos`

If you prefer to run commands manually instead of `setup.sh`:

```bash
docker compose up --build -d
docker compose --profile seed run --rm db-seeder
```

### 5. Access the Application

- **Frontend:** Open [http://localhost:8081](http://localhost:8081) in your browser.
- **Backend API:** Accessible at [http://localhost:5000/api](http://localhost:5000/api).

## Features

- **User Authentication:** Secure login and registration with hashed passwords.
- **Video Streaming:** Smooth video playback.
- **Watch History:** Tracks viewed videos for each user.
- **Watchlist Management:** Save and manage videos for future viewing.
- **Search Functionality:** Fast and accurate video search.
- **Custom Video Uploads:** Easily add new videos and thumbnails for streaming.

## Troubleshooting

### Common Issues

- **MongoDB Connection Issues (Docker):**
  - Ensure Docker Desktop is running.
  - Check that `DOCKER_MONGO_URI` is `mongodb://mongo:27017/videostreaming` when using Docker Compose.
- **Port Conflicts:**
  - Verify that the ports `5000`, `8081`, and `3000` are not in use. If needed, update them in the `.env` file and `docker-compose.yml`.
- **Permission Issues:**
  - On Windows, ensure you’re using Git Bash or WSL for proper shell script execution.

### Logs

- Database scripts (`clear-db.js`, `seed.js`) log the number of entries cleared or added for better visibility.

---

### Former CI/CD Pipeline (Optional)

The project includes a `buildspec.yml` file for setting up a CI/CD pipeline. To use it:

1. Configure AWS CodePipeline and CodeBuild.
2. Push changes to your repository to trigger builds and deployments.
