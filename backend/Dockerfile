# Use a Node.js base image
FROM node:23-alpine

# Set the working directory
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production --no-cache

# Copy the rest of the application files
COPY . .

# Accept port as a build argument
ARG PORT=5000
ENV PORT=$PORT

# Expose the backend port dynamically
EXPOSE $PORT

# Use environment variables for configuration
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "server.js"]
