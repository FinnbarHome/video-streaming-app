# Use a Node.js base image
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package files first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production --no-cache

# Copy the rest of the application files
COPY . .

# Accept port as a build argument
ARG PORT=3000
# Set the port as an environment variable
ENV PORT=$PORT

# Expose the video host port dynamically
EXPOSE $PORT

# Start the video host server
CMD ["node", "server.js"]
