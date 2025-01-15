# Build stage
FROM node:23-alpine AS build

# Set working directory
WORKDIR /app

# Copy only package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install --no-cache --production=false

# Copy the rest of the application files
COPY . .

# Accept build arguments for Vite environment variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build the Vite app
RUN npm run build

# Serve stage
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy only the built files and server files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --production --no-cache

# Expose the frontend port
EXPOSE 8081

# Start the server
CMD ["node", "server.js"]
