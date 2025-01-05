# Build stage for client (frontend)
FROM node:20 AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using yarn)
COPY client/package*.json ./
RUN npm install

# Copy all the client source code into the container
COPY client/ .

# Build for production
RUN npm run build

# Development stage (for development environment)
FROM node:20 AS dev

WORKDIR /app

# Copy files from the build stage
COPY --from=build /app /app

# Install development dependencies
RUN npm install

EXPOSE 3000

# CMD for development environment
CMD ["npm", "run", "dev"]

# Production stage (for production environment)
FROM node:20 AS prod

WORKDIR /app

# Copy files from the build stage
COPY --from=build /app /app

# Install only production dependencies
RUN npm install

EXPOSE 3000

# CMD for production environment
CMD ["npm", "run", "start:prod"]
