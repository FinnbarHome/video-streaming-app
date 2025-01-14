# Build stage
FROM node:23-alpine AS build
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve stage
FROM node:23-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server.js ./server.js
COPY package*.json ./  
RUN npm install        
EXPOSE 8081
CMD ["node", "server.js"]
