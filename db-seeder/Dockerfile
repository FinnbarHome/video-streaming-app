# Use a Node.js base image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install production dependencies
RUN npm install --production --no-cache

# Copy the rest of the application
COPY . .

# Run clear + seed as a one-shot container
CMD ["sh", "-c", "node clear-db.js && node seed.js"]


