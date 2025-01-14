# Build Stage
FROM node:22-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json tsconfig.json ./

RUN npm ci

# Copy application code
COPY . .

# Build the frontend
RUN npm run build

# Serve Stage
FROM nginx:1.26.2-alpine

# Copy built files to NGINX's HTML directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose the port for NGINX
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
