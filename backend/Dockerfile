# Use a Node.js base image
FROM node:23-alpine

# Set the working directory
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the backend port
EXPOSE 5000

# Use environment variables for configuration 
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "server.js"]
