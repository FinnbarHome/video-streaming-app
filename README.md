# Video Streaming Platform

## Overview

This is a locally deployable video streaming platform designed to offer seamless browsing, streaming, and video management. Initially hosted on AWS, the project now requires Docker and MongoDB for local deployment. Key features include:

- **User Authentication:** Secure login and registration.
- **Video Streaming:** High-quality playback.
- **Watch History:** Tracks previously viewed videos.
- **Watchlist Management:** Save videos for later.
- **Search Functionality:** Search videos by keywords.

## Architecture

The platform is built using:

- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Containerization:** Docker Compose

## Former AWS Hosting

Previously, the platform was hosted on AWS with the following architecture:

- **AWS ECS:** Orchestrated Docker containers for frontend and backend services.
- **AWS S3:** Stored video content securely.
- **AWS CloudFront:** Accelerated video delivery using a global Content Delivery Network (CDN).
- **AWS Elastic Load Balancer:** Routed traffic between frontend and backend services.
- **AWS ECR:** Stored Docker images for containerized services.

The deployment also included a CI/CD pipeline implemented using AWS CodePipeline and AWS CodeBuild, which automated builds and deployments for both frontend and backend services. The current setup replicates the functionality locally using Docker.

## Prerequisites

To run this project, ensure the following are installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB](https://www.mongodb.com/try/download/community)

## Project Setup

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git https://github.com/FinnbarHome/video-streaming-app.git
cd video-streaming-platform
```

### 2. Restore MongoDB Data

Import the provided MongoDB dump into your MongoDB instance:

```bash
mongorestore --uri="mongodb://<your-mongo-uri>" /path/to/your/mongodb/dump
```

Replace `<your-mongo-uri>` with your MongoDB URI and `/path/to/your/mongodb/dump` with the path to your MongoDB dump folder.

### 3. Set Up Environment Variables

Update the `docker-compose.yml` file:

- Replace `[Insert your mongo URI here]` in the `backend` service with your MongoDB URI.

Example:

```yaml
backend:
  environment:
    - MONGO_URI=mongodb://localhost:27017/videostreaming
```

### 4. Run the Application

Run the Docker Compose file to start the services:

```bash
docker-compose up --build
```

This will:

- Build and start the `backend` service on port `5000`.
- Build and start the `frontend` service on port `8081`.

### 5. Access the Application

- **Frontend:** Open [http://localhost:8081](http://localhost:8081) in your browser.
- **Backend API:** Accessible at [http://localhost:5000/api](http://localhost:5000/api).

## CI/CD Pipeline (Optional)

The project includes a `buildspec.yml` file for setting up a CI/CD pipeline. To use it:

1. Configure AWS CodePipeline and CodeBuild.
2. Push changes to your repository to trigger builds and deployments.

## Features

- **User Authentication:** Secure login and registration with hashed passwords.
- **Video Streaming:** Smooth video playback.
- **Watch History:** Tracks viewed videos for each user.
- **Watchlist Management:** Save and manage videos for future viewing.
- **Search Functionality:** Fast and accurate video search.

## Troubleshooting

- **MongoDB Connection Issues:** Ensure your MongoDB instance is running and the URI is correct.
- **Port Conflicts:** Check if ports `5000` or `8081` are already in use. If so, update them in `docker-compose.yml`.
