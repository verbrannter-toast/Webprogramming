# Production stage
FROM node:20-alpine

# needed for sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY . .
WORKDIR /app/streaming-service
RUN npm install
EXPOSE 3000 5000
CMD ["npm", "run", "dev"]