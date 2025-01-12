############################### 
# BUILD STAGE
###############################
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache \
    make \
    g++ \
    python3 \
    py3-pip \
    libtool \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    vips-dev \
    libstdc++ \
    gcc \
    curl \
    openssl \
    git \
    bash \
    build-base \
    opus-dev

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install
RUN npm install -g @nestjs/cli
RUN npm install --save multer sharp
# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

############################### 
# PRODUCTION STAGE
###############################
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Create logs directory and set permissions
RUN mkdir -p /usr/src/app/appLogs && \
    chown -R node:node /usr/src/app && \
    chown -R node:node /usr/src/app/appLogs && \
    chmod -R 755 /usr/src/app && \
    chmod 2755 /usr/src/app/appLogs
    
# Copy package.json files
COPY package*.json ./

# Copy build files from build stage
COPY --from=build /usr/src/app/dist ./dist

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Set environment for production
ENV PORT=3001
ENV NODE_ENV=production

# Add non-root user
USER node

# Expose WebRTC ports
EXPOSE $PORT
EXPOSE 5349
EXPOSE 5349/udp
EXPOSE 3478
EXPOSE 3478/udp

# Production start command
CMD ["sh", "-c", "node dist/main.js"]
