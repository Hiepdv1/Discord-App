############################### 
# BUILD STAGE
###############################
FROM node:20-bullseye AS build

# Set the working directory
WORKDIR /usr/src/app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    make \
    g++ \
    python3 \
    python3-pip \
    libtool \
    autoconf \
    automake \
    zlib1g-dev \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    libvips-dev \
    libstdc++6 \
    libgcc-s1 \
    libopus0 \
    libopus-dev \
    libssl-dev \
    git \
    bash \
    gcc \
    build-essential \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./ 

RUN npm ci --unsafe-perm

# Install dependencies with WebRTC
RUN npm install wrtc@latest --build-from-source

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

############################### 
# PRODUCTION STAGE
###############################
FROM node:20-bullseye AS production

WORKDIR /usr/src/app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libstdc++6 \
    libgcc-s1 \
    libopus0 \
    openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy only necessary files
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Create logs directory and set permissions
RUN mkdir -p /usr/src/app/appLogs && \
    chown -R node:node /usr/src/app && \
    chown -R node:node /usr/src/app/appLogs && \
    chmod -R 755 /usr/src/app && \
    chmod 2755 /usr/src/app/appLogs

# Set environment for production
ENV NODE_ENV=production

# Add non-root user
USER node

# Expose WebRTC ports
EXPOSE 3001
EXPOSE 5349
EXPOSE 5349/udp
EXPOSE 3478
EXPOSE 3478/udp

# Production start command
CMD ["node", "dist/main.js"]
