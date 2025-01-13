# Use the Node.js Alpine base image
FROM node:22-alpine

# Set environment to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./

RUN npm ci --only=production

# Copy application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the backend server
CMD ["npm", "run", "dev"]
