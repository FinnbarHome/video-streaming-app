# Build stage
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM node:16
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server.js ./server.js
RUN npm install
EXPOSE 8080
CMD ["node", "server.js"]
