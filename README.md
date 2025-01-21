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
- [MongoDB](https://www.mongodb.com/try/download/community) (for local MongoDB deployment, or use MongoDB Atlas)
- [Git Bash](https://git-scm.com/) (if you’re using Windows)
- [Node.js](https://nodejs.org/en/)

### MongoDB Connection

You can use either:

- A locally hosted MongoDB connection string, such as:
  ```plaintext
  mongodb://localhost:27017
  ```
- A MongoDB Atlas connection string in the format:
  ```plaintext
  mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  ```

## Project Setup

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/FinnbarHome/video-streaming-app.git
cd video-streaming-platform
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGO_URI=mongodb://localhost:27017
BACKEND_PORT=5000
JWT_SECRET=your_secret_key
VITE_API_BASE_URL=http://localhost:5000/api
FRONTEND_PORT=8081
VIDEO_HOST_PORT=3000
```

- Replace `MONGO_URI` with your MongoDB connection string if different (e.g., a MongoDB Atlas URI).
- Set a secure value for `JWT_SECRET`.

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

To start the application, run the provided shell script:

```bash
./setup.sh
```

#### What the Script Does:

1. Validates the `.env` file to ensure all required variables are set.
2. Clears existing entries in the database if any exist.
3. Seeds the database with video metadata from the `video-host/videos` directory.
4. Starts the application using Docker Compose.

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

- **MongoDB Connection Issues:**
  - Ensure your MongoDB instance is running.
  - Check the `MONGO_URI` value in your `.env` file. If using Atlas, ensure credentials are correct.
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
